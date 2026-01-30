import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, QrCodeIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TicketCardProps {
  registration: {
    id: string;
    qrCode: string;
    attended: boolean;
    canceledAt?: string | Date | null;
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
  onCanceled?: (registrationId: string) => void;
}

export function TicketCard({ registration, onCanceled }: TicketCardProps) {
  const event = registration.event;
  const { toast } = useToast();
  const [cancelLoading, setCancelLoading] = useState(false);
  const eventDate = new Date(event.dateTime);
  const isCancelable =
    !registration.attended &&
    !registration.canceledAt &&
    eventDate > new Date();
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary">{event.category}</Badge>
          <div className="flex items-center gap-2 text-xs">
            <QrCodeIcon className="h-4 w-4" />
            {registration.canceledAt
              ? "Canceled"
              : registration.attended
              ? "Attended"
              : "Not attended"}
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
      <CardFooter className="flex justify-between gap-2">
        <div />
        <div className="flex items-center gap-2">
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
          <Button
            variant="destructive"
            disabled={!isCancelable || cancelLoading}
            onClick={async () => {
              try {
                setCancelLoading(true);
                const res = await fetch(
                  `/api/registrations/${registration.id}/cancel`,
                  { method: "POST" }
                );
                if (!res.ok) {
                  const msg = await res.text();
                  throw new Error(msg);
                }
                toast({
                  title: "Registration canceled",
                  description: "Your ticket has been canceled",
                });
                onCanceled?.(registration.id);
              } catch (e: any) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: e.message || "Failed to cancel registration",
                });
              } finally {
                setCancelLoading(false);
              }
            }}
          >
            {cancelLoading ? "Canceling..." : "Cancel Registration"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
