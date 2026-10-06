export const ALLOWED_ADMIN_EMAILS = [
  'library@slc.ac.th',
  'akira@slc.ac.th',
];

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase()));
}
