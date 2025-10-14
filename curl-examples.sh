#!/usr/bin/env bash
API=${API:-http://localhost:4000}

# Register
curl -s -X POST $API/api/auth/register -H 'Content-Type: application/json' -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Login
TOKENS=$(curl -s -X POST $API/api/auth/login -H 'Content-Type: application/json' -d '{"email":"test@example.com","password":"password123"}')
ACCESS=$(echo "$TOKENS" | jq -r .data.accessToken)

# List hotels
curl -s "$API/api/hotels?city=Austin"

# Create booking (replace ROOM_ID)
# curl -s -X POST $API/api/bookings -H "Authorization: Bearer $ACCESS" -H 'Content-Type: application/json' -d '{"roomId":"ROOM_ID","checkIn":"2025-12-01","checkOut":"2025-12-05","quantity":1}'
