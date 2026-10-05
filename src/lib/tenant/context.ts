import { headers } from "next/headers";
import { prisma } from "../db/prisma";

export interface ResolvedTenant {
  schoolId: string;
  name: string;
  slug: string;
  currency: string;
}

/**
 * Resolves the active tenant from request headers or subdomain.
 */
export async function getTenantContext(): Promise<ResolvedTenant | null> {
  const headerList = await headers();
  const schoolSlug = headerList.get("x-school-slug") || headerList.get("x-tenant-slug");
  const schoolId = headerList.get("x-school-id");

  if (schoolId) {
    const school = await prisma.school.findUnique({
      where: { id: schoolId, isActive: true, deletedAt: null },
      select: { id: true, name: true, slug: true, currency: true },
    });
    if (school) {
      return {
        schoolId: school.id,
        name: school.name,
        slug: school.slug,
        currency: school.currency,
      };
    }
  }

  if (schoolSlug) {
    const school = await prisma.school.findUnique({
      where: { slug: schoolSlug, isActive: true, deletedAt: null },
      select: { id: true, name: true, slug: true, currency: true },
    });
    if (school) {
      return {
        schoolId: school.id,
        name: school.name,
        slug: school.slug,
        currency: school.currency,
      };
    }
  }

  return null;
}
