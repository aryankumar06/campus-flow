"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Lock,
  Ghost
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ComplaintsPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState("academics");
  const [content, setContent] = useState("");
  const [myComplaints, setMyComplaints] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/community/complaints");
      if (res.ok) {
        const data = await res.json();
        setMyComplaints(data);
      }
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setLoading(true);
    try {
      const res = await fetch("/api/community/complaints", {
        method: "POST",
        body: JSON.stringify({ category, content, isAnonymous }),
      });

      if (res.ok) {
        setSubmitted(true);
        fetchComplaints();
        toast({
          title: "Complaint Filed Successfully",
          description: "Your grievance has been securely routed.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit complaint.",
      });
    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <ShieldCheck className="h-12 w-12" />
          </div>
        </div>
        <div className="space-y-2">
            <h1 className="text-3xl font-bold">Securely Filed</h1>
            <p className="text-muted-foreground max-w-md mx-auto">Your reference ID is <strong>#GRV-9942</strong>. You can track the status anonymously using this ID.</p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => setSubmitted(false)}>File Another</Button>
          <Button>View Track Status</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Grievance & Feedback</h1>
          <p className="text-muted-foreground mt-2">A secure, anonymous channel to report issues and suggest improvements.</p>
        </div>
        <Badge variant="outline" className="h-8 border-green-200 text-green-600 bg-green-50">
            <Lock className="w-3 h-3 mr-1" /> End-to-End Encrypted
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filing Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Submit New Grievance</CardTitle>
              <CardDescription>Fill in the details below. Our admin team will respond within 48-72 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="academics">Academics</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="harassment">Harassment / Safety</SelectItem>
                            <SelectItem value="canteen">Canteen / Food</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Urgency</label>
                    <Select defaultValue="low">
                        <SelectTrigger>
                            <SelectValue placeholder="Select Urgency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low (Feedback)</SelectItem>
                            <SelectItem value="medium">Medium (Issue)</SelectItem>
                            <SelectItem value="high">High (Urgent)</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Describe the issue in detail. If it's about a specific location or person, please mention it clearly."
                    className="min-h-[150px] resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-dashed">
                    <div className="flex gap-3">
                        <div className={`p-2 rounded-full ${isAnonymous ? 'bg-zinc-900 text-white' : 'bg-primary/10 text-primary'}`}>
                            {isAnonymous ? <Ghost className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="text-sm font-bold">{isAnonymous ? 'File Anonymously' : 'File as Yourself'}</p>
                            <p className="text-[10px] text-muted-foreground">{isAnonymous ? 'Admin will not see your Name/Roll No.' : 'Show your identity for faster resolution.'}</p>
                        </div>
                    </div>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:bg-primary/5"
                        onClick={() => setIsAnonymous(!isAnonymous)}
                    >
                        Switch to {isAnonymous ? 'Public' : 'Anonymous'}
                    </Button>
                </div>

                <Button className="w-full h-12" disabled={loading}>
                    {loading ? 'Routing Grievance...' : 'Submit Securely'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Status & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-4 h-4 mr-2" /> My Grievances
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {myComplaints.map((comp) => (
                <div key={comp.id} className="p-3 bg-zinc-50 rounded-lg group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                        <Badge variant="outline" className="text-[10px] h-4 capitalize">{comp.category}</Badge>
                        <Badge className={`${comp.status === 'RESOLVED' ? 'bg-green-500/10 text-green-600' : 'bg-amber-100 text-amber-700'} border-none text-[10px] h-4 uppercase`}>
                            {comp.status}
                        </Badge>
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{comp.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 flex justify-between">
                        <span>RefID: #{comp.id.slice(-4)}</span>
                        <span>Filed on {new Date(comp.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs" size="sm">
                View All Records <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 text-red-500" /> Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 mb-4">For immediate safety threats, call the anti-harassment cell directly.</p>
              <div className="p-3 bg-white/10 rounded border border-white/5 space-y-2">
                <p className="text-sm font-mono tracking-widest">+91 000-111-2233</p>
                <p className="text-[10px] uppercase font-bold text-red-400 font-mono">24/7 Rapid Response</p>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex gap-4">
             <Info className="w-8 h-8 text-primary shrink-0 mt-1" />
             <div>
                <p className="text-sm font-bold">Safe Space Policy</p>
                <p className="text-xs text-muted-foreground mt-1">We guarantee zero retaliation against students for filing infrastructure or academic grievances.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
