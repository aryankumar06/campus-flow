"use client";

import { useState } from "react";
import { 
  Code2, 
  Trophy, 
  Terminal, 
  Users, 
  Star, 
  Zap, 
  Github,
  Globe,
  Clock,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function CodingDuelsPage() {
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: "Anurag S.", score: 2450, solved: 142, badges: ["Elite", "Master"] },
    { rank: 2, name: "Priya V.", score: 2310, solved: 138, badges: ["Fastest"] },
    { rank: 3, name: "Rahul K.", score: 2180, solved: 125, badges: ["Streak"] },
    { rank: 4, name: "Sneha M.", score: 2050, solved: 110, badges: [] },
  ]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Coding Duels</h1>
          <p className="text-muted-foreground mt-2">Scale the leaderboard, solve weekly challenges, and showcase your skills.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Github className="mr-2 h-4 w-4" /> Link GitHub
            </Button>
            <Button>
                <Code2 className="mr-2 h-4 w-4" /> Start Duel
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Active Challenge */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-950 text-white overflow-hidden border-none shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Terminal className="w-40 h-40" />
                </div>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <Badge className="bg-primary text-white">Active Challenge</Badge>
                        <div className="flex items-center text-zinc-400 text-sm">
                            <Clock className="w-4 h-4 mr-2" /> Ends in 04:22:15
                        </div>
                    </div>
                    <CardTitle className="text-3xl mt-4 font-mono">The Optimal Subsequence</CardTitle>
                    <CardDescription className="text-zinc-400 text-lg max-w-xl py-2">
                        Find the longest contiguous subsequence such that the difference between adjacent elements is at most K.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex items-center text-sm"><Users className="w-4 h-4 mr-2 text-primary" /> 1,240 Participating</div>
                        <div className="flex items-center text-sm"><Star className="w-4 h-4 mr-2 text-warning" /> 500 DP Points</div>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-white text-black hover:bg-zinc-200 px-8">Solve on HackerRank</Button>
                        <Button variant="ghost" className="text-white">View Editorial</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-primary" /> Open Source Hub
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Contribute to college projects and earn recognition badges.</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span>Campus Navigation App</span>
                                <Badge variant="secondary" className="text-[10px]">3 Issues</Badge>
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                                <span>Event Logistics API</span>
                                <Badge variant="secondary" className="text-[10px]">1 Issue</Badge>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">Browse Projects</Button>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-primary" /> My Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-muted-foreground">Overall Rank</p>
                                <p className="text-2xl font-bold">#42</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Consistency</p>
                                <p className="text-2xl font-bold">85%</p>
                            </div>
                        </div>
                        <Progress value={85} className="h-2" />
                        <p className="text-[10px] text-muted-foreground uppercase text-center font-bold tracking-tighter">Solved 4 challenges in a row! 🔥</p>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Global Leaderboard Sidebar */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-amber-500" /> Leaderboard
                    </CardTitle>
                    <CardDescription>Top coders this semester.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="text-[10px] uppercase font-bold text-muted-foreground">
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboard.map((user) => (
                                <TableRow key={user.rank} className={user.rank === 1 ? "bg-amber-50/50" : ""}>
                                    <TableCell className="font-bold text-muted-foreground">{user.rank}</TableCell>
                                    <TableCell>
                                        <div className="font-semibold">{user.name}</div>
                                        <div className="flex gap-1 mt-1">
                                            {user.badges.map(b => (
                                                <Badge key={b} className="text-[8px] h-3 px-1 leading-none bg-zinc-100 text-zinc-600 border-none">{b}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-primary">{user.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <div className="p-4 border-t">
                    <Button variant="ghost" size="sm" className="w-full">
                        View Full Rankings <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </Card>

            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-sm">Rewards Pool</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center bg-zinc-50 p-2 rounded">
                        <span className="text-xs font-medium">Top Weekly Coder</span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">₹500 / Voucher</Badge>
                    </div>
                    <div className="flex justify-between items-center bg-zinc-50 p-2 rounded">
                        <span className="text-xs font-medium">100+ Problems</span>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">T-Shirt / Swag</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
