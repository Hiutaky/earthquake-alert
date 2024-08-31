import { __baseDir } from "../constants";
import { createCanvas, loadImage, Image } from "canvas";
import * as fs from "fs/promises";
import * as path from "path";

export const generateMap = async (
  long: number,
  lat: number,
  magnitude: number,
  location: string,
  eventId: number,
) => {
  const zoom = 14;
  const coords = lonLatToTile(long, lat, zoom);
  const uri = `https://a.tile.openstreetmap.org/${zoom}/${coords.x}/${coords.y}.png`;
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const canvasSize = 256;
  const markerSize = 48;
  const canvas = createCanvas(canvasSize, canvasSize);
  const ctx = canvas.getContext("2d");

  const mapImage = await loadImage(buffer);
  ctx.drawImage(mapImage, 0, 0, canvasSize, canvasSize);

  const markerPath = path.join(__baseDir, "media", "marker.png");
  const markerImage = await loadImage(markerPath);
  const markerX = (canvasSize - markerSize) / 2;
  const markerY = (canvasSize - markerSize) / 2;
  ctx.drawImage(markerImage, markerX, markerY, markerSize, markerSize);

  const drawText = (text: string, x: number, y: number, fontSize: number) => {
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  };

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  const magnitudeText = `M ${parseFloat(magnitude.toString()).toFixed(1)}`;
  const magnitudeWidth = ctx.measureText(magnitudeText).width;
  const magnitudeX = (canvasSize - magnitudeWidth) / 2;
  const magnitudeY = markerY - 20;
  drawText(magnitudeText, magnitudeX, magnitudeY, 16);

  ctx.font = "bold 14px Arial";
  const locationWidth = ctx.measureText(location).width;
  const locationX = (canvasSize - locationWidth) / 2;
  const locationY = markerY - 2;
  drawText(location, locationX, locationY, 14);

  const outputBuffer = canvas.toBuffer("image/png");
  const outputPath = path.join(__baseDir, "media", "maps", `${eventId}.png`);
  await fs.writeFile(outputPath, outputBuffer);

  return true;
};

function lonLatToTile(
  lon: number,
  lat: number,
  zoom: number,
): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const format = (n: number) =>
    new Number(parseFloat(n.toString()).toFixed(5)).valueOf();
  const formatLat = format(lat);
  const x = Math.floor(((format(lon) + 180) / 360) * n);
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((formatLat * Math.PI) / 180) +
          1 / Math.cos((formatLat * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
      n,
  );
  return { x, y };
}
