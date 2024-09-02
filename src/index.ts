import INGV, { INGV_Metadata } from "./api/ingv";
import Telegram from "./api/telegram";
import { __baseDir, time } from "./constants";
import { generateMap } from "./utils/mapMaker";
import path from "path";
import { rm } from "fs/promises";

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
        Telegram.formatMessage(earthquake),
        imagePath,
        `https://terremoti.ingv.it/event/${earthquake.eventId}`,
      );
      await rm(imagePath);
    });
  } else console.log(`No new Earthquakes`);
  console.log(`\n`);
  setTimeout(() => fetchEarthquakes(), time.TEN_MINUTES);
};

const main = async () => {
  fetchEarthquakes();
};
try {
  main();
} catch (e) {
  console.log(e);
}
