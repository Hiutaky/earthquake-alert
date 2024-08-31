import INGV, { INGV_Metadata } from "./api/ingv";
import Telegram from "./api/telegram";
import { __baseDir } from "./constants";
import { generateMap } from "./utils/mapMaker";
import path from "path";
import { rm } from "fs/promises";

const TEN_MINUTES = 10 * 60 * 1000;

const getMessage = (earthquake: INGV_Metadata) => {
  return `⚠️ <b>Nuovo Terremoto Rilevato</b>\n
⏰ <b>Quando</b>: ${new Date(earthquake.time).toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Rome",
  })}
📍 <b>Dove</b>: ${earthquake.locationName}
⚡️ <b>Magnitudo</b>: ${earthquake.magnitude}
⬇️ <b>Profondità</b>: ${earthquake.depth}km
🌍 <b>Lat/Long</b>: ${earthquake.latitude}/${earthquake.longitude}
👮‍♀️ <b>Rilevato da</b>: ${earthquake.author}`;
};

const fetchEarthquakes = async () => {
  console.log(`Fetching new Earthquakes`);
  const earthquakeData = await INGV.get();
  if (earthquakeData) {
    console.log(`New Earthquakes: ${earthquakeData.length}`);
    earthquakeData.map(async (earthquake) => {
      await generateMap(
        earthquake.longitude,
        earthquake.latitude,
        earthquake.magnitude,
        earthquake.locationName,
        earthquake.eventId,
      );
      const imagePath = path.join(
        __baseDir,
        "media",
        "maps",
        `${earthquake.eventId}.png`,
      );
      await Telegram.sendMessage(
        getMessage(earthquake),
        imagePath,
        `https://terremoti.ingv.it/event/${earthquake.eventId}`,
      );
      await rm(imagePath);
    });
  } else console.log(`No new Earthquakes`);
  console.log(`\n`);
  setTimeout(() => fetchEarthquakes(), TEN_MINUTES);
};

const main = async () => {
  fetchEarthquakes();
};
try {
  main();
} catch (e) {
  console.log(e);
}
