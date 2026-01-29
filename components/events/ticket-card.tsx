import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, QrCodeIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";

interface TicketCardProps {
  registration: {
    id: string;
    qrCode: string;
    attended: boolean;
    createdAt: string | Date;
    event: {
      id: string;
      title: string;
      description: string | null;
      dateTime: string | Date;
      venue: string;
      category: string;
    };
  };
}

export function TicketCard({ registration }: TicketCardProps) {
  const event = registration.event;
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary">{event.category}</Badge>
          <div className="flex items-center gap-2 text-xs">
            <QrCodeIcon className="h-4 w-4" />
            {registration.attended ? "Attended" : "Not attended"}
          </div>
        </div>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(new Date(event.dateTime), "PPP p")}
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-2 h-4 w-4" />
            {event.venue}
          </div>
          <div className="text-xs">Ticket ID: {registration.qrCode}</div>
        </div>
        <div className="flex items-center justify-center p-2 border rounded-md">
          <QRCodeCanvas value={registration.qrCode} size={160} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            const canvas = document.querySelector("canvas");
            if (!canvas) return;
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `${event.title}-ticket.png`;
            link.click();
          }}
        >
          Download QR
        </Button>
      </CardFooter>
    </Card>
  );
}
