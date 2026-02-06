"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Download, 
  Plus, 
  Trash2, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Send,
  BookOpen,
  AlertTriangle
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Mock Data for Lectures (Pre-defined templates)
const DEFAULT_SCHEDULE = [
  { id: 1, day: "Monday", time: "09:00 - 10:00", subject: "Maths - Calculus", block: "A-Block", room: "101" },
  { id: 2, day: "Monday", time: "10:00 - 11:00", subject: "Physics - Mechanics", block: "A-Block", room: "101" },
  { id: 3, day: "Monday", time: "11:00 - 12:00", subject: "Chemistry - Organic", block: "B-Block", room: "Lab 2" },
  { id: 4, day: "Tuesday", time: "09:00 - 10:00", subject: "Computer Science", block: "C-Block", room: "Lab 5" },
];

export default function AdminAcademicsPage() {
  // State for Schedule
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [editLecture, setEditLecture] = useState<any>(null);

  // State for Updates/Announcements
  const [announcementInput, setAnnouncementInput] = useState("");
  const [generatedAnnouncement, setGeneratedAnnouncement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // --- FEATURES ---

  // 1. Download Schedule as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Class Schedule - Semester 4", 14, 15);
    
    autoTable(doc, {
      head: [["Day", "Time", "Subject", "Location"]],
      body: schedule.map(row => [row.day, row.time, row.subject, `${row.block}, Room ${row.room}`]),
      startY: 20,
    });

    doc.save("class_schedule.pdf");
  };

  // 2. Change Subject Name (Admin Feature)
  const handleUpdateSubject = (id: number, newSubject: string) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, subject: newSubject } : item));
    setEditLecture(null);
  };

  // 3. AI Announcement Generator (Mock)
  const generateAIAnnouncement = () => {
    if (!announcementInput) return;
    setIsGenerating(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const draft = `📢 *Important Announcement* \n\n${announcementInput.replace(/lab/i, "Laboratory Session").replace(/exam/i, "Examination")} \n\nPlease ensure you are on time. \n\nRegards,\nClass Admin`;
      setGeneratedAnnouncement(draft);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Administration</h1>
          <p className="text-muted-foreground">Manage schedules, classes, and communications.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/academics'}>View as Student</Button>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="schedule">Schedule & Lectures</TabsTrigger>
          <TabsTrigger value="assignments">Assignments & Tests</TabsTrigger>
          <TabsTrigger value="community">Class Community</TabsTrigger>
        </TabsList>

        {/* --- SCHEDULE TAB --- */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Weekly Class Schedule</CardTitle>
                <CardDescription>
                  Pre-defined template. Edit subjects as needed. Location is fixed per slot.
                </CardDescription>
              </div>
              <Button onClick={downloadPDF} variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Subject (Editable)</TableHead>
                    <TableHead>Location (Fixed)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.map((lecture) => (
                    <TableRow key={lecture.id}>
                      <TableCell className="font-medium">{lecture.day}</TableCell>
                      <TableCell>{lecture.time}</TableCell>
                      <TableCell>
                        {editLecture === lecture.id ? (
                          <div className="flex gap-2 items-center">
                            <Input 
                              defaultValue={lecture.subject} 
                              id={`subject-${lecture.id}`}
                              className="h-8 w-[180px]" 
                            />
                            <Button 
                              size="sm" 
                              onClick={() => {
                                const val = (document.getElementById(`subject-${lecture.id}`) as HTMLInputElement).value;
                                handleUpdateSubject(lecture.id, val);
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <span className="font-medium text-primary">{lecture.subject}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lecture.block}, {lecture.room}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setEditLecture(lecture.id)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ASSIGNMENTS & TESTS TAB --- */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> New Assignment Alert
                </CardTitle>
                <CardDescription>Notify students about new coursework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="e.g. Lab Report 4" />
                </div>
                <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="maths">Maths</SelectItem>
                            <SelectItem value="cs">Computer Science</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" />
                </div>
                <Button className="w-full">Create Assignment Alert</Button>
              </CardContent>
            </Card>

            {/* Periodic Test Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                    <AlertTriangle className="mr-2 h-5 w-5" /> Periodic Test (PT) Schedule
                </CardTitle>
                <CardDescription>Set alerts for upcoming exams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Exam Name</Label>
                        <Input placeholder="e.g. Mid-Sem 1" />
                    </div>
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Syllabus / Notes</Label>
                    <Textarea placeholder="Chapters 1-3 included..." />
                </div>
                <Button variant="destructive" className="w-full">Set Exam Alert</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- COMMUNITY TAB --- */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center">
                     <Sparkles className="mr-2 h-5 w-5 text-indigo-500" /> AI Announcement Helper
                   </CardTitle>
                   <CardDescription>
                     Draft a raw message, and let AI format it professionally for the community.
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-2">
                     <Label>Raw Info (Rough notes)</Label>
                     <Textarea 
                       placeholder="e.g. Section A has lab on lecture 5th, bring record books" 
                       value={announcementInput}
                       onChange={(e) => setAnnouncementInput(e.target.value)}
                       className="min-h-[100px]"
                     />
                   </div>
                   <Button 
                     onClick={generateAIAnnouncement} 
                     disabled={!announcementInput || isGenerating}
                     className="bg-indigo-600 hover:bg-indigo-700"
                   >
                     {isGenerating ? "Generating..." : "Generate Professional Announcement"}
                   </Button>

                   {generatedAnnouncement && (
                     <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-4">
                        <Separator />
                        <Label className="text-indigo-600 font-semibold">AI Generated Draft:</Label>
                        <div className="p-4 bg-indigo-50 rounded-md whitespace-pre-wrap text-sm border border-indigo-100 text-indigo-900">
                            {generatedAnnouncement}
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" className="w-full"><Send className="w-4 h-4 mr-2"/> Post to Community</Button>
                            <Button size="sm" variant="ghost" onClick={() => setGeneratedAnnouncement("")}>Discard</Button>
                        </div>
                     </div>
                   )}
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                    <CardTitle>Recent Community Posts</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold">Lab Schedule Change</h4>
                            <span className="text-xs text-muted-foreground">Today, 10:30 AM</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Dear Students, please note that the Physics Lab for Batch B is rescheduled to Friday 2nd Slot.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                             <Badge variant="outline" className="text-xs">Section A</Badge>
                             <Badge variant="secondary" className="text-xs">Official</Badge>
                        </div>
                    </div>
                 </CardContent>
               </Card>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <CardTitle>Class Members</CardTitle>
                        </div>
                        <CardDescription>
                            Students join via Roll Number. Contact info is hidden.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b pb-2">
                                <span>Total Students</span>
                                <span className="font-bold">64</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b pb-2">
                                <span>Joined</span>
                                <span className="font-bold text-green-600">58</span>
                            </div>
                            <div className="pt-2">
                                <Button className="w-full" variant="outline" size="sm">Manage Members</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
