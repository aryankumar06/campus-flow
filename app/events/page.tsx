import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { CalendarIcon, MapPinIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

interface EventsPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { category, search } = searchParams;

  const whereClause: any = {
    dateTime: {
      gte: new Date(), // Only future events
    },
  };

  if (category) {
    whereClause.category = category;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const events = await db.event.findMany({
    where: whereClause,
    orderBy: {
      dateTime: "asc",
    },
    include: {
        _count: {
            select: { registrations: true }
        }
    }
  });

  const categories = ["TECHNICAL", "CULTURAL", "SPORTS", "OTHER"];

  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <div className="flex gap-2 w-full md:w-auto">
            <form className="flex gap-2 w-full">
                <Input 
                    name="search" 
                    placeholder="Search events..." 
                    defaultValue={search}
                    className="max-w-sm"
                />
                <Button type="submit">Search</Button>
            </form>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Link href="/events">
          <Badge variant={!category ? "default" : "outline"} className="cursor-pointer">
            All
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/events?category=${cat}`}>
            <Badge
              variant={category === cat ? "default" : "outline"}
              className="cursor-pointer"
            >
              {cat}
            </Badge>
          </Link>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No upcoming events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <Card key={event.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">{event.category}</Badge>
                  {event.imageUrl && (
                      <div className="text-xs text-muted-foreground">Image</div>
                  )}
                </div>
                <CardTitle className="line-clamp-1 mt-2">{event.title}</CardTitle>
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
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <div className="text-sm text-muted-foreground">
                    {event._count.registrations} / {event.capacity} registered
                </div>
                <Link href={`/event/${event.id}`}>
                  <Button>View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
