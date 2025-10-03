# EXPRESS.COM
HOTEL BOOKING APP
# Clone repo
git clone https://github.com/your-username/express.com.git

# Enter folder
cd express.com

# Initialize Node.js project
npm init -y 

# Install dependencies
npm install express mongoose ejs body-parser cors dotenv
npm install --save-dev nodemon
express.com/
│── models/          # Database models
│── routes/          # App routes
│── views/           # EJS templates (frontend)
│── public/          # CSS/JS/static files
│── server.js        # Main app file
│── .env             # Environment variables
│── package.json
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
const bookingRoutes = require("./routes/booking");
app.use("/", bookingRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    roomType: String
});

module.exports = mongoose.model("Booking", bookingSchema);
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Home Page
router.get("/", (req, res) => {
    res.render("index");
});

// Handle Booking
router.post("/book", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.send("✅ Booking Successful!");
    } catch (err) {
        res.status(500).send("❌ Error booking room");
    }
});

module.exports = router;
<!DOCTYPE html>
<html>
<head>
    <title>Express.com - Hotel Booking</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <h1>Welcome to Express.com</h1>
    <form action="/book" method="POST">
        <input type="text" name="name" placeholder="Full Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="text" name="phone" placeholder="Phone" required>
        <input type="date" name="checkIn" required>
        <input type="date" name="checkOut" required>
        <input type="number" name="guests" placeholder="Guests" required>
        <select name="roomType">
            <option>Standard</option>
            <option>Deluxe</option>
            <option>Suite</option>
        </select>
        <button type="submit">Book Now</button>
    </form>
</body>
</html>
git add .
git commit -m "Initial hotel booking app"
git push origin main
node -v
npm -v
git clone https://github.com/YOUR-USERNAME/express.com.git
cd express.com
npm install
node server.js
Server running on http://localhost:5000
MongoDB Connected
git add .
git commit -m "Updated booking app"
git push origin main
npm init -y
{
  "name": "express-com",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.0",
    "ejs": "^3.1.9",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
npm install express mongoose ejs body-parser cors dotenv
git add package.json package-lock.json
git commit -m "Added package.json with dependencies"
git push origin main
express.com/
│── server.js
│── package.json
│── package-lock.json
│── models/
│── routes/
│── views/
│── public/
│── .env   (not uploaded to GitHub, only on Render)
{
  "name": "express-com",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.0",
    "ejs": "^3.1.9",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
git add .
git commit -m "Fix: added package.json and correct structure"
git push origin main
# Enter folder#
PAKAGE .JSON


