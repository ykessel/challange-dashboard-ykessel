const { Server } = require("socket.io")
const http = require("http")

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Simulate real-time air quality data
const generateAirQualityData = () => {
  return {
    CO: Math.random() * 10 + 1, // 1-11 ppm
    NO2: Math.random() * 200 + 50, // 50-250 ppb
    T: Math.random() * 30 + 10, // 10-40°C
    RH: Math.random() * 40 + 40, // 40-80%
    PT08S1: Math.random() * 1000 + 500,
    NMHC: Math.random() * 200 + 50,
    C6H6: Math.random() * 20 + 5,
    PT08S2: Math.random() * 800 + 400,
    NOx: Math.random() * 300 + 100,
    PT08S3: Math.random() * 1500 + 500,
    PT08S4: Math.random() * 2000 + 1000,
    PT08S5: Math.random() * 1500 + 500,
    AH: Math.random() * 1 + 0.5
  }
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  // Send initial data
  socket.emit("air-quality-update", generateAirQualityData())

  // Send real-time updates every 2 seconds
  const interval = setInterval(() => {
    socket.emit("air-quality-update", generateAirQualityData())
  }, 2000)

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
    clearInterval(interval)
  })
})

const PORT = 3001
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})
