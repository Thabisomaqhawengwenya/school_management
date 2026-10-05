import { getTenantPrisma } from "@/lib/db/tenant-prisma";
import { NotificationService } from "@/lib/notifications/notification.service";
import { StudentService } from "./student.service";
import { z } from "zod";

export const CreateAdmissionSchema = z.object({
  applicantName: z.string().min(2, "Applicant name required"),
  applicantDob: z.coerce.date(),
  applicantGender: z.enum(["MALE", "FEMALE", "OTHER"]),
  targetGrade: z.number().int().min(1).max(12),
  parentName: z.string().min(2, "Parent name required"),
  parentEmail: z.string().email("Valid parent email required"),
  parentPhone: z.string().min(7, "Valid parent phone required"),
  notes: z.string().optional(),
});

export type CreateAdmissionInput = z.infer<typeof CreateAdmissionSchema>;

export class AdmissionService {
  constructor(private readonly schoolId: string) {}

  /**
   * Submits a new prospective student application
   */
  async submitApplication(input: CreateAdmissionInput) {
    const db = getTenantPrisma(this.schoolId);

    const application = await db.admissionApplication.create({
      data: {
        schoolId: this.schoolId,
        applicantName: input.applicantName,
        applicantDob: input.applicantDob,
        applicantGender: input.applicantGender,
        targetGrade: input.targetGrade,
        parentName: input.parentName,
        parentEmail: input.parentEmail,
        parentPhone: input.parentPhone,
        notes: input.notes,
        status: "PENDING",
      },
    });

    // Send confirmation email to parent via Resend
    await NotificationService.send({
      recipient: {
        name: input.parentName,
        email: input.parentEmail,
        phone: input.parentPhone,
      },
      subject: `Admission Application Received - ${input.applicantName}`,
      message: `Dear ${input.parentName},\n\nWe have received the admission application for ${input.applicantName} (Grade ${input.targetGrade}). Our admissions team will review your application shortly.\n\nApplication ID: ${application.id}`,
      channels: ["EMAIL", "SMS"],
    });

    return application;
  }

  /**
   * Updates application status (REVIEW, APPROVE, REJECT)
   */
  async updateStatus(
    applicationId: string,
    status: "UNDER_REVIEW" | "INTERVIEW_SCHEDULED" | "APPROVED" | "REJECTED",
    remarks?: string
  ) {
    const db = getTenantPrisma(this.schoolId);

    const updated = await db.admissionApplication.update({
      where: { id: applicationId },
      data: {
        status,
        notes: remarks ? remarks : undefined,
      },
    });

    // Notify parent on status change
    await NotificationService.send({
      recipient: {
        name: updated.parentName,
        email: updated.parentEmail,
        phone: updated.parentPhone,
      },
      subject: `Admission Update: Application ${status.replace("_", " ")}`,
      message: `Dear ${updated.parentName},\n\nThe status for applicant ${updated.applicantName} has been updated to: ${status}.\n${remarks ? `Remarks: ${remarks}` : ""}`,
      channels: ["EMAIL"],
    });

    return updated;
  }

  /**
   * Converts an APPROVED application directly into an enrolled Student record
   */
  async convertToStudent(applicationId: string, targetClassId: string) {
    const db = getTenantPrisma(this.schoolId);

    const application = await db.admissionApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("Admission application not found.");
    }

    if (application.status !== "APPROVED") {
      throw new Error("Only approved applications can be converted into active students.");
    }

    if (application.convertedStudentId) {
      throw new Error("This application has already been converted to a student.");
    }

    // Split name into first and last
    const nameParts = application.applicantName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Student";

    const studentService = new StudentService(this.schoolId);
    const newStudent = await studentService.enrollStudent({
      firstName,
      lastName,
      dateOfBirth: application.applicantDob,
      gender: application.applicantGender,
      classId: targetClassId,
      parentName: application.parentName,
      parentEmail: application.parentEmail,
      parentPhone: application.parentPhone,
      relationship: "Parent",
    });

    // Mark application as ENROLLED and save link
    await db.admissionApplication.update({
      where: { id: applicationId },
      data: {
        status: "ENROLLED",
        convertedStudentId: newStudent.id,
      },
    });

    return newStudent;
  }

  /**
   * Returns list of admissions with filter by status
   */
  async getApplications(status?: any) {
    const db = getTenantPrisma(this.schoolId);
    return await db.admissionApplication.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    });
  }
}
