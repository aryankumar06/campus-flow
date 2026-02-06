"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  FileText, 
  Clock, 
  Bell, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Upload
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AcademicsPage() {
  const [attendance, setAttendance] = useState(0);
  const [upcomingAssignments, setUpcomingAssignments] = useState<any[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [examAlert, setExamAlert] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, creditRes, statsRes, profileRes] = await Promise.all([
          fetch("/api/academics/assignments"),
          fetch("/api/activity/credits"),
          fetch("/api/academics/stats"),
          fetch("/api/profile")
        ]);
        
        if (assignRes.ok) {
          const data = await assignRes.json();
          setUpcomingAssignments(data.filter((a: any) => a.submissions.length === 0).slice(0, 3));
        }

        if (creditRes.ok) {
          const data = await creditRes.json();
          setTotalCredits(data.totalPoints);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setAttendance(data.attendance);
          setExamAlert(data.alert);
        }

        if (profileRes.ok) {
          const data = await profileRes.json();
          setStudentProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch academics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Academic Hub...</div>;


  return (
    <div className="container mx-auto py-12 px-4 space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Academic Hub</h1>
          <p className="text-muted-foreground mt-2">Manage your studies, assignments, and attendance in one place.</p>
        </div>
        <Badge variant="outline" className="px-4 py-1 text-sm">
          {studentProfile?.semester ? `Sem ${studentProfile.semester}` : "Sem N/A"} | {studentProfile?.academicSession || "AY 2024-25"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Tracker */}
        <Card className={attendance < 75 ? "border-red-500/50 bg-red-500/5" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Overall Attendance
              {attendance < 75 && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </CardTitle>
            <CardTitle className="text-3xl">{attendance}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={attendance} className={attendance < 75 ? "bg-red-200" : ""} />
            <p className="text-xs text-muted-foreground mt-2">
              {attendance < 75 
                ? "Warning: Below 75% threshold." 
                : "You are doing great! Keep it up."}
            </p>
          </CardContent>
        </Card>

        {/* PT/Exam Alerts */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bell className="h-4 w-4 mr-2" /> Exam Alerts
            </CardTitle>
            <CardTitle className="text-xl">
                {examAlert ? examAlert.title : "No Upcoming Exams"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
                {examAlert ? `Date: ${new Date(examAlert.date).toLocaleDateString()}` : "Check back later for schedule updates."}
            </p>
            {examAlert && <Button variant="link" className="p-0 h-auto text-xs mt-2">View Full Calendar</Button>}
          </CardContent>
        </Card>

        {/* Study Credits (Could be GPA related) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" /> SGPA Trend
            </CardTitle>
            <CardTitle className="text-3xl">
              {studentProfile?.cgpa ? `${studentProfile.cgpa} / 10` : "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={studentProfile?.cgpa ? (studentProfile.cgpa * 10) : 0} />
            <p className="text-xs text-muted-foreground mt-2">
              {studentProfile?.cgpa ? "Cumulative Grade Point Average" : "No academic record found"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold flex items-center">
              <FileText className="h-6 w-6 mr-2" /> Pending Assignments
            </h2>
            <Button size="sm" variant="outline">View All</Button>
          </div>
          
          <div className="grid gap-4">
            {upcomingAssignments.length > 0 ? (
                upcomingAssignments.map((assignment) => (
                <Card key={assignment.id} className="group hover:border-primary transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded bg-muted text-muted-foreground">
                        <Clock className="w-5 h-5" />
                        </div>
                        <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.subject} • Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <Link href={`/academics/assignments/${assignment.id}`}>
                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Submit <Upload className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    </CardContent>
                </Card>
                ))
            ) : (
                <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/30 border-dashed">
                    No pending assignments.
                </div>
            )}
          </div>

          <div className="pt-4">
            <h2 className="text-2xl font-semibold flex items-center mb-6 text-foreground">
              <BookOpen className="h-6 w-6 mr-2" /> Study Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Subject Notes</CardTitle>
                  <CardDescription>Chapter-wise PDFs for all subjects.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Previous Year Qs</CardTitle>
                  <CardDescription>Final and Sessional exam archives.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start w-full">
                <BookOpen className="mr-2 h-4 w-4" /> Book Mentor Session
              </Button>
              <Button variant="outline" className="justify-start w-full">
                <Bell className="mr-2 h-4 w-4" /> Report Absence
              </Button>
              <Button variant="outline" className="justify-start w-full">
                <Clock className="mr-2 h-4 w-4" /> Exam Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground border">
            <CardHeader>
              <CardTitle className="text-lg">Faculty Consultation</CardTitle>
              <CardDescription className="text-muted-foreground">Available slots for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 text-muted-foreground text-sm">
                 No faculty slots available right now.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
