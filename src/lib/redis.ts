import Redis from "ioredis";

let client: Redis | null = null;

export function getRedis() {
  if (!client) {
    client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 1,
      enableAutoPipelining: true,
      enableReadyCheck: true,
    });
  }
  return client;
}
