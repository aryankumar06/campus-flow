"use client";

import { PricingCard } from "@/components/ui/dark-gradient-pricing"

function PricingDemo() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:px-8">
        <div className="mb-12 space-y-3">
          <h2 className="text-center text-3xl font-semibold leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
            Pricing
          </h2>
          <p className="text-center text-base text-muted-foreground md:text-lg">
            Use it for free for yourself, upgrade when your team needs advanced
            control.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <PricingCard
            tier="Free"
            price="Student"
            bestFor="Individuals & Learners"
            CTA="Get started free"
            benefits={[
              { text: "Event Discovery Feed", checked: true },
              { text: "Academics Hub Access", checked: true },
              { text: "Assignment Submission", checked: true },
              { text: "Personal Activity Chart", checked: true },
              { text: "Club Admin Tools", checked: false },
              { text: "Smart Seating System", checked: false },
            ]}
          />
          <PricingCard
            tier="Pro"
            price="Club Admin"
            bestFor="Clubs & Tech Societies"
            CTA="Upgrade now"
            benefits={[
              { text: "All Student Features", checked: true },
              { text: "Unlimited Event Hosting", checked: true },
              { text: "QR Attendance Suite", checked: true },
              { text: "Announcement Board", checked: true },
              { text: "Coding Duels Manager", checked: true },
              { text: "Smart Seating System", checked: false },
            ]}
          />
          <PricingCard
            tier="Institution"
            price="Custom"
            bestFor="University-wide Adoption"
            CTA="Contact Sales"
            benefits={[
              { text: "Everything in Pro", checked: true },
              { text: "Smart Seating Engine", checked: true },
              { text: "Activity Credit Engine", checked: true },
              { text: "Anonymous Grievance Hub", checked: true },
              { text: "Mentor Network Access", checked: true },
              { text: "Custom Sub-admin Roles", checked: true },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

export { PricingDemo }
