declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHAT_ID: string;
      BOT_TOKEN: string;
    }
  }
}
export {};
