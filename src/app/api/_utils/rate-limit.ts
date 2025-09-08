import { getRedis } from "@/lib/redis";

type Result = {
  limited: boolean;
  remaining: number;
  resetAt: number;
  current: number;
};

function cfg() {
  const windowSec = Number(process.env.REDIS_RATE_DURATION);
  const limit = Number(process.env.REDIS_RATE_LIMIT);
  const prefix = process.env.REDIS_RATE_PREFIX;
  return { windowSec, limit, prefix };
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

export async function checkRateLimit(ip: string): Promise<Result> {
  const redis = getRedis();
  const {limit, prefix, windowSec} = cfg();
  
  const n = nowSec();
  const windowId = Math.floor(n / windowSec);
  const key = `${prefix}:${ip}:${windowId}`;

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
