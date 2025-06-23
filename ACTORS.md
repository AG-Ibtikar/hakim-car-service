# Hakim Car Service - System Actors

This document outlines the three main actors in the Hakim Car Service platform, their roles, and responsibilities.

## 1. Customer (End User – Mobile App)

**Role:** Service requester and vehicle owner.

### Responsibilities:
- Register or continue as guest
- View available car services:
  - Tow
  - Emergency
  - Maintenance
  - Quick
- Submit service requests with:
  - Location details
  - Car details
- Track driver/technician live
- Approve costs and make payments:
  - E-payment
  - Cash
- Receive invoices
- Rate and review services
- View service history
- View active warranties

## 2. Garage Technician (Field Operator – Web or Mobile App)

**Role:** Service executor for assigned jobs.

### Responsibilities:
- Log in to view assigned service requests
- Navigate to customer location
- Conduct inspections:
  - Photo documentation
  - Car registration verification
- Perform services:
  - On-site service execution
  - Escalation handling (towing, parts request)
- Capture customer signature digitally
- Confirm payment method:
  - Log cash payments
  - Trigger e-payments
- Mark service completion
- Upload service results
- View service history per vehicle

## 3. Super Admin (Operations Team – Web Dashboard)

**Role:** Service coordinator and system administrator.

### Responsibilities:
- Request Management:
  - Assign requests to available technicians/garages
  - Monitor live requests
  - Track driver locations
- System Configuration:
  - Manage brands
  - Configure services
  - Set pricing
  - Define warranties
  - Establish SLAs
- Operations Management:
  - Oversee escalations
  - Handle exceptions
  - Manage support communications
- Financial Management:
  - Configure garage commissions
  - Generate settlement reports
- System Administration:
  - Audit logs
  - Track performance metrics
  - Resolve conflicts
  - Administer user access
  - Configure system settings 