import pino from "pino";

// Define os "transports" (destinos) para os logs
const transport = pino.transport({
  targets: [
    {
      // --- Log para o CONSOLE ---
      // Nível: 'info' e acima (info, warn, error, fatal)
      level: "info",
      target: "pino-pretty",
      options: {
        // Opções do pino-pretty
        colorize: true,
        translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
    {
      // --- Log para ARQUIVO ---
      // Nível: 'warn' e acima (apenas avisos e erros irão para o arquivo)
      level: "warn",
      // Target: 'pino/file' para escrever em um arquivo
      target: "pino/file",
      options: {
        // Destino do arquivo de log
        destination: `./logs/app.log`,
        // Cria a pasta se ela não existir
        mkdir: true,
      },
    },
  ],
});

// Cria e exporta a instância do logger
export const logger = pino(transport);
