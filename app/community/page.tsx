"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Megaphone, 
  MessageSquare, 
  Search, 
  Plus,
  TrendingUp,
  ShieldCheck,
  Globe
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function CommunityHubPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [spotlightClub, setSpotlightClub] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annonRes, clubRes] = await Promise.all([
          fetch("/api/announcements"),
          fetch("/api/clubs")
        ]);

        if (clubRes.ok) {
          const data = await clubRes.json();
          setClubs(data);
          // Calculate Spotlight (Club with most members)
          if (data.length > 0) {
            const topClub = data.reduce((prev: any, current: any) => (prev.members > current.members) ? prev : current);
            setSpotlightClub(topClub);
          }
        }

        if (annonRes.ok) {
          const data = await annonRes.json();
          // Format announcements
          const formatted = data.map((item: any) => ({
            ...item,
            time: new Date(item.createdAt).toLocaleDateString(),
            source: item.club ? item.club.name : 'College Admin'
          }));
          setAnnouncements(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch community data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Community Hub...</div>;


  return (
    <div className="container mx-auto py-12 px-4 space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Community Hub</h1>
          <p className="text-muted-foreground mt-2">Connect with peers, join clubs, and stay informed.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">
             <ShieldCheck className="mr-2 h-4 w-4" /> Verified Identity
           </Button>
           <Button>
             <Plus className="mr-2 h-4 w-4" /> Create Community
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Navigation & Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Browse By</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1">
              <Button variant="ghost" className="justify-start text-primary bg-primary/10">
                <Globe className="mr-2 h-4 w-4" /> All Communities
              </Button>
              <Button variant="ghost" className="justify-start">
                <Users className="mr-2 h-4 w-4" /> My Clubs
              </Button>
              <Button variant="ghost" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" /> Discussion Forums
              </Button>
              <Button variant="ghost" className="justify-start">
                <TrendingUp className="mr-2 h-4 w-4" /> Trending Polls
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Club Spotlight</CardTitle>
            </CardHeader>
            <CardContent>
              {spotlightClub ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {spotlightClub.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{spotlightClub.name}</p>
                        <p className="text-xs text-muted-foreground">{spotlightClub.members} members</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">View Spotlight</Button>
                  </div>
              ) : (
                  <div className="text-sm text-muted-foreground">No clubs trending right now.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Announcements and Club Discovery */}
        <div className="lg:col-span-3 space-y-8">
          <Tabs defaultValue="announcements">
            <TabsList className="mb-4">
              <TabsTrigger value="announcements" className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" /> Announcements
              </TabsTrigger>
              <TabsTrigger value="clubs" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Explore Clubs
              </TabsTrigger>
              <TabsTrigger value="discussions" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Q&A / Forums
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcements" className="space-y-4">
              <div className="grid gap-4">
                {announcements.length > 0 ? (
                    announcements.map((item) => (
                    <Card key={item.id} className={`hover:border-primary transition-all cursor-pointer ${item.tier === 'COLLEGE' ? 'border-l-4 border-l-red-500' : ''}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${
                            item.tier === 'COLLEGE' ? 'bg-red-100 text-red-600' : 
                            item.tier === 'CLUB' ? 'bg-blue-100 text-blue-600' : 
                            'bg-zinc-100 text-zinc-600'
                            }`}>
                            <Megaphone className="w-4 h-4" />
                            </div>
                            <div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-[10px] h-4">
                                {item.tier}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{item.time}</span>
                            </div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">By {item.source}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </CardContent>
                    </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/30 border-dashed">
                        No announcements yet.
                    </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="clubs">
              <div className="flex items-center gap-2 mb-6">
                <Search className="w-4 h-4 text-muted-foreground absolute ml-3" />
                <Input placeholder="Search for technical, cultural, or sports clubs..." className="pl-9" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubs.length > 0 ? (
                    clubs.map((club) => (
                    <Card key={club.id}>
                        <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline">{club.category}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" /> {club.members}
                            </span>
                        </div>
                        <CardTitle className="text-xl mt-2">{club.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{club.description || `The official ${club.name} community. Join us to learn and grow together.`}</p>
                        <div className="flex gap-2">
                            <Button variant={club.isJoined ? "outline" : "default"} className="flex-1">
                            {club.isJoined ? "View Updates" : "Join Club"}
                            </Button>
                            <Button variant="ghost" size="icon">
                            <Info className="w-4 h-4" />
                            </Button>
                        </div>
                        </CardContent>
                    </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No clubs found.
                    </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="discussions">
              <div className="h-60 flex flex-col items-center justify-center text-center space-y-4 bg-muted/30 rounded-lg border border-dashed">
                <MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />
                <div>
                  <h3 className="font-medium">No discussions here yet</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">Start a public thread or ask an anonymous question to get the conversation moving.</p>
                </div>
                <Button size="sm">Start a Thread</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6"/>
        </svg>
    )
}

function Info({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
    )
}
