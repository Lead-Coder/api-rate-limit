package com.api.rate_limiter.controller;

import com.api.rate_limiter.model.ApiClient;
import com.api.rate_limiter.model.ApiLog;
import com.api.rate_limiter.repository.ApiLogRepo;
import com.api.rate_limiter.repository.ApiRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final ApiLogRepo logRepository;

    public AdminController(ApiLogRepo logRepository, ApiRepo clientRepo) {
        this.logRepository = logRepository;
        this.clientRepo = clientRepo;
    }

    private final ApiRepo clientRepo;

    @PostMapping("/clients")
    public ApiClient createClient(@RequestBody ApiClient client) {

        client.setId(null); // let Mongo generate
        client.setApiKey("api_" + UUID.randomUUID());
        client.setRole("CLIENT");
        client.setStatus("ACTIVE");
        client.setRequestsToday(0);

        return clientRepo.save(client);
    }

    @GetMapping("/clients")
    public List<ApiClient> getAllClients() {
        return clientRepo.findAll();
    }

    @GetMapping("/logs")
    public List<ApiLog> getLogs() {
        return logRepository.findAll();
    }
}
