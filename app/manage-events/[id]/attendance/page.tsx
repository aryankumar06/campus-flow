"use client";

import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AttendanceScannerPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const { toast } = useToast();
  const [lastResult, setLastResult] = useState<{ name?: string; status?: string } | null>(null);

  const onScan = async (result: any) => {
    const text =
      Array.isArray(result) && result.length > 0
        ? result[0]?.rawValue || result[0]?.data || ""
        : typeof result === "string"
        ? result
        : "";
    if (!text) return;
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, qrCode: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setLastResult({ name: data.studentName, status: "success" });
        toast({ title: "Attendance marked", description: data.studentName });
      } else {
        setLastResult({ name: data.studentName, status: "error" });
        toast({ variant: "destructive", title: "Error", description: data.error || "Invalid" });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Network error" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Scan Attendance</h1>
      <Card>
        <CardHeader>
          <CardTitle>QR Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md">
            <Scanner onScan={onScan} onError={(e) => console.log(e)} />
          </div>
          {lastResult && (
            <div className="flex items-center gap-2">
              <span>Last result:</span>
              <Badge variant={lastResult.status === "success" ? "default" : "destructive"}>
                {lastResult.status}
              </Badge>
              <span>{lastResult.name || ""}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
