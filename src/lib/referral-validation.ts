import { LIMITS, takeText, type FieldError } from "./validation.ts";

export function validateReferrer(payload: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const textErrors: FieldError[] = [];
  const fullName = takeText(payload.fullName, "fullName", LIMITS.fullName, textErrors);
  const email = takeText(payload.email, "email", LIMITS.email, textErrors)?.toLowerCase();
  const phone = takeText(payload.phone, "phone", LIMITS.phone, textErrors);
  const institution = takeText(payload.institution, "institution", LIMITS.institution, textErrors);

  if (!fullName) errors.fullName = "Full name is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!phone) errors.phone = "Contact phone number is required.";
  if (!institution) errors.institution = "Institution / university name is required.";
  if (payload.agreedToTerms !== "on") errors.agreedToTerms = "Please agree to the Code of Conduct.";
  for (const error of textErrors) errors[error.field] = error.message;

  return {
    errors,
    data: Object.keys(errors).length === 0
      ? { fullName: fullName!, email: email!, phone: phone!, institution: institution! }
      : null,
  };
}
