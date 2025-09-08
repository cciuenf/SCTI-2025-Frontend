import pino from "pino";

// Define os "transports" (destinos) para os logs
const transport = pino.transport({
  targets: [
    {
      level: "info",
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
    {
      level: "info",
      target: "pino/file",
      options: {
        destination: `./logs/app.log`,
        mkdir: true,
      },
    },
  ],
});

// Cria e exporta a instância do logger
export const logger = pino(transport);
