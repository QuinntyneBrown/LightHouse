export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  CONTENT_ADMIN: "CONTENT_ADMIN",
  REVIEWER: "REVIEWER",
  CHURCH_ADMIN: "CHURCH_ADMIN",
  PARENT: "PARENT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.CONTENT_ADMIN,
] as const;

export const REVIEWER_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.CONTENT_ADMIN,
  ROLES.REVIEWER,
] as const;

export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  CONTENT_ADMIN: 80,
  REVIEWER: 60,
  CHURCH_ADMIN: 40,
  PARENT: 10,
};
