import fs from "fs/promises";
import path from "path";
/**
 * CONSTANTS
 */
const apiURI = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`;

/**
 * IMPLEMENTATION
 */
const Telegram = {
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
