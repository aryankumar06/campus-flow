import { db } from "@/lib/db";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RSVPButton from "./rsvp-button";

interface PageProps {
  params: { id: string };
}

export default async function EventDetailPage({ params }: PageProps) {
  const event = await db.event.findUnique({
    where: { id: params.id },
    include: {
      organizer: { select: { name: true } },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    return <div className="py-10 text-center text-muted-foreground">Event not found</div>;
  }

  const remaining = Math.max(0, event.capacity - (event._count?.registrations || 0));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge variant="secondary">{event.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {event._count?.registrations || 0} / {event.capacity} registered
            </span>
          </div>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(event.dateTime), "PPP p")}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4" />
                {event.venue}
              </div>
              <div className="flex items-center">
                <UsersIcon className="mr-2 h-4 w-4" />
                Capacity: {event.capacity} ({remaining} left)
              </div>
              <div>Organizer: {event.organizer?.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">{event.description}</div>
            </div>
          </div>
          <div className="pt-4">
            <RSVPButton eventId={event.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
