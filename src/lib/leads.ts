/** Shared lead shape and validation for the form and the API route. */

export const GOALS = [
  { value: "rehab", label: "Rehab an injury" },
  { value: "training", label: "Get stronger / 1:1 coaching" },
  { value: "nutrition", label: "Lose fat / nutrition" },
  { value: "fight-camp", label: "Fight camp weight cut" },
  { value: "group", label: "10-week group program" },
  { value: "other", label: "Not sure yet" },
] as const;

export type GoalValue = (typeof GOALS)[number]["value"];

export type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  goal: GoalValue;
  message?: string;
  offer?: string;
  pageType?: "home" | "contact" | "programs" | "sales" | "landing" | "other";
  attribution?: unknown;
  company?: string; // honeypot, must stay empty
};

export type LeadErrors = Partial<Record<"name" | "email" | "phone" | "goal" | "message", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLead(input: Partial<LeadInput>): LeadErrors {
  const errors: LeadErrors = {};
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const phone = (input.phone ?? "").trim();
  if (name.length < 2) errors.name = "Enter your name.";
  else if (name.length > 120) errors.name = "Keep your name under 120 characters.";
  if (!EMAIL.test(email)) errors.email = "Enter an email like name@example.com.";
  if (phone && !/^[+()\-.\s\d]{7,25}$/.test(phone)) errors.phone = "Enter a phone number with digits only.";
  if (!GOALS.some((g) => g.value === input.goal)) errors.goal = "Pick what you need help with.";
  if ((input.message ?? "").length > 2000) errors.message = "Keep your message under 2,000 characters.";
  return errors;
}
