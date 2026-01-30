import { PricingDemo } from "@/components/pricing-demo";
import { Footer } from "@/components/ui/footer-section";
import { FlipLink } from "@/components/ui/flip-links";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover and Manage College Events
            </h1>
            <p className="text-muted-foreground text-lg">
              Students can find and register for upcoming events. Organizers can create,
              manage, and track attendance with QR codes — all in one place.
            </p>
            <div className="flex gap-3">
              <a
                href="/events"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition"
              >
                Browse Events
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
              >
                Login
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
              >
                Sign Up
              </a>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground p-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Upcoming</span>
                <span className="text-sm">Tech Talk: Modern Web</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cultural</span>
                <span className="text-sm">Annual Music Fest</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Intro Section */}
      <section className="py-24 bg-zinc-950 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em] mb-4">
              What we offer
            </h2>
            <FlipLink href="/events" className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white">
              Discover
            </FlipLink>
            <FlipLink href="/create-event" className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-primary">
              Organize
            </FlipLink>
            <FlipLink href="/my-events" className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white">
              Experience
            </FlipLink>
          </div>
        </div>
      </section>
      
      <PricingDemo />
    </div>
  );
}
