# Chapter 10: Payments

## Overview
This chapter covers the integration of payments using Polar, including checkout and billing portal flows, and connecting with authentication.

## Steps Completed
- Setup Polar for payment processing
- Integrated Polar with BetterAuth for secure user validation
- Created checkout flow for users
- Created billing portal for subscription management
- Pushed changes to a new branch (`10`), created a PR, reviewed, and merged

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant App
    participant API
    participant Auth
    participant Polar
    participant Checkout
    participant Billing

    User->>App: Initiates payment/checkout
    App->>API: Calls payment endpoint
    API->>Auth: Validates user session
    Auth-->>API: Session valid
    API->>Polar: Creates checkout session
    Polar-->>API: Returns checkout URL
    API-->>App: Returns checkout URL
    App-->>User: Redirects to checkout
    User->>Checkout: Completes payment
    Checkout->>Polar: Processes payment
    Polar-->>Checkout: Payment confirmation
    Checkout-->>User: Shows result
    User->>App: Accesses billing portal
    App->>API: Calls billing portal endpoint
    API->>Polar: Creates billing portal session
    Polar-->>API: Returns billing portal URL
    API-->>App: Returns billing portal URL
    App-->>User: Redirects to billing portal
    User->>Billing: Manages subscription
    Billing->>Polar: Updates/cancels subscription
    Polar-->>Billing: Confirmation
    Billing-->>User: Shows updated status
```

## Notes
- All sensitive payment logic is handled by Polar.
- User authentication is required for all payment and billing actions.
- The integration ensures a secure and seamless payment experience.
