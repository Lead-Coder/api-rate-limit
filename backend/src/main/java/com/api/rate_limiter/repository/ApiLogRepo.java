package com.api.rate_limiter.repository;

import com.api.rate_limiter.model.ApiLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ApiLogRepo extends MongoRepository<ApiLog, String> {
}

