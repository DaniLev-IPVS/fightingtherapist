import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "./session";

/**
 * Data access layer gate. Every admin page, server action and route handler
 * calls this before touching data; the proxy redirect is only a convenience.
 */
export const requireAdmin = cache(async () => {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (user.must_change_password) redirect("/admin/change-password");
  return user;
});
