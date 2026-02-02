"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "ORGANIZER"]),
  collegeId: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
      collegeId: "",
      department: "",
      year: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Basic selective validation
    if (values.role === "STUDENT" && !values.collegeId) {
        form.setError("collegeId", { message: "Roll number is required for students" });
        return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
            title: "Success",
            description: "Account created! Please sign in.",
        });
        router.push("/login");
      } else {
        const data = await response.json();
        toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[#030303]">
      {/* Premium Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative z-10 mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">Create an Account</h1>
          <p className="text-zinc-400 mt-2">Join your campus community today</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-11" {...field} />
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
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">I am a</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="ORGANIZER">Organizer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("role") === "STUDENT" && (
              <div className="space-y-5 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                <FormField
                  control={form.control}
                  name="collegeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">University Roll No.</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 202201" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300 text-xs">Department</FormLabel>
                        <FormControl>
                          <Input placeholder="CSE/ECE" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300 text-xs">Grad. Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2026" className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <Button className="w-full h-12 text-lg font-bold bg-white text-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 mt-2" type="submit">
              Sign Up
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
