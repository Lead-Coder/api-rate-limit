package com.api.rate_limiter.controller;

import com.api.rate_limiter.model.ApiClient;
import com.api.rate_limiter.repository.ApiRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class StatsController {

    private final ApiRepo apiRepo;

    @GetMapping("/stats")
    public Map<String, Object> getStats(
            @RequestHeader("X-API-KEY") String apiKey) {

        ApiClient client = apiRepo.findByApiKey(apiKey)
                .orElseThrow(() -> new RuntimeException("Invalid API key"));

        return Map.of(
                "requestsUsed", client.getRequestsToday(),
                "rateLimit", client.getRateLimitPerMinute(),
                "remainingQuota",
                Math.max(0, client.getRateLimitPerMinute() - client.getRequestsToday()),
                "avgResponseTime", 45 // placeholder (logs based calc later)
        );
    }
}
