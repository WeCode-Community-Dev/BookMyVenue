# BookMyVenue Application Flowchart

Here is a visual, easy-to-understand breakdown of how data flows through the BookMyVenue system.

```mermaid
graph TD
    %% Node Definitions with custom styling
    classDef user fill:#FF9A9E,stroke:#333,stroke-width:2px,color:#000,font-weight:bold,rx:10,ry:10
    classDef frontend fill:#A1C4FD,stroke:#333,stroke-width:2px,color:#000,font-weight:bold,rx:10,ry:10
    classDef backend fill:#D4FC79,stroke:#333,stroke-width:2px,color:#000,font-weight:bold,rx:10,ry:10
    classDef db fill:#FBC2EB,stroke:#333,stroke-width:2px,color:#000,font-weight:bold,rx:10,ry:10
    classDef cache fill:#FFE259,stroke:#333,stroke-width:2px,color:#000,font-weight:bold,rx:10,ry:10
    classDef broker fill:#84FAB0,stroke:#333,stroke-width:2px,color:#000,font-weight:bold,rx:10,ry:10
    classDef service fill:#FFD194,stroke:#333,stroke-width:2px,color:#000,font-weight:bold,rx:10,ry:10

    %% 1. User Interaction
    U((👤 User)):::user -->|Visits Website| F[💻 Frontend App <br/> React + Vite]:::frontend
    
    %% 2. Frontend Branches
    F -->|1. Authenticates| Auth[🔐 Auth Flow]:::backend
    F -->|2. Browses Venues| Browse[🔍 Venue Search <br/> & Map View]:::backend
    F -->|3. Selects Time| Check[⏳ Check Availability]:::backend
    
    %% Auth Flow
    Auth -->|Returns JWT Role| F
    
    %% Browse Venues
    Browse -->|Query via FastAPI| DB[(🐘 PostgreSQL <br/> Database)]:::db
    
    %% Availability Check
    Check -->|Check Active Bookings| Redis1[(⚡ Redis Cache)]:::cache
    Redis1 -.->|Cache Miss| DB
    
    %% Booking Flow
    Check -->|Clicks Book| Lock[🔒 Acquire Distributed Lock <br/> to prevent double-booking]:::cache
    Lock -->|Proceed if Lock Acquired| Save[💾 Save PENDING Booking]:::db
    
    %% Payment Flow
    Save -->|Send Payment Event| MQ[🐇 RabbitMQ <br/> Message Queue]:::broker
    MQ -->|Consume Event| Pay[💳 Payment Service <br/> Microservice]:::service
    Pay -->|Process Payment via Gateway| Ext[🌐 External Bank/Stripe]
    Ext -->|Payment Success| Pay
    
    %% Completion
    Pay -->|Send Webhook| Webhook[🔔 Webhook Endpoint <br/> FastAPI]:::backend
    Webhook -->|Update Status to CONFIRMED| DB
    
    %% Flow Labels
    style Ext fill:#E0C3FC,stroke:#333,stroke-width:2px,color:#000,font-weight:bold,rx:10,ry:10
```

### Flow Breakdown:
1. **User Interaction (Pink)**: The user starts at the React frontend.
2. **Frontend Operations (Blue)**: The frontend splits traffic to Auth, Venue Browsing, or Availability checks based on user actions.
3. **Backend Processing (Green)**: FastAPI handles these requests.
4. **Caching & Locks (Yellow)**: Redis is used heavily for quick availability checks and to lock venues so two people can't book the exact same slot at the exact same time.
5. **Database (Light Pink)**: PostgreSQL safely stores the venues, users, and bookings.
6. **Asynchronous Payments (Mint/Orange)**: Once a booking is marked as `PENDING`, RabbitMQ safely hands the payment task to a separate service to avoid slowing down the main app.
7. **Webhook Confirmation (Green)**: The payment service informs the backend that payment succeeded, changing the booking to `CONFIRMED`.
