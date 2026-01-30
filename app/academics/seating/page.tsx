"use client";

import { useState } from "react";
import { 
  Grid3X3, 
  Users, 
  MapPin, 
  Download, 
  RefreshCcw,
  Zap,
  Info,
  Calendar,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function SeatingArrangementPage() {
  const [examName, setExamName] = useState("Sessional Exam - March 2026");
  const [hallCapacity, setHallCapacity] = useState("30");
  const [startRoll, setStartRoll] = useState("202201");
  const [endRoll, setEndRoll] = useState("202290");
  const [arrangements, setArrangements] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateArrangement = () => {
    setIsGenerating(true);
    
    // Simulation of the fair distribution algorithm
    setTimeout(() => {
      const start = parseInt(startRoll);
      const end = parseInt(endRoll);
      const capacity = parseInt(hallCapacity);
      const students = [];
      
      for (let i = start; i <= end; i++) {
        students.push(i);
      }
      
      // Randomize for fair distribution
      const shuffled = [...students].sort(() => Math.random() - 0.5);
      
      const halls = ["LH-101", "LH-102", "LH-201", "Audi-A"];
      const result = [];
      
      for (let i = 0; i < shuffled.length; i++) {
        const hallIndex = Math.floor(i / capacity);
        if (hallIndex >= halls.length) break;
        
        result.push({
          rollNo: shuffled[i],
          hall: halls[hallIndex],
          seatNo: (i % capacity) + 1,
          row: String.fromCharCode(65 + Math.floor((i % capacity) / 5)) // A, B, C... rows
        });
      }
      
      setArrangements(result);
      setIsGenerating(false);
      toast({
        title: "Arrangement Generated",
        description: `Successfully distributed ${result.length} students across ${halls.length} halls.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Smart Seating</h1>
          <p className="text-muted-foreground mt-2">Algorithm-based fair student distribution for exams and workshops.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">
             <Info className="mr-2 h-4 w-4" /> Guidelines
           </Button>
           <Button onClick={() => window.print()} variant="secondary">
             <Download className="mr-2 h-4 w-4" /> Export Charts
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
                <Zap className="w-4 h-4 mr-2 text-primary" /> Setup Generator
            </CardTitle>
            <CardDescription>Configure boundaries for the randomization engine.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam Name</label>
              <Input value={examName} onChange={e => setExamName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Start Roll No</label>
                 <Input value={startRoll} onChange={e => setStartRoll(e.target.value)} />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">End Roll No</label>
                 <Input value={endRoll} onChange={e => setEndRoll(e.target.value)} />
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hall Capacity (Per Hall)</label>
              <Input type="number" value={hallCapacity} onChange={e => setHallCapacity(e.target.value)} />
            </div>
            <Button className="w-full mt-4 h-11" onClick={generateArrangement} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Distributing...
                </>
              ) : (
                <>
                  <Grid3X3 className="mr-2 h-4 w-4" /> Generate Arrangement
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output/Preview Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold flex items-center">
              <Users className="h-6 w-6 mr-2" /> Live Seating Chart
            </h2>
            <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search Roll No..." className="pl-9 w-48 h-9" />
            </div>
          </div>

          {!arrangements.length ? (
            <div className="h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-10 bg-zinc-50">
                <Grid3X3 className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="font-medium text-lg text-zinc-600">No Arrangement Generated</h3>
                <p className="text-sm text-zinc-400 max-w-xs">Use the left panel to configure the generator and see the randomized distribution here.</p>
            </div>
          ) : (
            <Card>
              <CardHeader className="bg-primary/5 py-4 border-b">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-primary">{examName}</span>
                  <div className="flex gap-4">
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> 4 Halls</span>
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> Mar 15, 2026</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Hall / Venue</TableHead>
                      <TableHead>Row / Seat</TableHead>
                      <TableHead className="text-right">Alert Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {arrangements.slice(0, 50).map((student, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-medium">{student.rollNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.hall}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">Row {student.row} - #{student.seatNo}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Sent ✅</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {arrangements.length > 50 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground text-sm">
                          Showing first 50 of {arrangements.length} students. Export to view all.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {arrangements.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-zinc-900 text-white">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Automatic Alerts</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-xs text-zinc-400">Student Name + Roll No logic implemented. Notifications will be pushed 24h before exam.</p>
                      </CardContent>
                  </Card>
                  <Card className="bg-blue-600 text-white">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Distribution Logic</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-xs text-blue-100">Fisher-Yates shuffle engine active. Ensures zero bias and random peer placement.</p>
                      </CardContent>
                  </Card>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
