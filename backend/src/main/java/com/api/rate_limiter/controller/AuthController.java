package com.api.rate_limiter.controller;

import com.api.rate_limiter.model.ApiClient;
import com.api.rate_limiter.repository.ApiRepo;
import com.api.rate_limiter.service.Apikey;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ApiRepo apiRepo;
    private final Apikey cacheService;

    @PostMapping("/verify-api-key")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {

        String apiKey = body.get("apiKey");
        if (apiKey == null || apiKey.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        // Check cache
        ApiClient client = cacheService.get(apiKey);

        // Cache miss to DB
        if (client == null) {
            client = apiRepo.findByApiKey(apiKey).orElse(null);
            if (client == null || !"ACTIVE".equals(client.getStatus())) {
                return ResponseEntity.status(401).build();
            }
            cacheService.put(client);
        }

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "role", client.getRole(),
                "clientName", client.getClientName(),
                "rateLimit", client.getRateLimitPerMinute()
        ));
    }
}
