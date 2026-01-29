"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RegisterButtonProps {
  eventId: string;
  isRegistered: boolean;
  isFull: boolean;
  isStudent: boolean;
}

export function RegisterButton({
  eventId,
  isRegistered,
  isFull,
  isStudent,
}: RegisterButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function onRegister() {
    if (!isStudent) {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only students can register for events.",
        });
        return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      toast({
        title: "Success",
        description: "Successfully registered for event",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to register",
      });
    } finally {
      setLoading(false);
    }
  }

  if (isRegistered) {
    return <Button disabled>Registered</Button>;
  }

  if (isFull) {
    return <Button disabled variant="destructive">Event Full</Button>;
  }

  return (
    <Button onClick={onRegister} disabled={loading}>
      {loading ? "Registering..." : "Register Now"}
    </Button>
  );
}
