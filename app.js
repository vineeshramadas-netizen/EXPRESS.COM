const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// Resolve base directory for serverless (Netlify) and local
const runtimeBaseDir = process.env.LAMBDA_TASK_ROOT || __dirname;

// View engine and static assets
app.set('view engine', 'ejs');
app.set('views', path.join(runtimeBaseDir, 'views'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(runtimeBaseDir, 'public')));

// In-memory booking storage for demo purposes
const bookings = [];

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/book', (req, res) => {
  const { name, email, phone, checkIn, checkOut, guests, roomType } = req.body;

  const parsedCheckIn = checkIn ? new Date(checkIn) : null;
  const parsedCheckOut = checkOut ? new Date(checkOut) : null;
  const parsedGuests = guests ? Number(guests) : 1;

  if (!name || !email || !parsedCheckIn || !parsedCheckOut) {
    return res.status(400).render('index', { error: 'Please fill out all required fields.' });
  }

  if (Number.isNaN(parsedGuests) || parsedGuests < 1) {
    return res.status(400).render('index', { error: 'Guests must be a positive number.' });
  }

  if (parsedCheckOut <= parsedCheckIn) {
    return res.status(400).render('index', { error: 'Check-out date must be after check-in date.' });
  }

  const booking = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    name,
    email,
    phone: phone || '',
    checkIn: parsedCheckIn,
    checkOut: parsedCheckOut,
    guests: parsedGuests,
    roomType: roomType || 'Standard',
    createdAt: new Date(),
  };

  bookings.push(booking);
  res.redirect(`/success?name=${encodeURIComponent(name)}`);
});

app.get('/success', (req, res) => {
  const { name } = req.query;
  res.render('success', { name: name || 'Guest' });
});

app.get('/bookings', (req, res) => {
  const sorted = [...bookings].sort((a, b) => b.createdAt - a.createdAt);
  res.render('bookings', { bookings: sorted });
});

module.exports = app;
