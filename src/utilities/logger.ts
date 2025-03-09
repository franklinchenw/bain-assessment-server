import pino from "pino";
import { clsProxify } from "cls-proxify";

export const loggerPino = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: false,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss Z",
    },
  },
});

export default clsProxify(loggerPino);
