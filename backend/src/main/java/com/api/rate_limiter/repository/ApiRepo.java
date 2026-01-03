package com.api.rate_limiter.repository;

import com.api.rate_limiter.model.ApiClient;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ApiRepo extends MongoRepository<ApiClient, String> {

    Optional<ApiClient> findByApiKey(String apiKey);

}

