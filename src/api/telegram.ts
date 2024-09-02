import fs from "fs/promises";
import path from "path";
import { INGV_Metadata } from "./ingv";
import { time } from "../constants";
/**
 * CONSTANTS
 */
const apiURI = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`;

/**
 * IMPLEMENTATION
 */
const Telegram = {
  formatMessage: (earthquake: INGV_Metadata) => {
    const CEST = new Date(earthquake.time).getTime() + time.ONE_HOUR * 2;
    return `⚠️ <b>Nuovo Terremoto Rilevato</b>\n
  ⏰ <b>Quando</b>: ${new Date(CEST).toLocaleString("it-IT", {
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
  },
  sendMessage: async (message: string, imagePath: string, link: string) => {
    const formData = new FormData();
    formData.append("chat_id", process.env.CHAT_ID);
    formData.append("parse_mode", "html");
    formData.append("caption", message);
    formData.append(
      "reply_markup",
      JSON.stringify({
        inline_keyboard: [
          [
            {
              text: "Altro",
              url: link,
            },
          ],
        ],
      }),
    );
    try {
      const imageBuffer = await fs.readFile(imagePath);
      const fileName = path.basename(imagePath);
      const imageBlob = new Blob([imageBuffer]);
      formData.append("photo", imageBlob, fileName);
    } catch (error) {
      console.error("Errore nel caricamento dell'immagine:", error);
      throw new Error("Impossibile caricare l'immagine");
    }

    const response = await fetch(apiURI, {
      body: formData,
      method: "POST",
    });
    return response.status === 200;
  },
};

export default Telegram;
