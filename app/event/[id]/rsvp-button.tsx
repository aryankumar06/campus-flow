"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RSVPButton({ eventId }: { eventId: string }) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!session) {
      router.push(`/login?from=/event/${eventId}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Registered", description: "Check My Events for your ticket" });
        router.push("/my-events");
      } else {
        toast({ variant: "destructive", title: "Error", description: data || "Failed" });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={onClick} disabled={loading}>
      {loading ? "Registering..." : "Register"}
    </Button>
  );
}
