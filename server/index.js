require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");

// Routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/booking");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// DEBUG
// ===============================

console.log("🔥 RUNNING FILE:", __filename);
console.log("🔥 CURRENT FOLDER:", process.cwd());

console.log(
  "JWT_SECRET exists:",
  !!process.env.JWT_SECRET
);

console.log(
  "MONGODB_URI exists:",
  !!process.env.MONGODB_URI
);

console.log(
  "RAZORPAY_KEY_ID exists:",
  !!process.env.RAZORPAY_KEY_ID
);

console.log(
  "RAZORPAY_KEY_SECRET exists:",
  !!process.env.RAZORPAY_KEY_SECRET
);

// ===============================
// RAZORPAY
// ===============================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// BASIC TEST ROUTES
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Eventora Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// ===============================
// AUTH ROUTES
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// EVENT ROUTES
// ===============================

app.use("/api/events", eventRoutes);

// ===============================
// BOOKING ROUTES
// ===============================

app.use("/api/bookings", bookingRoutes);

// ===============================
// PAYMENT - CREATE ORDER
// ===============================

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        error: "Amount must be at least 100 paise",
      });
    }

    const options = {
      amount: Number(amount),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log("🔥 Razorpay order created:", order.id);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error(
      "❌ Razorpay create order error:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Failed to create Razorpay order",
    });
  }
});

// ===============================
// PAYMENT - VERIFY PAYMENT
// ===============================

app.post("/api/payment/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing payment fields",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      console.log("✅ Payment verified");

      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    console.log("❌ Payment signature mismatch");

    return res.status(400).json({
      success: false,
      error: "Signature mismatch",
    });

  } catch (error) {
    console.error(
      "❌ Payment verification error:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Payment verification failed",
    });
  }
});

// ===============================
// 404 ROUTE
// ===============================

app.use((req, res) => {
  console.log(
    "🔥 UNMATCHED REQUEST:",
    req.method,
    req.originalUrl
  );

  res.status(404).json({
    message: "Route not found",
    method: req.method,
    url: req.originalUrl,
  });
});

// ===============================
// MONGODB CONNECTION
// ===============================

const mongoURI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URL;

if (!mongoURI) {
  console.error(
    "❌ MONGO_URI / MONGODB_URL is missing"
  );

  process.exit(1);
}

mongoose
  .connect(mongoURI)

  .then(async () => {
    console.log("✅ Connected to MongoDB");

    console.log(
      "DATABASE:",
      mongoose.connection.db.databaseName
    );

    console.log(
      "HOST:",
      mongoose.connection.host
    );

    // Check events
    const eventCount =
      await mongoose.connection.db
        .collection("events")
        .countDocuments();

    console.log(
      "🔥 EVENT COUNT:",
      eventCount
    );

    // ===============================
    // START SERVER
    // ===============================

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(
        `🚀 Eventora server running on port ${PORT}`
      );
    });
  })

  .catch((error) => {
    console.error(
      "❌ Error connecting to MongoDB:",
      error
    );

    process.exit(1);
  });