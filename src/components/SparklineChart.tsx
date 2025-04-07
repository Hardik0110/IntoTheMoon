
import { useEffect, useRef } from 'react';

interface SparklineChartProps {
  data: number[];
  width: number;
  height: number;
  lineColor: string;
  fillColor?: string;
}

const SparklineChart = ({ data, width, height, lineColor, fillColor }: SparklineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Find min and max values
      const minValue = Math.min(...data);
      const maxValue = Math.max(...data);
      const range = maxValue - minValue;

      // Calculate the scaling factors
      const xScale = width / (data.length - 1);
      const yScale = range === 0 ? 0 : height / range;

      // Begin drawing the path
      ctx.beginPath();
      ctx.moveTo(0, height - (data[0] - minValue) * yScale);

      // Draw lines connecting all data points
      for (let i = 1; i < data.length; i++) {
        ctx.lineTo(i * xScale, height - (data[i] - minValue) * yScale);
      }

      // Set up line style
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fill area under the line if fillColor is provided
      if (fillColor) {
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = 0.1;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }, [data, width, height, lineColor, fillColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="inline-block"
    />
  );
};

export default SparklineChart;
