"use client";

import { useEffect, useState } from "react";
import { TicketCard } from "@/components/events/ticket-card";
import { useToast } from "@/hooks/use-toast";

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await fetch("/api/my-events");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your events",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Events</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading tickets...</div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          You have not registered for any events yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((registration) => (
            <TicketCard key={registration.id} registration={registration} />
          ))}
        </div>
      )}
    </div>
  );
}
