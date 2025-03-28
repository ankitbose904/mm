const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://mm-five-murex.vercel.app/"],
    methods: ["GET", "POST"],
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));


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


app.post("/api/onboard", async (req, res) => {
    try {
        const { name, fatherName, email, address, dob, occupation, gender } = req.body;

        // Validate email
        if (!email) return res.status(400).json({ error: "Email is required" });

        const emailLower = email.toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: emailLower });
        if (existingUser) return res.status(400).json({ error: "User already onboarded" });

        // Validate required fields
        if (!name || !fatherName || !address || !dob || !occupation || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }


        const newUser = new User({ name, fatherName, email: emailLower, address, dob, occupation, gender });
        await newUser.save();

        res.status(201).json({ message: "User onboarded successfully" });
    } catch (error) {
        console.error("Error onboarding user:", error);

        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
