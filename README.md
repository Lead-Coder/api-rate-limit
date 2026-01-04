## Smart API Rate Limiter and Usage Analytics Platform

API Guardian is a backend focused system built using Spring Boot that enforces API rate limiting using API keys, while also providing detailed request logging and usage analytics. The system is designed to protect APIs from abuse, monitor client behavior, and give administrators clear visibility into API consumption.
<br>


### 🚀 Features

* API Key Based Access Control
  * Each client accesses APIs using a unique API key
  * Invalid or missing API keys are rejected immediately

* Configurable Rate Limiting
  * Per API key request limiting
  * Fixed time window based rate limiting
  * Prevents excessive API usage and abuse

* Request Logging
  * Logs only valid API key based requests
  * Captures endpoint, HTTP method, status code, response time, and timestamp
  * Avoids logging unauthorized or irrelevant requests

* Admin Usage Analytics
  * View API usage per client
  * Track number of requests made
  * Monitor rate limit violations


### 🛠️ Tech Stack

* Backend: Spring Boot (Java)

* Build Tool: Maven

* Database: MongoDB

* Security: API Key Authentication

* Concurrency: ConcurrentHashMap for rate limiting

* Logging: Custom request logging mechanism

* Frontend: React (Admin Dashboard)
