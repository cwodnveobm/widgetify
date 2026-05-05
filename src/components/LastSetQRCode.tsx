import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";

export function LastSetQRCode({ url, filename = "lastset-qr.png" }: { url: string; filename?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!url || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 1,
      color: { dark: "#0F172A", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    }).catch(() => {});
    QRCode.toDataURL(url, { width: 720, margin: 2, errorCorrectionLevel: "M" })
      .then(setDataUrl)
      .catch(() => {});
  }, [url]);

  function download() {
    if (!dataUrl) return toast.error("QR not ready yet");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("QR code downloaded");
  }

  return (
    <div className="border border-border rounded-xl p-4 bg-card space-y-3">
      <div className="flex items-center gap-2">
        <QrCode className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-sm text-foreground">Scan to open</h4>
      </div>
      <p className="text-xs text-muted-foreground">
        Anyone can scan this with their phone camera to open your profile instantly — perfect for cards, posters, and stickers.
      </p>
      <div className="flex flex-col items-center gap-3">
        <div className="bg-white p-3 rounded-lg">
          <canvas ref={canvasRef} aria-label="QR code for your LastSet profile" />
        </div>
        <Button onClick={download} variant="outline" size="sm" className="gap-2">
          <Download className="w-3.5 h-3.5" /> Download PNG
        </Button>
      </div>
    </div>
  );
}
