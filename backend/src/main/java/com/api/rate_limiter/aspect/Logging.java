package com.api.rate_limiter.aspect;

import com.api.rate_limiter.model.ApiLog;
import com.api.rate_limiter.repository.ApiLogRepo;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class Logging {

    private final ApiLogRepo apiLogRepo;

    @AfterReturning(
            pointcut = "execution(* com.api.rate_limiter.controller..*(..))"
    )
    public void logRequest(JoinPoint joinPoint) {
        ApiLog log = new ApiLog();
        log.setEndpoint(joinPoint.getSignature().toShortString());
        log.setTimestamp(System.currentTimeMillis());

        // 2. Used the correct variable name here
        apiLogRepo.save(log);
    }
}
