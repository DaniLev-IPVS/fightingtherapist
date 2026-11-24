import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { ChangePasswordForm } from "@/components/admin/auth-forms";

export const metadata = { title: "Change your password" };

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={null}>
      <Body />
    </Suspense>
  );
}

async function Body() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="display text-[36px] text-charcoal">
          {user.must_change_password ? "Pick your own password" : "Change your password"}
        </h1>
        <p className="text-[15px] text-steel">
          {user.must_change_password
            ? `Welcome, ${user.name}. You signed in with a temporary password. Choose a new one to continue.`
            : `Signed in as ${user.email}.`}
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
