"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  Heart, 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EventDiscoveryPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentEvent = events[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      // RSVP/Like logic here
      console.log("Liked:", currentEvent.title);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Discovery Feed...</div>;
  if (currentIndex >= events.length) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="p-6 bg-primary/10 rounded-full">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">You&apos;re all caught up!</h2>
          <p className="text-muted-foreground">Check back later for more exciting events.</p>
        </div>
        <Button onClick={() => router.push("/events")}>Back to List View</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-[80vh] flex flex-col items-center justify-center pt-8">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
            Discover <Sparkles className="w-5 h-5 text-primary" />
        </h1>
        <Button variant="ghost" size="sm" onClick={() => router.push("/events")}>List View</Button>
      </div>

      <div className="relative w-full aspect-[3/4] perspective-1000">
        <AnimatePresence>
          <SwipeCard 
            key={currentEvent.id} 
            event={currentEvent} 
            onSwipe={handleSwipe} 
          />
        </AnimatePresence>
      </div>

      <div className="flex gap-6 mt-8">
        <Button 
          variant="outline" 
          size="lg" 
          className="rounded-full h-16 w-16 border-red-200 text-red-500 hover:bg-red-50"
          onClick={() => handleSwipe("left")}
        >
          <X className="w-8 h-8" />
        </Button>
        <Button 
          size="lg" 
          className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600 text-white shadow-lg"
          onClick={() => handleSwipe("right")}
        >
          <Heart className="w-8 h-8 fill-current" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-8 uppercase tracking-widest font-medium">
        Swipe Right to Register
      </p>
    </div>
  );
}

function SwipeCard({ event, onSwipe }: { event: any; onSwipe: (dir: "left" | "right") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: x.get() > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
    >
      <Card className="w-full h-full overflow-hidden border-none shadow-2xl relative">
        <img 
          src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt={event.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        {/* Indicators */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 border-4 border-green-500 rounded-lg px-4 py-1 -rotate-12">
            <span className="text-green-500 text-4xl font-black uppercase">REGISTER</span>
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-10 border-4 border-red-500 rounded-lg px-4 py-1 rotate-12">
            <span className="text-red-500 text-4xl font-black uppercase">PASS</span>
        </motion.div>

        <div className="absolute bottom-0 p-6 w-full text-white space-y-2">
          <Badge className="bg-primary/80 border-none text-white">{event.category}</Badge>
          <h2 className="text-3xl font-bold leading-tight">{event.title}</h2>
          <div className="flex flex-col gap-1 text-sm text-zinc-200">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {event.venue}</span>
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(event.dateTime).toLocaleDateString()}</span>
            <span className="flex items-center"><Users className="w-4 h-4 mr-2" /> {event.capacity} Capacity</span>
          </div>
          <p className="text-sm text-zinc-300 line-clamp-2 mt-2">{event.description}</p>
          
          <Button variant="link" className="text-white p-0 h-auto mt-2 font-semibold flex items-center group" asChild>
            <Link href={`/event/${event.id}`}>
              View Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
