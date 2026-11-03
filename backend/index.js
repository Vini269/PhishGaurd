require('dotenv').config()
const express = require('express')
const cors = require('cors')
const scanRouter = require('./src/routes/scan')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "chrome-extension://djkcgbhamlefinfahcpahfbjekgglkmn",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "100kb" }));


app.get("/health", (req, res) => {
  res.json({ status: "Node backend running" });
});

app.use("/api/scan", scanRouter);

app.listen(PORT, () => {
  console.log(`MailGuard backend running on port ${PORT}`);
});
