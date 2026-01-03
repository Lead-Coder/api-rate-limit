package com.api.rate_limiter.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateService {

    private final MongoTemplate mongoTemplate;

    public void incrementRequestsToday(String apiKey) {
        Query query = new Query(Criteria.where("apiKey").is(apiKey));
        Update update = new Update().inc("requestsToday", 1);
        mongoTemplate.updateFirst(query, update, "api_clients");
    }
}

