import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** LRU-aware in-process cache — used for OTPs, sessions, and short-lived data.
 *  Replaces the Redis client to remove the external dependency.
 *  For horizontal scaling, swap this out for a shared Redis/Valkey cluster.
 */
class MemoryStore {
  private readonly store = new Map<string, { value: string; expiresAt?: number }>();

  private isExpired(entry: { value: string; expiresAt?: number }): boolean {
    return entry.expiresAt !== undefined && Date.now() > entry.expiresAt;
  }

  private clean(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (this.isExpired(entry)) { this.store.delete(key); return false; }
    return true;
  }

  get(key: string): string | null {
    return this.clean(key) ? this.store.get(key)!.value : null;
  }

  set(key: string, value: string, ttlSeconds?: number): void {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1_000 : undefined,
    });
  }

  del(key: string): void { this.store.delete(key); }

  exists(key: string): boolean { return this.clean(key); }

  expire(key: string, ttlSeconds: number): void {
    const entry = this.store.get(key);
    if (entry && !this.isExpired(entry)) {
      entry.expiresAt = Date.now() + ttlSeconds * 1_000;
    }
  }

  ttl(key: string): number {
    const entry = this.store.get(key);
    if (!entry || this.isExpired(entry)) return -2;
    if (entry.expiresAt === undefined) return -1;
    return Math.max(0, Math.round((entry.expiresAt - Date.now()) / 1_000));
  }

  incr(key: string): number {
    const val = parseInt(this.get(key) ?? '0', 10);
    const next = val + 1;
    const existing = this.store.get(key);
    this.store.set(key, { value: String(next), expiresAt: existing?.expiresAt });
    return next;
  }

  keys(pattern: string): string[] {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    const result: string[] = [];
    for (const [k, entry] of this.store.entries()) {
      if (this.isExpired(entry)) { this.store.delete(k); continue; }
      if (regex.test(k)) result.push(k);
    }
    return result;
  }

  mget(keys: string[]): (string | null)[] {
    return keys.map((k) => this.get(k));
  }
}

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly mem = new MemoryStore();

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Cache initialised (in-memory store)');
  }

  async get(key: string): Promise<string | null> {
    return this.mem.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    this.mem.set(key, value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    this.mem.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.mem.exists(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    this.mem.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    return this.mem.ttl(key);
  }

  async incr(key: string): Promise<number> {
    return this.mem.incr(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.mem.keys(pattern);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return this.mem.mget(keys);
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.mem.set(key, JSON.stringify(value), ttlSeconds);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = this.mem.get(key);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
  }

  async deletePattern(pattern: string): Promise<void> {
    const matched = this.mem.keys(pattern);
    matched.forEach((k) => this.mem.del(k));
  }

  /** @deprecated always returns null — kept for API compatibility */
  getClient(): null { return null; }

  /** @deprecated always false — kept for API compatibility */
  isRedisAvailable(): false { return false; }
}
