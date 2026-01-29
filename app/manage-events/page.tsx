"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/manage-events");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEvents(data);
    } catch {
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
      <h1 className="text-3xl font-bold">Manage Events</h1>
      {loading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : events.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">No events found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline">{event.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {event._count?.registrations || 0} registered
                  </span>
                </div>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.dateTime), "PPP p")}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/manage-events/${event.id}/attendance`}>
                  <Button>Scan Attendance</Button>
                </Link>
                <Link href={`/event/${event.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
