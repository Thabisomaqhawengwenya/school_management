import { describe, it, expect } from "vitest";
import { CreateStudentSchema } from "@/services/student.service";
import { CreateInvoiceSchema, RecordPaymentSchema } from "@/services/finance.service";
import { CreateAdmissionSchema } from "@/services/admission.service";

describe("Domain Validation Schemas (Zod)", () => {
  describe("Student Enrollment Validation", () => {
    it("should accept valid student enrollment payload", () => {
      const valid = {
        firstName: "Liam",
        lastName: "Vance",
        dateOfBirth: new Date("2010-05-14"),
        gender: "MALE",
        classId: "cls_10a",
        parentName: "Evelyn Vance",
        parentPhone: "+15552348921",
        parentEmail: "evelyn@example.com",
        relationship: "Mother",
      };
      const result = CreateStudentSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject student with invalid email or missing name", () => {
      const invalid = {
        firstName: "L",
        lastName: "",
        dateOfBirth: new Date("2010-05-14"),
        gender: "MALE",
        classId: "cls_10a",
        parentName: "E",
        parentPhone: "123",
        parentEmail: "not-an-email",
      };
      const result = CreateStudentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.parentEmail).toBeDefined();
      }
    });
  });

  describe("Invoice & Payment Validation", () => {
    it("should reject invoice with zero or negative item amount", () => {
      const invalid = {
        studentId: "std-001",
        dueDate: new Date(),
        items: [{ description: "Tuition", amount: -100 }],
      };
      const result = CreateInvoiceSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should require valid payment method", () => {
      const validPayment = {
        invoiceId: "inv-001",
        amount: 250,
        method: "BANK_TRANSFER",
      };
      expect(RecordPaymentSchema.safeParse(validPayment).success).toBe(true);

      const invalidPayment = {
        invoiceId: "inv-001",
        amount: 250,
        method: "BITCOIN",
      };
      expect(RecordPaymentSchema.safeParse(invalidPayment).success).toBe(false);
    });
  });

  describe("Admission Application Validation", () => {
    it("should enforce grade level boundaries", () => {
      const valid = {
        applicantName: "Sophia Miller",
        applicantDob: new Date("2012-08-10"),
        applicantGender: "FEMALE",
        targetGrade: 8,
        parentName: "David Miller",
        parentEmail: "david@example.com",
        parentPhone: "+15557890123",
      };
      expect(CreateAdmissionSchema.safeParse(valid).success).toBe(true);

      const invalidGrade = {
        ...valid,
        targetGrade: 15, // Out of bounds
      };
      expect(CreateAdmissionSchema.safeParse(invalidGrade).success).toBe(false);
    });
  });
});
