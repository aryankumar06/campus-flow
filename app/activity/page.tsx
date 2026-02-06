"use client";

import { useState, useEffect } from "react";
import { 
  Trophy, 
  History, 
  Award, 
  Download, 
  Star,
  Users,
  Calendar,
  Zap,
  CheckCircle2,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function ActivityHubPage() {
  const [totalCredits, setTotalCredits] = useState(0);
  const [semesterGoal, setSemesterGoal] = useState(30);
  const [activities, setActivities] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [stats, setStats] = useState({
    attendancePoints: 0,
    organizingPoints: 0,
    volunteerPoints: 0,
    eventsAttended: 0,
    volunteerHours: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creditsRes, statsRes] = await Promise.all([
          fetch("/api/activity/credits"),
          fetch("/api/activity/stats")
        ]);

        if (creditsRes.ok) {
          const data = await creditsRes.json();
          setActivities(data.credits);
          setTotalCredits(data.totalPoints);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setBadges(data.badges);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch activity data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Activity Hub...</div>;

  return (
    <div className="container mx-auto py-12 px-4 space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Activity Hub</h1>
          <p className="text-muted-foreground mt-2">Track your extra-curricular credits, volunteer hours, and achievements.</p>
        </div>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
             <Download className="mr-2 h-4 w-4" /> Download Transcript
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Credit Progress */}
        <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Semester Credit Progress
                    <Badge variant="secondary" className="font-mono">{totalCredits} / {semesterGoal} Pts</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Progress value={(totalCredits/semesterGoal) * 100} className="h-3" />
                    <div className="grid grid-cols-3 gap-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        <div className="flex flex-col">
                            <span>Attendance</span>
                            <span className="text-foreground text-sm">{stats.attendancePoints} pts</span>
                        </div>
                        <div className="flex flex-col border-l pl-2">
                            <span>Organizing</span>
                            <span className="text-foreground text-sm">{stats.organizingPoints} pts</span>
                        </div>
                        <div className="flex flex-col border-l pl-2">
                            <span>Volunteering</span>
                            <span className="text-foreground text-sm">{stats.volunteerPoints} pts</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
                <CardTitle className="text-3xl">{stats.eventsAttended}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" /> +{stats.eventsAttended} this month
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Volunteer Hours</CardTitle>
                <CardTitle className="text-3xl">{stats.volunteerHours}h</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">Across various campaigns.</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Participation History */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold flex items-center">
                    <History className="h-6 w-6 mr-2" /> Participation History
                </h2>
                <Button variant="ghost" size="sm">View Full History</Button>
            </div>
            
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Activity / Event</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Credits Earned</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.length > 0 ? (
                                activities.map((act) => (
                                <TableRow key={act.id}>
                                    <TableCell className="font-medium">{act.reason}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{act.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{new Date(act.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right font-bold text-primary">+{act.points}</TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                        No participation history found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card text-card-foreground border">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center overflow-hidden">
                            <CreditCard className="w-5 h-5 mr-2" /> Credit Rules
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between border-b pb-1">
                            <span>Event Attendance</span>
                            <span className="text-foreground">1pt</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span>Organizing Event</span>
                            <span className="text-foreground">3pts</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span>Volunteering Hour</span>
                            <span className="text-foreground">2pts</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Workshop Certificate</span>
                            <span className="text-foreground">2pts</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Career Edge</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground italic">&quot;Your extra-curricular transcript is automatically verified and accepted by 100+ partner companies for campus placements.&quot;</p>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Achievements & Badges Sidebar */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-amber-500" /> Achievements
                    </CardTitle>
                    <CardDescription>Badges earned for your contributions.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 px-6">
                    {badges.length > 0 ? (
                        badges.map((badge) => (
                        <div key={badge.id} className="flex gap-4 items-center group cursor-pointer">
                            <div className={`bg-primary/10 text-primary p-3 rounded-xl transition-all group-hover:scale-110`}>
                                <Trophy className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">{badge.name}</h3>
                                <p className="text-xs text-muted-foreground">Unlocked on {new Date(badge.earnedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                            No badges earned yet. Participate in events to unlock!
                        </div>
                    )}
                    
                    <div className="pt-4 border-t border-dashed">
                        <CardDescription className="mb-2">Next Milestone</CardDescription>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                            <span>Global Volunteer</span>
                            <span>{stats.volunteerHours} / 50 hrs</span>
                        </div>
                        <Progress value={(stats.volunteerHours / 50) * 100} className="h-1.5" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-6 text-center space-y-4">
                    <div className="p-4 mx-auto w-fit bg-background rounded-full border shadow-sm">
                        <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Ready for Placement?</h3>
                        <p className="text-xs text-muted-foreground mt-1">Generate your verified activity dossier for the placement cell.</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Preview Dossier</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
