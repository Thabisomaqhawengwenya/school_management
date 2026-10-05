import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/permissions.types";

interface RoleBadgeProps {
  role: UserRole | string;
}

const roleVariants: Record<
  string,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "info" | "outline" }
> = {
  SUPER_ADMIN: { label: "Super Admin", variant: "default" },
  SCHOOL_ADMIN: { label: "Admin", variant: "info" },
  PRINCIPAL: { label: "Principal", variant: "info" },
  TEACHER: { label: "Teacher", variant: "success" },
  ACCOUNTANT: { label: "Accountant", variant: "warning" },
  ADMISSIONS_OFFICER: { label: "Admissions", variant: "secondary" },
  PARENT: { label: "Parent", variant: "outline" },
  STUDENT: { label: "Student", variant: "outline" },
  LIBRARIAN: { label: "Librarian", variant: "secondary" },
  RECEPTIONIST: { label: "Receptionist", variant: "secondary" },
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleVariants[role] || { label: role, variant: "secondary" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
