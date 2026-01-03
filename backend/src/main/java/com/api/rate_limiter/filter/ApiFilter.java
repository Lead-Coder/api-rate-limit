package com.api.rate_limiter.filter;

import com.api.rate_limiter.model.ApiClient;
import com.api.rate_limiter.model.ApiLog;
import com.api.rate_limiter.repository.ApiRepo;
import com.api.rate_limiter.service.Apikey;
import com.api.rate_limiter.service.RateLimiter;
import com.api.rate_limiter.service.UpdateService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class ApiFilter extends OncePerRequestFilter {

    private final ApiRepo clientRepository;
    private final RateLimiter rateLimiterService;
    private final Apikey cacheService;
    private final MongoOperations mongoOperations;
    private final UpdateService usageService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/auth")
                || path.startsWith("/admin")
                || path.startsWith("/actuator")
                || path.startsWith("/health")
                || path.equals("/");
    }

    private void incrementRequestsToday(String apiKey) {
        usageService.incrementRequestsToday(apiKey);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (path.startsWith("/client")) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiKey = request.getHeader("X-API-KEY");
        if (apiKey == null || apiKey.isBlank()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        long startTime = System.currentTimeMillis();

        // Cache for validation ONLY
        ApiClient client = cacheService.get(apiKey);
        if (client == null) {
            client = clientRepository.findByApiKey(apiKey).orElse(null);

            if (client == null ||
                    client.getStatus() == null ||
                    !client.getStatus().equalsIgnoreCase("ACTIVE")) {

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            cacheService.put(client);
        }

        boolean allowed = rateLimiterService.allowRequest(
                apiKey,
                client.getRateLimitPerMinute()
        );

        if (!allowed) {
            response.setStatus(429);
            saveLog(request, apiKey, 429, startTime);
            return;
        }

        filterChain.doFilter(request, response);
        if (response.getStatus() < 400) {
            usageService.incrementRequestsToday(apiKey);
        }

        saveLog(request, apiKey, response.getStatus(), startTime);
    }

    private void saveLog(HttpServletRequest request,
                         String apiKey,
                         int statusCode,
                         long startTime) {

        ApiLog log = new ApiLog();
        log.setApiKey(apiKey);
        log.setEndpoint(request.getRequestURI());
        log.setMethod(request.getMethod());
        log.setStatusCode(statusCode);
        log.setResponseTime(System.currentTimeMillis() - startTime);
        log.setIp(request.getRemoteAddr());
        log.setTimestamp(System.currentTimeMillis());

        mongoOperations.save(log);
    }
}

