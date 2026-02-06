"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle"; // Need to create this
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-bold text-2xl mr-6 no-underline text-foreground">
          CollegeEvents
        </Link>
        <div className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/events"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary no-underline"
          >
            Events
          </Link>
          <Link
            href="/academics"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary no-underline"
          >
            Academics
          </Link>
          <Link
            href="/community"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary no-underline"
          >
            Community
          </Link>
          <Link
            href="/activity"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary no-underline"
          >
            Activity Hub
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt={user.name || ""} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-events">My Events</Link>
                </DropdownMenuItem>
                {["ORGANIZER", "CLUB_ADMIN", "HOD", "ADMIN"].includes(user?.role || "") && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/create-event">Create Event</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/manage-events">Manage Events</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" className="no-underline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="no-underline">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
