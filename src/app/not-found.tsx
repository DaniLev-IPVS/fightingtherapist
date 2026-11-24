import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-charcoal pb-28 pt-40 text-off-white">
      <Container className="flex flex-col items-start gap-6">
        <p className="eyebrow text-blue-pale">404</p>
        <h1 className="display text-[64px] leading-[0.9] sm:text-[96px]">This page tapped out.</h1>
        <p className="max-w-[44ch] text-[19px] text-mist">The link may be old or mistyped. Here are the best places to go next.</p>
        <div className="flex flex-wrap gap-3">
          <Button href="/">Home</Button>
          <Button href="/programs" variant="ghost-light">Programs</Button>
        </div>
      </Container>
    </section>
  );
}
