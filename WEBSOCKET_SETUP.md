# WebSocket Setup for Real-Time Air Quality Dashboard

## Overview
This dashboard now uses real WebSocket connections for live air quality data updates instead of simulated data.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the WebSocket Server
```bash
npm run websocket
```
This will start the WebSocket server on port 3001.

### 3. Start the Next.js Development Server
In a new terminal:
```bash
npm run dev
```
This will start the Next.js app on port 3000.

### 4. Run Both Servers Together (Recommended)
```bash
npm run dev:full
```
This command runs both the WebSocket server and Next.js app simultaneously.

## How It Works

### WebSocket Server (Port 3001)
- Generates realistic air quality data every 2 seconds
- Emits `air-quality-update` events with the following parameters:
  - CO (Carbon Monoxide): 1-11 ppm
  - NO2 (Nitrogen Dioxide): 50-250 ppb
  - T (Temperature): 10-40°C
  - RH (Relative Humidity): 40-80%
  - Plus all other air quality parameters

### Frontend Integration
- The `SummaryCards` component connects to `ws://localhost:3001`
- Real-time data updates the metric cards automatically
- Trend indicators show real changes in values
- Connection status is displayed in the UI

## Features

✅ **Real WebSocket Connection**: No more simulated data
✅ **Live Updates**: Data updates every 2 seconds
✅ **Connection Status**: Visual indicator of WebSocket connection
✅ **Error Handling**: Graceful handling of connection errors
✅ **Trend Analysis**: Real-time trend detection and display

## Troubleshooting

### WebSocket Connection Issues
1. Ensure the WebSocket server is running on port 3001
2. Check that CORS is properly configured
3. Verify the connection URL in `SummaryCards.tsx`

### Data Not Updating
1. Check browser console for WebSocket errors
2. Verify the `air-quality-update` event is being received
3. Ensure the data format matches expected structure

## Production Deployment

For production, you'll need to:
1. Deploy the WebSocket server to a hosting service
2. Update the WebSocket URL in the frontend
3. Configure proper CORS settings
4. Set up environment variables for different environments
