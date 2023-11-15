export {};

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string;
        DATABASE_URL: string;
        ACCESS_KEY_ID: string;
        SECRET_ACCESS_KEY: string;
        // add more environment variables and their types here
      }
    }
  }