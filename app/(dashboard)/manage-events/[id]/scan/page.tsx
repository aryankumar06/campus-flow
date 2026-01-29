"use client";

import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ScanPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    studentName?: string;
  } | null>(null);
  const [scanning, setScanning] = useState(true);

  const handleScan = async (data: any) => {
    const text =
      Array.isArray(data) && data.length > 0
        ? data[0]?.rawValue || data[0]?.data || ""
        : typeof data === "string"
        ? data
        : "";
    if (!text || text === lastScanned) return;
    
    setLastScanned(text);
    setScanning(false); // Pause scanning

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: params.id,
          qrCode: text,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setScanResult({
          success: true,
          message: "Attendance marked successfully!",
          studentName: result.studentName,
        });
        toast({
          title: "Success",
          description: `Marked attendance for ${result.studentName}`,
        });
      } else {
        setScanResult({
          success: false,
          message: result.error || "Failed to mark attendance",
        });
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to mark attendance",
        });
      }
    } catch (error) {
      setScanResult({
        success: false,
        message: "Network error occurred",
      });
    }
  };

  const resetScan = () => {
    setLastScanned(null);
    setScanResult(null);
    setScanning(true);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Scan Attendance</h1>
        <p className="text-muted-foreground">
          Point the camera at the student’s QR code ticket
        </p>
      </div>

      <div className="aspect-square bg-black rounded-lg overflow-hidden relative">
        {scanning ? (
          <Scanner onScan={handleScan} onError={(error) => console.log(error)} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
             <div className="text-center p-6 space-y-4">
                {scanResult?.success ? (
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                ) : (
                    <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                )}
                <h3 className="text-xl font-semibold">
                    {scanResult?.success ? "Success!" : "Error"}
                </h3>
                <p className="text-muted-foreground">
                    {scanResult?.message}
                </p>
                {scanResult?.studentName && (
                    <p className="font-medium text-lg">{scanResult.studentName}</p>
                )}
                <Button onClick={resetScan} className="w-full">Scan Next</Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
