import { getTenantPrisma } from "@/lib/db/tenant-prisma";
import { NotificationService } from "@/lib/notifications/notification.service";
import { z } from "zod";

export const CreateExamSchema = z.object({
  termId: z.string().min(1, "Term ID required"),
  subjectId: z.string().min(1, "Subject ID required"),
  name: z.string().min(2, "Exam title required"),
  totalMark: z.number().positive().default(100),
  examDate: z.coerce.date(),
});

export const SubmitResultSchema = z.object({
  examId: z.string().min(1),
  studentId: z.string().min(1),
  score: z.number().min(0),
  grade: z.string().optional(),
  remarks: z.string().optional(),
});

export class ExaminationService {
  constructor(private readonly schoolId: string) {}

  /**
   * Schedules a new examination
   */
  async createExam(input: z.infer<typeof CreateExamSchema>) {
    const db = getTenantPrisma(this.schoolId);
    return await db.exam.create({
      data: {
        schoolId: this.schoolId,
        termId: input.termId,
        subjectId: input.subjectId,
        name: input.name,
        totalMark: input.totalMark,
        examDate: input.examDate,
      },
    });
  }

  /**
   * Submits or updates an exam result for a student (Draft / Pending Approval)
   */
  async submitResult(input: z.infer<typeof SubmitResultSchema>) {
    const db = getTenantPrisma(this.schoolId);

    // Auto-calculate grade letter if not explicitly supplied
    let gradeLetter = input.grade;
    if (!gradeLetter) {
      if (input.score >= 90) gradeLetter = "A+";
      else if (input.score >= 80) gradeLetter = "A";
      else if (input.score >= 70) gradeLetter = "B";
      else if (input.score >= 60) gradeLetter = "C";
      else if (input.score >= 50) gradeLetter = "D";
      else gradeLetter = "F";
    }

    return await db.examResult.upsert({
      where: {
        examId_studentId: {
          examId: input.examId,
          studentId: input.studentId,
        },
      },
      update: {
        score: input.score,
        grade: gradeLetter,
        remarks: input.remarks,
        isApproved: false, // Reset approval on grade modification
      },
      create: {
        examId: input.examId,
        studentId: input.studentId,
        score: input.score,
        grade: gradeLetter,
        remarks: input.remarks,
        isApproved: false,
      },
    });
  }

  /**
   * Approves student results (Principal / School Admin action)
   */
  async approveResults(examId: string, approverUserId: string) {
    const db = getTenantPrisma(this.schoolId);

    const updated = await db.examResult.updateMany({
      where: { examId },
      data: {
        isApproved: true,
        approvedBy: approverUserId,
      },
    });

    return updated;
  }

  /**
   * Publishes exam results to students and parents
   */
  async publishExamResults(examId: string) {
    const db = getTenantPrisma(this.schoolId);

    const exam = await db.exam.update({
      where: { id: examId },
      data: { isPublished: true },
      include: {
        subject: true,
        results: {
          include: {
            student: {
              include: { guardians: { include: { parent: { include: { user: true } } } } },
            },
          },
        },
      },
    });

    // Notify parents that results are published
    for (const res of exam.results) {
      const parentUser = res.student.guardians[0]?.parent?.user;
      if (parentUser?.email) {
        await NotificationService.send({
          recipient: {
            name: parentUser.name,
            email: parentUser.email,
          },
          subject: `Results Published: ${exam.name} - ${exam.subject.name}`,
          message: `Dear ${parentUser.name},\n\nExamination results for ${res.student.firstName} have been published for ${exam.subject.name}. Score: ${res.score} (${res.grade}).`,
          channels: ["EMAIL"],
        });
      }
    }

    return exam;
  }
}
