declare global {
  namespace NodeJS {
    interface ProcessEnv {
        GITHUB_TOKEN: string;
        LOG_LEVEL: number;
        LOG_FILE: string;
    }
  }
}

export {} // This is needed to prevent TS from thinking this is a module