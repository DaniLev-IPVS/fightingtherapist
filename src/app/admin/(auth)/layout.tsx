import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-charcoal px-5 py-16">
      <div className="flex w-full max-w-[400px] flex-col gap-8">
        <Image src="/images/logo-light.png" alt="The Fighting Therapist" width={347} height={243} className="h-auto w-[120px]" />
        <div className="rounded-[8px] bg-off-white p-7">{children}</div>
      </div>
    </main>
  );
}
