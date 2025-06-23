-- Clear existing data
TRUNCATE TABLE service_requests;

-- Insert service requests
INSERT INTO service_requests (
    id, userId, vehicleId, serviceType, location, description, status, 
    estimatedCost, scheduledTime, createdAt, updatedAt, 
    customerName, customerPhone, vehicleType, make, model
) VALUES (
    '68c25c7e-e45f-4e57-b468-11d9c94a38e6', NULL, NULL, 'MAINTENANCE',
    '{"address": "San Francisco, CA", "latitude": 37.7749, "longitude": -122.4194}',
    'Test service request', 'PENDING', NULL, NULL,
    '2025-05-28T12:22:26.787Z', '2025-05-28T12:22:26.787Z',
    'Test User', '1234567890', 'SEDAN', 'Toyota', 'Camry'
),
(
    '0eeffd80-5d9a-449d-b6e2-02230d0d6b01', NULL, NULL, 'MAINTENANCE',
    '{"address": "Emiratron, Sheikh Zayed Road (north), Business Bay, Downtown Dubai, Dubai, United Arab Emirates", "latitude": null, "longitude": null}',
    'Service request for honda Civic (sedan)', 'PENDING', NULL, NULL,
    '2025-05-28T12:24:39.285Z', '2025-05-28T12:24:39.285Z',
    'Ahmed Gaber', '+20 123 456 7890e', 'sedan', 'honda', 'Civic'
); 