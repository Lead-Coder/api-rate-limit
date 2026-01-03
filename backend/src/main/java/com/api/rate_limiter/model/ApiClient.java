package com.api.rate_limiter.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "api_clients")
@Data
public class ApiClient {
        @Id
        private String id;

        private String apiKey;
        private String clientName;
        private String role;   // ADMIN or CLIENT
        private String status;
        private int rateLimitPerMinute;
        private int requestsToday;

}
