"use client";

import { useState } from "react";
import { 
  Users, 
  Linkedin, 
  Globe, 
  MessageCircle, 
  Calendar,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

export default function MentorNetworkPage() {
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState<any[]>([
    { 
        id: "1", 
        name: "Siddharth Malhotra", 
        role: "Senior (Final Year)", 
        dept: "Computer Science",
        expertise: ["Placement Prep", "Full Stack", "Machine Learning"],
        image: "https://i.pravatar.cc/150?u=sid",
        rating: 4.9,
        sessions: 42
    },
    { 
        id: "2", 
        name: "Ananya Ghosh", 
        role: "Alumni (2023 Batch)", 
        dept: "Electronics",
        expertise: ["Core Engineering", "GATE Prep", "Women in Tech"],
        image: "https://i.pravatar.cc/150?u=ananya",
        rating: 4.8,
        sessions: 120
    }
  ]);
  const { toast } = useToast();

  const handleAutoMatch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/community/mentor-match");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setMentors(data);
          toast({
            title: "Matches Found!",
            description: `We found ${data.length} mentors in your department.`,
          });
        } else {
          toast({
              title: "No matches yet",
              description: "Try again later as more seniors join the network.",
          });
        }
      }
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (name: string) => {
    toast({
      title: "Session Requested!",
      description: `A request for a 1:1 career guidance session has been sent to ${name}.`,
    });
  };


  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Mentor Network</h1>
          <p className="text-muted-foreground mt-2">Connect with seniors and alumni for personalized 1:1 guidance.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Users className="mr-2 h-4 w-4" /> My Mentors
            </Button>
            <Button className="bg-zinc-900 text-white">
                <GraduationCap className="mr-2 h-4 w-4" /> Become a Mentor
            </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="bg-zinc-50 border-none shadow-none">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search by name, expertise, or department..." className="pl-9 h-11 bg-white" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex-1 bg-white">
                    <Filter className="w-4 h-4 mr-2" /> All Filters
                </Button>
                <SelectHub />
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="group hover:border-primary transition-all overflow-hidden flex flex-col">
            <CardHeader className="relative pb-0">
                <div className="absolute top-4 right-4 z-10">
                    <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 cursor-pointer transition-colors" />
                </div>
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarImage src={mentor.image} />
                        <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle className="text-xl">{mentor.name}</CardTitle>
                        <p className="text-sm font-medium text-primary">{mentor.role}</p>
                        <p className="text-xs text-muted-foreground">{mentor.dept}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 mt-6 space-y-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {mentor.expertise.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-[10px] font-normal px-2 py-0">{skill}</Badge>
                    ))}
                </div>
                <div className="flex justify-around border-t border-b py-4 bg-zinc-50/50 rounded-lg">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Rating</p>
                        <p className="text-lg font-bold">⭐ {mentor.rating}</p>
                    </div>
                    <div className="text-center border-l pl-4">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Sessions</p>
                        <p className="text-lg font-bold">{mentor.sessions}+</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-zinc-50 p-4 border-t gap-2">
                <Button variant="ghost" size="sm" className="flex-1 h-10">
                    <Globe className="w-4 h-4 mr-2" /> Profile
                </Button>
                <Button className="flex-1 h-10" onClick={() => handleBook(mentor.name)}>
                    <MessageCircle className="w-4 h-4 mr-2" /> Book 1:1
                </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Empty State / Add More */}
        <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center bg-zinc-50 hover:bg-zinc-100/50 transition-colors cursor-pointer" onClick={() => window.alert("Redirecting to Alumni Portal")}>
            <div className="h-16 w-16 rounded-full bg-zinc-200 flex items-center justify-center mb-4">
                <ArrowRight className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="font-bold">Connect with Alumni</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-[180px]">Access our legacy portal to find alumni from Batch 2010 onwards.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <Card className="bg-zinc-950 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
              <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                      <Zap className="w-6 h-6 mr-2 text-primary" /> Senior-Junior Match
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Our algorithm matches you with the best mentor based on your department and interests.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Button 
                    className="bg-white text-black hover:bg-zinc-200 w-full md:w-auto px-8"
                    onClick={handleAutoMatch}
                    disabled={loading}
                  >
                    {loading ? "Finding Matches..." : "Run Auto-Match"}
                  </Button>
              </CardContent>
          </Card>
          
          <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 space-y-4">
               <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-full border shadow-sm h-fit">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Peer-Verified Mentors</h3>
                    <p className="text-xs text-muted-foreground mt-1">Every mentor is verified by the department head and rated by fellow students to ensure high-quality career guidance.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-full border shadow-sm h-fit">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Automated Scheduling</h3>
                    <p className="text-xs text-muted-foreground mt-1">Direct integration with college timetables to find free slots that work for both mentor and mentee.</p>
                  </div>
               </div>
          </div>
      </div>
    </div>
  );
}

function SelectHub() {
    return (
        <div className="h-11 border rounded-md px-3 flex items-center bg-white min-w-[140px] text-sm font-medium">
            Category: Placement
        </div>
    )
}
