import { getRedis } from "@/lib/redis";

type Result = {
  limited: boolean;
  remaining: number;
  resetAt: number;
  current: number;
};

export async function checkRateLimit(
  ip: string,
): Promise<Result> {
  const redis = getRedis();
  await redis.connect().catch(() => {}); // connect if not already connected
  const windowSec = Number(process.env.REDIS_RATE_DURATION);
  const limit = Number(process.env.REDIS_RATE_LIMIT)
  
  const nowSec = Math.floor(Date.now() / 1000);
  const windowId = Math.floor(nowSec / windowSec);
  const key = `${process.env.REDIS_RATE_PREFIX}:${ip}:${windowId}`;

  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, windowSec);
  
  const remaining = Math.max(0, limit - current);
  const resetAt = (windowId + 1) * windowSec;

  return {
    limited: current > limit,
    remaining,
    resetAt,
    current,
  };
}
