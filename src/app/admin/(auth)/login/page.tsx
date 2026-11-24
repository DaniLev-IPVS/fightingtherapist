import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/auth-forms";

export const metadata = { title: "Sign in" };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="display text-[36px] text-charcoal">Sign in</h1>
        <p className="text-[15px] text-steel">Leads, pipeline and products for The Fighting Therapist.</p>
      </div>
      <Suspense fallback={<LoginForm />}>
        <LoginBody searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LoginBody({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  if (await getSessionUser()) redirect("/admin");
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : undefined} />;
}
