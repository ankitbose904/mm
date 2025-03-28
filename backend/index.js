const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Rate Limiting (Prevents DDoS Attacks)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Dynamic CORS Configuration
const allowedOrigins = ["http://localhost:3000", "https://mm-five-murex.vercel.app"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST"],
    credentials: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    fatherName: String,
    email: { type: String, unique: true, lowercase: true },
    address: String,
    dob: String,
    occupation: String,
    gender: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// Fetch ID Card API
app.get("/api/idcard", async (req, res) => {
    try {
        const email = req.query.email?.toLowerCase();
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Onboard User API
app.post("/api/onboard", async (req, res) => {
    try {
        const { name, fatherName, email, address, dob, occupation, gender } = req.body;
        if (!email || !name || !fatherName || !address || !dob || !occupation || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailLower = email.toLowerCase();
        const existingUser = await User.findOne({ email: emailLower });
        if (existingUser) return res.status(400).json({ error: "User already onboarded" });

        const newUser = new User({ name, fatherName, email: emailLower, address, dob, occupation, gender });
        await newUser.save();

        res.status(201).json({ message: "User onboarded successfully" });
    } catch (error) {
        console.error("Error onboarding user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
