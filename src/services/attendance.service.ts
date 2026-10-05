import { getTenantPrisma } from "@/lib/db/tenant-prisma";
import { z } from "zod";

export const MarkAttendanceSchema = z.object({
  termId: z.string().min(1, "Term ID is required"),
  date: z.coerce.date(),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
      remarks: z.string().optional(),
    })
  ).min(1, "Must submit at least one attendance entry"),
});

export type MarkAttendanceInput = z.infer<typeof MarkAttendanceSchema>;

export class AttendanceService {
  constructor(private readonly schoolId: string) {}

  /**
   * Bulk records/updates daily attendance for a list of students
   */
  async markAttendance(input: MarkAttendanceInput) {
    const db = getTenantPrisma(this.schoolId);

    return await db.$transaction(
      input.records.map((rec) =>
        db.attendance.upsert({
          where: {
            studentId_date: {
              studentId: rec.studentId,
              date: input.date,
            },
          },
          update: {
            status: rec.status,
            remarks: rec.remarks,
            termId: input.termId,
          },
          create: {
            schoolId: this.schoolId,
            termId: input.termId,
            studentId: rec.studentId,
            date: input.date,
            status: rec.status,
            remarks: rec.remarks,
          },
        })
      )
    );
  }

  /**
   * Returns daily attendance statistics for a given date range to power Recharts analytics
   */
  async getAttendanceTrends(startDate: Date, endDate: Date) {
    const db = getTenantPrisma(this.schoolId);

    const records = await db.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        status: true,
      },
    });

    // Group by formatted date
    const dateMap = new Map<string, { date: string; present: number; absent: number; late: number }>();

    for (const r of records) {
      const key = r.date.toISOString().split("T")[0];
      if (!dateMap.has(key)) {
        dateMap.set(key, { date: key, present: 0, absent: 0, late: 0 });
      }
      const entry = dateMap.get(key)!;
      if (r.status === "PRESENT") entry.present++;
      else if (r.status === "ABSENT") entry.absent++;
      else if (r.status === "LATE") entry.late++;
    }

    return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }
}
