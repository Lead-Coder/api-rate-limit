package com.api.rate_limiter.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "api_logs")
@Data
public class ApiLog {

    @Id
    private String id;

    private String apiKey;
    private String endpoint;
    private String method;        // GET, POST, etc
    private int statusCode;        // HTTP status
    private long responseTime;     // ms
    private String ip;             // client IP
    private long timestamp;        // epoch millis
}
