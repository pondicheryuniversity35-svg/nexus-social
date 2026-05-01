import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const CANVAS_SIZE = 320;
const CIRCLE_RADIUS = 148;
const CX = CANVAS_SIZE / 2;
const CY = CANVAS_SIZE / 2;

interface ImageCropModalProps {
  imageDataUrl: string;
  open: boolean;
  onConfirm: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export function ImageCropModal({
  imageDataUrl,
  open,
  onConfirm,
  onCancel,
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originPan: { x: number; y: number };
  }>({
    active: false,
    startX: 0,
    startY: 0,
    originPan: { x: 0, y: 0 },
  });

  // Load image when modal opens
  useEffect(() => {
    if (!open || !imageDataUrl) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    img.src = imageDataUrl;
  }, [open, imageDataUrl]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Compute scaled image dimensions, fit by short side to fill circle
    const scale =
      zoom *
      Math.max(
        (CIRCLE_RADIUS * 2) / img.width,
        (CIRCLE_RADIUS * 2) / img.height,
      );
    const w = img.width * scale;
    const h = img.height * scale;
    const dx = CX - w / 2 + pan.x;
    const dy = CY - h / 2 + pan.y;

    // Draw full image (slightly dim)
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(img, dx, dy, w, h);
    ctx.restore();

    // Draw image clipped to circle (full brightness)
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, CIRCLE_RADIUS, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, dx, dy, w, h);
    ctx.restore();

    // Draw circle border
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, CIRCLE_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }, [zoom, pan]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse events
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    dragRef.current = {
      active: true,
      startX: pos.x,
      startY: pos.y,
      originPan: pan,
    };
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragRef.current.active) return;
    const pos = getPos(e);
    const dx = pos.x - dragRef.current.startX;
    const dy = pos.y - dragRef.current.startY;
    setPan({
      x: dragRef.current.originPan.x + dx,
      y: dragRef.current.originPan.y + dy,
    });
  };

  const onDragEnd = () => {
    dragRef.current.active = false;
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    if (!img) return;

    const outputSize = CIRCLE_RADIUS * 2;
    const offscreen = document.createElement("canvas");
    offscreen.width = outputSize;
    offscreen.height = outputSize;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    const scale =
      zoom *
      Math.max(
        (CIRCLE_RADIUS * 2) / img.width,
        (CIRCLE_RADIUS * 2) / img.height,
      );
    const w = img.width * scale;
    const h = img.height * scale;
    // Offscreen coords: circle center is at (outputSize/2, outputSize/2)
    const dx = outputSize / 2 - w / 2 + pan.x;
    const dy = outputSize / 2 - h / 2 + pan.y;

    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, CIRCLE_RADIUS, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, dx, dy, w, h);

    onConfirm(offscreen.toDataURL("image/png"));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onCancel();
      }}
    >
      <DialogContent
        className="bg-card border-border sm:max-w-md p-6"
        data-ocid="crop.modal"
      >
        <DialogHeader>
          <DialogTitle>Crop Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-2">
          <div
            className="rounded-2xl overflow-hidden border border-border bg-black cursor-grab active:cursor-grabbing select-none"
            style={{ touchAction: "none" }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onMouseDown={onDragStart}
              onMouseMove={onDragMove}
              onMouseUp={onDragEnd}
              onMouseLeave={onDragEnd}
              onTouchStart={onDragStart}
              onTouchMove={onDragMove}
              onTouchEnd={onDragEnd}
              data-ocid="crop.canvas_target"
            />
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ZoomIn className="w-4 h-4" />
              <span>Zoom</span>
              <span className="ml-auto text-xs">{zoom.toFixed(1)}×</span>
            </div>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
              className="w-full"
              data-ocid="crop.zoom.toggle"
            />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Drag to reposition · Scroll slider to zoom
          </p>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            data-ocid="crop.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 nexus-accent-bg text-white hover:opacity-90"
            onClick={handleConfirm}
            data-ocid="crop.confirm_button"
          >
            Crop & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
