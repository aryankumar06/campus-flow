"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CoordinatorDashboard() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    department: "",
    targetSemester: "",
    rangeStart: "",
    rangeEnd: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/coordinator/assign-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message);
        setFormData({ ...formData, subjectName: "", subjectCode: "" }); // Reset some fields
      } else {
        toast.error(data.message || "Failed to assign.");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 mx-auto max-w-4xl space-y-8">
       <div>
        <h1 className="text-3xl font-bold">Section Coordinator</h1>
        <p className="text-muted-foreground">Manage subjects and student assignments.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Batch Subject Assignment</CardTitle>
          <CardDescription>Assign a subject to a range of students (by Roll Number).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label>Subject Name</Label>
                   <Input 
                     placeholder="e.g. Data Structures" 
                     value={formData.subjectName}
                     onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                     required
                   />
                </div>
                <div className="space-y-2">
                   <Label>Subject Code</Label>
                   <Input 
                     placeholder="e.g. CS201" 
                     value={formData.subjectCode}
                     onChange={(e) => setFormData({...formData, subjectCode: e.target.value})}
                     required
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                      onValueChange={(val) => setFormData({...formData, department: val})}
                      value={formData.department}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Dept" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSE">CSE</SelectItem>
                        <SelectItem value="ECE">ECE</SelectItem>
                        <SelectItem value="ME">ME</SelectItem>
                      </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label>Target Semester</Label>
                    <Select 
                       onValueChange={(val) => setFormData({...formData, targetSemester: val})}
                       value={formData.targetSemester}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                             <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                 <div className="space-y-2">
                    <Label>Start Roll No (Range)</Label>
                    <Input 
                       placeholder="e.g. 2100100" 
                       value={formData.rangeStart}
                       onChange={(e) => setFormData({...formData, rangeStart: e.target.value})}
                       required
                    />
                 </div>
                 <div className="space-y-2">
                    <Label>End Roll No (Range)</Label>
                    <Input 
                       placeholder="e.g. 2100160" 
                       value={formData.rangeEnd}
                       onChange={(e) => setFormData({...formData, rangeEnd: e.target.value})}
                       required
                    />
                 </div>
             </div>

             <Button type="submit" disabled={loading} className="w-full md:w-auto">
               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Assign Subject
             </Button>
          </form>
        </CardContent>
       </Card>
    </div>
  );
}
