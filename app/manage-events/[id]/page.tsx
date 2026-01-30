"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { 
  Users, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Mail, 
  Download,
  BarChart3,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function EventDashboard() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const { toast } = useToast();

  const fetchEventDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/manage-events/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEvent(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard",
      });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    // Mocking the bulk invite automation
    toast({
      title: "Invite Sent",
      description: `Automation: Invitation email sent to ${inviteEmail}`,
    });
    setInviteEmail("");
  };

  if (loading) return <div className="py-20 text-center">Loading Dashboard...</div>;
  if (!event) return <div className="py-20 text-center">Event not found.</div>;

  const registrationRate = (event._count.registrations / event.capacity) * 100;
  const attendedCount = event.registrations.filter((r: any) => r.attended).length;
  const attendanceRate = event._count.registrations > 0 
    ? (attendedCount / event._count.registrations) * 100 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground flex items-center mt-1">
            <Calendar className="w-4 h-4 mr-1" /> {format(new Date(event.dateTime), "PPP p")}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button className="flex-1 md:flex-none" onClick={() => window.location.href=`/manage-events/${event.id}/scan`}>
            <CheckCircle className="w-4 h-4 mr-2" /> Start Scanning
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Users className="w-4 h-4 mr-2" /> Total Registrations
            </CardDescription>
            <CardTitle className="text-3xl">{event._count.registrations}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={registrationRate} className="h-1" />
            <p className="text-xs text-muted-foreground mt-2">{event.capacity} total capacity</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" /> Attendance
            </CardDescription>
            <CardTitle className="text-3xl">{attendedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={attendanceRate} className="h-1 bg-green-500/20" />
            <p className="text-xs text-muted-foreground mt-2">{attendanceRate.toFixed(1)}% show rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" /> Venue
            </CardDescription>
            <CardTitle className="text-lg line-clamp-1">{event.venue}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Confirm logistics 2 days before</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-primary">
              <BarChart3 className="w-4 h-4 mr-2" /> Marketing Reach
            </CardDescription>
            <CardTitle className="text-3xl">Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Advanced social tracking active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendee List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendee List</CardTitle>
            <CardDescription>Manage your registered students and their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.registrations.map((reg: any) => (
                  <TableRow key={reg.id}>
                    <TableCell>
                      <div className="font-medium">{reg.user.name}</div>
                      <div className="text-xs text-muted-foreground">{reg.user.email}</div>
                    </TableCell>
                    <TableCell>{reg.user.department || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={reg.attended ? "default" : "secondary"}>
                        {reg.attended ? "Attended" : "Registered"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: "Reminder Sent", description: `Reminded ${reg.user.name}`})}>
                        <Mail className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {event.registrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      No registrations yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bulk Invite Automation Tool */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" /> Bulk Invite Student
              </CardTitle>
              <CardDescription>Enter student emails to automate invites.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <Input 
                  placeholder="student@college.edu" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button className="w-full" type="submit">
                  Send Automated Invite
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  Students will receive a direct RSVP link via email.
                </p>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm">Quick Automation Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs">
                <span>Emails Delivered</span>
                <span>100%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Link Clicks</span>
                <span>42%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>RSVP Conversion</span>
                <span>15%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
