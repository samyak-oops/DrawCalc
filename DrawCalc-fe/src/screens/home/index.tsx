import { useEffect, useRef, useState } from "react";
import { SWATCHES } from "@/constants";
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion } from "framer-motion";

interface Response {  // Structure for backend response
  expr: string;
  result: string;
  assign: boolean;
}

interface ResultCard {  // Structure for draggable result cards
  expression: string;
  answer: string;
  id: number;
}

// Main Home Component
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rgb(255,255,255)");
  const [reset, setReset] = useState(false);
  const [results, setResults] = useState<ResultCard[]>([]);
  const [dictOfVars, setDictOfVars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Reset canvas
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Handle reset state
  useEffect(() => {
    if (reset) {
      resetCanvas();
      setResults([]);
      setDictOfVars({});
      setReset(false);
    }
  }, [reset]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.background = "black";
      ctx.lineCap = "round";
      ctx.lineWidth = 4;
    }

    // Handle window resize to keep canvas full-screen
    const handleResize = () => {
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (imageData && ctx) ctx.putImageData(imageData, 0, 0);
    };

    window.addEventListener("resize", handleResize); // Add resize listener
    return () => window.removeEventListener("resize", handleResize);// Cleanup on unmount
  }, []);

  // Send data to backend
  const sendData = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prevent multiple submissions while loading
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/calculate`,
        {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictOfVars,
        }
      );

      const resp = response.data;
      console.log("Backend response:", resp);

      // Handle case where no results are returned
      if (!resp.data || resp.data.length === 0) {
        console.warn("No results returned from backend.");
        setLoading(false);
        return;
      }

      // This Updates variable assignments
      const newVars: Record<string, string> = { ...dictOfVars };
      resp.data.forEach((item: Response) => {
        if (item.assign) {
          newVars[item.expr] = item.result;
        }
      });
      setDictOfVars(newVars);

      // Add all results as draggable cards
      const newCards: ResultCard[] = resp.data.map(
        (item: Response, idx: number) => ({
          expression: item.expr,
          answer: item.result,
          id: Date.now() + idx,
        })
      );
      setResults((prev) => [...prev, ...newCards]);

      // Clear the canvas drawing (keep it clean after calculation)
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const stopDrawing = () => setIsDrawing(false); // Stop drawing on mouse up or when cursor leaves canvas

  // Draw on canvas
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  };

  return (
    <div className="absolute w-full h-screen overflow-hidden">

      {/* Toolbar */}
      <div
        className="absolute top-4 left-4 right-4 flex items-center gap-3 z-50"
        style={{ pointerEvents: "auto" }}
      >
        {/* Reset Button */}
        <Button
          style={{
            background: "black",
            color: "white",
            border: "1.5px solid white",
            borderRadius: "8px",
            padding: "8px 20px",
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => setReset(true)}
        >
          Reset
        </Button>

        {/* Color swatches */}
        <Group gap={6} style={{ flexGrow: 1, justifyContent: "center" }}>
          {SWATCHES.map((c: string) => (
            <ColorSwatch
              key={c}
              color={c}
              onClick={() => setColor(c)}
              style={{
                cursor: "pointer",
                outline: color === c ? "2px solid white" : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </Group>

        {/* Calculate Button */}
        <Button
          style={{
            background: loading ? "#333" : "black",
            color: "white",
            border: "1.5px solid white",
            borderRadius: "8px",
            padding: "8px 20px",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            flexShrink: 0,
            opacity: loading ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}
          onClick={sendData}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate"}
        </Button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
      />

      {/* Draggable result cards — one per result */}
      {results.map((card, index) => (
        <motion.div
          key={card.id}
          drag
          dragMomentum={false}
          dragElastic={0.1}
          initial={{
            x: 80 + (index % 5) * 30,
            y: 80 + Math.floor(index / 5) * 80,
            scale: 0.85,
            opacity: 0,
          }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className="absolute cursor-grab active:select-nonecursor-grabbing  z-40"
          style={{ touchAction: "none" }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.82)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              width: "100%",
              borderRadius: "10px",
              padding: "10px 18px",
              color: "white",
              fontSize: "1.25rem",
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 500,
              backdropFilter: "blur(6px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              whiteSpace: "wrap",
              maxWidth: "1000px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ color: "#a0c4ff" }}>{card.expression}</span>
            <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 8px" }}>=</span>
            <span style={{ color: "#b9f6b0", fontWeight: 700 }}>{card.answer}</span>
          </div>
        </motion.div>
      ))}

      {/* Variable dictionary display (bottom-left) */}
      {Object.keys(dictOfVars).length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            background: "rgba(0,0,0,0.75)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            padding: "12px 18px",
            color: "white",
            fontSize: "0.9rem",
            zIndex: 50,
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "6px", color: "#a0c4ff" }}>
            Variables
          </div>
          {Object.entries(dictOfVars).map(([k, v]) => (
            <div key={k} style={{ lineHeight: 1.7 }}>
              <span style={{ color: "#ffd6a5" }}>{k}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 6px" }}>=</span>
              <span style={{ color: "#b9f6b0" }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}