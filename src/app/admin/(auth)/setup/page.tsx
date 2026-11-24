import { Suspense } from "react";
import Link from "next/link";
import { SetupForm } from "@/components/admin/auth-forms";

export const metadata = { title: "Set your password" };

export default function SetupPage({ searchParams }: PageProps<"/admin/setup">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="display text-[36px] text-charcoal">Set your password</h1>
        <p className="text-[15px] text-steel">You&apos;ll use it with your email to sign in to the admin.</p>
      </div>
      <Suspense fallback={null}>
        <SetupBody searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SetupBody({ searchParams }: { searchParams: PageProps<"/admin/setup">["searchParams"] }) {
  const { token } = await searchParams;
  if (typeof token !== "string" || token.length < 20) {
    return (
      <p className="text-[15px] text-steel">
        This page needs the link from your invite. Already set up?{" "}
        <Link href="/admin/login" className="text-blue underline">
          Sign in
        </Link>
        .
      </p>
    );
  }
  return <SetupForm token={token} />;
}
