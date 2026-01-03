package com.api.rate_limiter.service;

import com.api.rate_limiter.model.ApiClient;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class Apikey {

    private static final long TTL_MS = 5 * 60 * 1000; // 5 minutes

    private final ConcurrentHashMap<String, CachedClient> cache = new ConcurrentHashMap<>();

    public ApiClient get(String apiKey) {
        CachedClient cached = cache.get(apiKey);

        if (cached == null) return null;

        if (Instant.now().toEpochMilli() - cached.cachedAt > TTL_MS) {
            cache.remove(apiKey);
            return null;
        }
        return cached.client;
    }

    public void put(ApiClient client) {
        cache.put(client.getApiKey(), new CachedClient(client));
    }

    private static class CachedClient {
        ApiClient client;
        long cachedAt;

        CachedClient(ApiClient client) {
            this.client = client;
            this.cachedAt = Instant.now().toEpochMilli();
        }
    }
}
