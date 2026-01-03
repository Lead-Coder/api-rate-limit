package com.api.rate_limiter.service;

import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiter {
    private static final long WINDOW_SIZE_MS = 60_000; // 1 minute

    private final ConcurrentHashMap<String, RequestInfo> store = new ConcurrentHashMap<>();

    public boolean allowRequest(String apiKey, int limit) {

        long now = Instant.now().toEpochMilli();

        store.compute(apiKey, (key, info) -> {
            if (info == null || now - info.windowStart >= WINDOW_SIZE_MS) {
                return new RequestInfo(1, now);
            }
            info.count++;
            return info;
        });

        return store.get(apiKey).count <= limit;
    }

    private static class RequestInfo {
        int count;
        long windowStart;

        RequestInfo(int count, long windowStart) {
            this.count = count;
            this.windowStart = windowStart;
        }
    }
}
