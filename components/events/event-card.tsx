import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
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

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    dateTime: string | Date;
    venue: string;
    category: string;
    capacity: number;
    _count?: {
      registrations: number;
    };
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {event.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
             {event._count?.registrations || 0} / {event.capacity} registered
          </span>
        </div>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
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
            Capacity: {event.capacity}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/event/${event.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
