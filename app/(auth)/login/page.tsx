"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials",
        });
      } else {
        // Fetch session to determine role and redirect
        const session = await getSession();
        const role = (session?.user as any)?.role;

        if (role === "ADMIN") {
            router.push("/admin/dashboard");
        } else if (role === "ORGANIZER") {
            router.push("/manage-events");
        } else {
            router.push("/events");
        }
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center relative overflow-hidden bg-[#030303] py-12">
      {/* Premium Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 space-y-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative z-10 mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">Welcome Back</h1>
          <p className="text-zinc-400 mt-2">Sign in to your account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="student@college.edu" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full h-12 text-lg font-bold bg-white text-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 mt-2" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen bg-[#030303] text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
