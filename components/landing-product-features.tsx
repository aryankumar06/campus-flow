import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import {
  QrCode,
  Users,
  Calendar,
  BarChart,
  Search,
  Zap,
} from "lucide-react";

// --- Components for the Campus Event App Showcase ---

const IntegrationCard = () => (
  <Card className="flex h-full flex-col">
    <CardHeader>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <QrCode className="h-6 w-6 text-primary" />
      </div>
      <CardTitle>QR Check-ins</CardTitle>
      <CardDescription>
        Streamline entry with instant QR code scanning. No more paper lists
        or long queues. Authenticate attendees in milliseconds.
      </CardDescription>
    </CardHeader>
    <CardFooter className="mt-auto flex items-center justify-between">
      <Button variant="outline" size="sm">
        <Zap className="mr-2 h-4 w-4" />
        Start Scan
      </Button>
      <Switch
        defaultChecked
        className="data-[state=checked]:bg-primary"
        aria-label="Toggle scanning"
      />
    </CardFooter>
  </Card>
);

const TrackersCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-between p-6">
      <div>
        <CardTitle className="text-base font-medium">
          Live Attendance
        </CardTitle>
        <CardDescription>Real-time status</CardDescription>
      </div>
      <div className="flex -space-x-2 overflow-hidden">
        <img
          className="inline-block h-8 w-8 rounded-full ring-2 ring-background"
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
          alt="Student 1"
        />
        <img
          className="inline-block h-8 w-8 rounded-full ring-2 ring-background"
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80"
          alt="Student 2"
        />
        <img
          className="inline-block h-8 w-8 rounded-full ring-2 ring-background"
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
          alt="Student 3"
        />
        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted text-xs font-medium">
          +42
        </div>
      </div>
    </CardContent>
  </Card>
);

const FocusCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-between p-6">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base font-medium">Engagement</CardTitle>
          <CardDescription>Student participation</CardDescription>
        </div>
        <Badge variant="outline" className="border-green-500 text-green-600">
          +12%
        </Badge>
      </div>
      <div>
        <span className="text-5xl font-bold">85%</span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Turnout Rate</span>
        <span>vs Last Month</span>
      </div>
    </CardContent>
  </Card>
);

const StatisticCard = () => (
  <Card className="relative h-full w-full overflow-hidden">
    {/* Dotted background */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
    <CardContent className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
      <span className="text-6xl font-bold text-foreground">500+</span>
      <span className="text-sm font-medium text-muted-foreground mt-2">Events Managed</span>
    </CardContent>
  </Card>
);

const ProductivityCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-end p-6">
      <div className="mb-4 rounded-full bg-primary/10 w-fit p-2">
        <Calendar className="h-6 w-6 text-primary" />
      </div>
      <CardTitle className="text-base font-medium">
        Easy Scheduling
      </CardTitle>
      <CardDescription>
        Plan your semester with intuitive calendar tools and reminders.
      </CardDescription>
    </CardContent>
  </Card>
);

const ShortcutsCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-wrap items-center justify-between gap-4 p-6">
      <div>
        <CardTitle className="text-base font-medium">Quick Search</CardTitle>
        <CardDescription>
          Find events, clubs, and venues in seconds.
        </CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted/50 font-mono text-xs font-medium text-foreground">
          <span className="sr-only">Command</span>⌘
        </div>
        <span className="text-muted-foreground">+</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted/50 font-mono text-xs font-medium text-foreground">
          K
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- The Integration Component ---
export default function LandingProductFeatures() {
  return (
    <div className="w-full py-12 lg:py-24 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to run campus events
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From creation to completion, our platform gives you the tools to
            manage events, track attendance, and engage your community.
          </p>
        </div>

        <BentoGridShowcase
          integration={<IntegrationCard />}
          trackers={<TrackersCard />}
          statistic={<StatisticCard />}
          focus={<FocusCard />}
          productivity={<ProductivityCard />}
          shortcuts={<ShortcutsCard />}
        />
      </div>
    </div>
  );
}
