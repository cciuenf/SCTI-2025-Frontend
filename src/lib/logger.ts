import pino, { LogDescriptor } from "pino";

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
        destination: `./logs/frontend.log`,
        mkdir: true,
      },
    },
  ],
});

// Cria e exporta a instância do logger
export const logger = pino(
  {
    formatters: {
      bindings: (bindings) => {
        return {
          pid: bindings.pid,
          hostname: bindings.hostname,
          app: "scti-frontend-2025",
        };
      },
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    messageKey: "message",
  },
  transport
);
