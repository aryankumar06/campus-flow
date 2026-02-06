"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Users, TrendingUp, Award } from "lucide-react";

export default function HODDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/hod/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 container py-6 mx-auto">
      <div>
        <h1 className="text-3xl font-bold">HOD Dashboard</h1>
        <p className="text-muted-foreground">Department Overview & Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Registered in department</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.avgAttendance || 0}%</div>
            <p className="text-xs text-muted-foreground">Across all semesters</p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{data?.topPerformers?.[0]?.name || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{data?.topPerformers?.[0]?.cgpa || 0} CGPA</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Academic Performers</CardTitle>
          <CardDescription>Highest CGPA holders in the department</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
             {data?.topPerformers?.map((student: any, index: number) => (
                <div key={student.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-muted-foreground">#{index + 1}</div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Sem {student.semester} | {student.department}</p>
                    </div>
                  </div>
                  <div className="font-semibold">{student.cgpa} CGPA</div>
                </div>
             ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
