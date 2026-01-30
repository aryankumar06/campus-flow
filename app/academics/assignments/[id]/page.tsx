"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  FileUp, 
  CheckCircle, 
  Clock, 
  Info,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function AssignmentSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Mock assignment data
  const assignment = {
    id: params.id,
    title: "Microprocessors Lab Report",
    subject: "EC302",
    description: "Submit the complete lab report for 8085 Microprocessor experiments including code snippets and flowcharts. PDF format only.",
    dueDate: "2026-02-01T23:59:00",
    maxMarks: 50,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ variant: "destructive", title: "Missing File", description: "Please select a file to upload." });
      return;
    }

    setLoading(true);
    // Simulating upload delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Assignment submitted successfully.",
      });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Submission Confirmed</h1>
        <p className="text-muted-foreground">Your assignment for {assignment.title} has been uploaded and timestamped.</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setSubmitted(false)}>Resubmit</Button>
          <Button onClick={() => router.push("/academics")}>Back to Hub</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Button 
        variant="ghost" 
        className="mb-8" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Academics
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">{assignment.subject}</Badge>
                <div className="flex items-center text-red-500 text-sm font-medium">
                  <Clock className="w-4 h-4 mr-1" /> Due in 1 day
                </div>
              </div>
              <CardTitle className="text-2xl">{assignment.title}</CardTitle>
              <CardDescription className="text-lg py-4">
                {assignment.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-2 border-dashed rounded-xl p-10 text-center space-y-4 hover:border-primary transition-colors cursor-pointer relative bg-zinc-50">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <FileUp className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file ? file.name : "Select or drag file here"}</p>
                    <p className="text-sm text-muted-foreground">PDF, DOCX up to 10MB</p>
                  </div>
                </div>

                <Button className="w-full h-12 text-lg" disabled={loading}>
                  {loading ? "Uploading..." : "Submit Assignment"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/50 border-blue-100">
            <CardHeader className="py-4">
              <CardTitle className="text-sm flex items-center font-medium text-blue-700">
                <Info className="w-4 h-4 mr-2" /> Submission Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-blue-600 space-y-1">
              <p>• Late submissions are subject to a 10% penalty per day.</p>
              <p>• Plagiarism check will be performed on all text content.</p>
              <p>• Ensure your file name includes your Roll Number.</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2" /> Posted</span>
                <span className="font-medium">Jan 25, 2026</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> Max Marks</span>
                <span className="font-medium">{assignment.maxMarks}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Attempts</span>
                <span className="font-medium">Single</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm">Faculty Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 italic">No feedback available until grading is complete.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
