import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface MemEntry {
  value: string;
  expiresAt?: number; // ms timestamp
}

/** In-memory fallback store used when Redis is unavailable (dev mode) */
class MemoryStore {
  private store = new Map<string, MemEntry>();

  private isExpired(entry: MemEntry): boolean {
    return entry.expiresAt !== undefined && Date.now() > entry.expiresAt;
  }

  get(key: string): string | null {
    const entry = this.store.get(key);
    if (!entry || this.isExpired(entry)) { this.store.delete(key); return null; }
    return entry.value;
  }

  set(key: string, value: string, ttlSeconds?: number): void {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  del(key: string): void { this.store.delete(key); }

  exists(key: string): boolean { return this.get(key) !== null; }

  expire(key: string, ttlSeconds: number): void {
    const entry = this.store.get(key);
    if (entry && !this.isExpired(entry)) {
      entry.expiresAt = Date.now() + ttlSeconds * 1000;
    }
  }

  ttl(key: string): number {
    const entry = this.store.get(key);
    if (!entry || this.isExpired(entry)) return -2;
    if (entry.expiresAt === undefined) return -1;
    return Math.max(0, Math.round((entry.expiresAt - Date.now()) / 1000));
  }

  incr(key: string): number {
    const val = parseInt(this.get(key) ?? '0', 10);
    const next = val + 1;
    const entry = this.store.get(key);
    this.store.set(key, { value: String(next), expiresAt: entry?.expiresAt });
    return next;
  }

  keys(pattern: string): string[] {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return [...this.store.keys()].filter((k) => {
      const entry = this.store.get(k)!;
      if (this.isExpired(entry)) { this.store.delete(k); return false; }
      return regex.test(k);
    });
  }

  mget(keys: string[]): (string | null)[] {
    return keys.map((k) => this.get(k));
  }
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private memStore = new MemoryStore();
  private redisAvailable = false;
  private connectionAttempted = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('redis.host', 'localhost');
    const port = this.configService.get<number>('redis.port', 6379);
    const password = this.configService.get<string>('redis.password');

    await new Promise<void>((resolve) => {
      const client = new Redis({
        host,
        port,
        password: password || undefined,
        // Only retry a couple of times at startup, then give up
        retryStrategy: (times) => {
          if (times >= 3) return null; // stop retrying
          return Math.min(times * 200, 1000);
        },
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
        lazyConnect: false,
        connectTimeout: 3000,
      });

      const timer = setTimeout(() => {
        if (!this.connectionAttempted) {
          this.connectionAttempted = true;
          this.logger.warn('Redis unavailable — using in-memory fallback (OTP/sessions stored locally)');
          client.disconnect();
          resolve();
        }
      }, 4000);

      client.on('ready', () => {
        if (!this.connectionAttempted) {
          this.connectionAttempted = true;
          clearTimeout(timer);
          this.redisAvailable = true;
          this.client = client;
          this.logger.log('Redis connected ✅');
          resolve();
        }
      });

      client.on('error', (err) => {
        if (!this.connectionAttempted && (err as any)?.code === 'ECONNREFUSED') {
          // First ECONNREFUSED means Redis is definitely not running
          this.connectionAttempted = true;
          clearTimeout(timer);
          this.logger.warn('Redis unavailable — using in-memory fallback (OTP/sessions stored locally)');
          client.disconnect();
          resolve();
        }
        // Suppress further errors after we've decided the mode
      });
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }

  // ─── Public API ──────────────────────────────────────────────

  async get(key: string): Promise<string | null> {
    if (this.redisAvailable && this.client) return this.client.get(key);
    return this.memStore.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.redisAvailable && this.client) {
      if (ttlSeconds) await this.client.setex(key, ttlSeconds, value);
      else await this.client.set(key, value);
      return;
    }
    this.memStore.set(key, value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    if (this.redisAvailable && this.client) { await this.client.del(key); return; }
    this.memStore.del(key);
  }

  async exists(key: string): Promise<boolean> {
    if (this.redisAvailable && this.client) return (await this.client.exists(key)) === 1;
    return this.memStore.exists(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    if (this.redisAvailable && this.client) { await this.client.expire(key, ttlSeconds); return; }
    this.memStore.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    if (this.redisAvailable && this.client) return this.client.ttl(key);
    return this.memStore.ttl(key);
  }

  async incr(key: string): Promise<number> {
    if (this.redisAvailable && this.client) return this.client.incr(key);
    return this.memStore.incr(key);
  }

  async keys(pattern: string): Promise<string[]> {
    if (this.redisAvailable && this.client) return this.client.keys(pattern);
    return this.memStore.keys(pattern);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    if (this.redisAvailable && this.client) return this.client.mget(keys);
    return this.memStore.mget(keys);
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try { return JSON.parse(value) as T; } catch { return null; }
  }

  async deletePattern(pattern: string): Promise<void> {
    const matchedKeys = await this.keys(pattern);
    if (matchedKeys.length === 0) return;
    if (this.redisAvailable && this.client) {
      await this.client.del(...matchedKeys);
    } else {
      matchedKeys.forEach((k) => this.memStore.del(k));
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  isRedisAvailable(): boolean {
    return this.redisAvailable;
  }
}
