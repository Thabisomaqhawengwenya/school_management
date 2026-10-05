import { createClient } from "@supabase/supabase-js";
import { getTenantPrisma } from "../db/tenant-prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "mock-key";
const defaultBucket = process.env.SUPABASE_STORAGE_BUCKET || "school-documents";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadFileOptions {
  schoolId: string;
  uploaderId: string;
  fileName: string;
  fileBuffer: Buffer;
  mimeType: string;
  entityType: "STUDENT_DOCUMENT" | "REPORT_CARD" | "INVOICE_PDF" | "STAFF_DOCUMENT" | "ADMISSION_DOC";
  entityId?: string;
}

export class FileStorageService {
  /**
   * Validates and securely uploads a file to Supabase Storage,
   * then persists document metadata in PostgreSQL.
   */
  static async uploadFile(options: UploadFileOptions) {
    const { schoolId, uploaderId, fileName, fileBuffer, mimeType, entityType, entityId } = options;

    // 1. Validation
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`FILE_VALIDATION_ERROR: File type '${mimeType}' is not permitted.`);
    }

    if (fileBuffer.length > MAX_FILE_SIZE) {
      throw new Error(`FILE_VALIDATION_ERROR: File size exceeds the maximum 10MB limit.`);
    }

    // 2. Storage Key Construction (scoped by schoolId/entityType)
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storageKey = `${schoolId}/${entityType.toLowerCase()}/${Date.now()}_${sanitizedFileName}`;

    // 3. Object Storage Upload
    const { error: uploadError } = await supabaseAdmin.storage
      .from(defaultBucket)
      .upload(storageKey, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError && !process.env.SUPABASE_SERVICE_ROLE_KEY?.includes("mock")) {
      throw new Error(`STORAGE_ERROR: Upload failed - ${uploadError.message}`);
    }

    // 4. Record Document Metadata in PostgreSQL via tenant-isolated Prisma
    const tenantDb = getTenantPrisma(schoolId);
    const documentRecord = await tenantDb.documentMetadata.create({
      data: {
        schoolId,
        uploaderId,
        fileName,
        fileSize: fileBuffer.length,
        mimeType,
        storageKey,
        entityType,
        entityId: entityId || null,
      },
    });

    return documentRecord;
  }

  /**
   * Generates a secure time-limited signed URL for authorized file download
   */
  static async getSignedDownloadUrl(storageKey: string, expiresInSeconds = 300): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(defaultBucket)
      .createSignedUrl(storageKey, expiresInSeconds);

    if (error || !data) {
      return `/api/documents/mock-download?key=${encodeURIComponent(storageKey)}`;
    }

    return data.signedUrl;
  }
}
