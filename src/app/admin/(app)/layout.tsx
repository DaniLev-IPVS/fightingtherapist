import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/dal";
import { signOut } from "@/app/admin/actions";
import { AdminNav, NavLinks } from "@/components/admin/nav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-off-white md:grid md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="flex items-center justify-between gap-4 bg-charcoal px-5 py-4 text-off-white md:sticky md:top-0 md:h-svh md:flex-col md:items-stretch md:justify-start md:gap-8 md:py-7">
        <Link href="/admin" className="shrink-0">
          <Image src="/images/logo-light.png" alt="The Fighting Therapist admin" width={347} height={243} className="h-auto w-[64px] md:w-[96px]" />
        </Link>
        <Suspense fallback={<NavLinks path={null} />}>
          <AdminNav />
        </Suspense>
        <div className="hidden md:mt-auto md:flex md:flex-col md:gap-3">
          <Suspense fallback={null}>
            <SignedInAs />
          </Suspense>
          <Link href="/" className="text-[13px] text-steel-light hover:text-white">
            View site
          </Link>
        </div>
      </aside>
      <main id="main" className="min-w-0 px-5 py-8 md:px-10 md:py-10">
        <Suspense fallback={<p className="text-steel">Loading…</p>}>
          <Gate>{children}</Gate>
        </Suspense>
      </main>
    </div>
  );
}

/** Blocks the page until the session checks out (redirects to sign-in otherwise). */
async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

async function SignedInAs() {
  const user = await requireAdmin();
  return (
    <form action={signOut} className="flex flex-col gap-1 border-t border-line-dark pt-4">
      <span className="text-[13px] text-mist">{user.name}</span>
      <Link href="/admin/change-password" className="text-[13px] text-steel-light underline hover:text-white">
        Change password
      </Link>
      <button type="submit" className="self-start text-[13px] text-steel-light underline hover:text-white">
        Sign out
      </button>
    </form>
  );
}
