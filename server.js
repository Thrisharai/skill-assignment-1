const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let events = [
  { id: 1, name: 'Hackathon 2025', date: '2025-11-20', venue: 'Auditorium', availableSeats: 100 },
  { id: 2, name: 'Tech Talk AI', date: '2025-12-05', venue: 'Seminar Hall', availableSeats: 80 }
];

let bookings = [
  { id: 1, eventId: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, eventId: 2, name: 'Bob', email: 'bob@example.com' }
];

// -------- EVENT ROUTES --------
app.get('/events', (req, res) => res.json(events));

app.post('/events/add', (req, res) => {
  const { name, date, venue, availableSeats } = req.body;
  const newEvent = { id: events.length + 1, name, date, venue, availableSeats };
  events.push(newEvent);
  res.status(201).json({ message: 'Event added successfully', event: newEvent });
});

app.get('/event/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

app.put('/event/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const { name, date, venue, availableSeats } = req.body;
  if (name) event.name = name;
  if (date) event.date = date;
  if (venue) event.venue = venue;
  if (availableSeats) event.availableSeats = availableSeats;
  res.json({ message: 'Event updated', event });
});

app.delete('/event/:id', (req, res) => {
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Event not found' });
  const deleted = events.splice(index, 1);
  res.json({ message: 'Event deleted', deleted });
});

// -------- BOOKING ROUTES --------
app.get('/api/bookings', (req, res) => res.json(bookings));

app.post('/api/bookings', (req, res) => {
  const { eventId, name, email } = req.body;
  const event = events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });
  const newBooking = { id: bookings.length + 1, eventId, name, email };
  bookings.push(newBooking);
  event.availableSeats--;
  res.status(201).json({ message: 'Booking successful', booking: newBooking });
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

app.put('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  const { name, email } = req.body;
  if (name) booking.name = name;
  if (email) booking.email = email;
  res.json({ message: 'Booking updated', booking });
});

app.delete('/api/bookings/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Booking not found' });
  const [cancelled] = bookings.splice(index, 1);
  const event = events.find(e => e.id === cancelled.eventId);
  if (event) event.availableSeats++;
  res.json({ message: 'Booking cancelled', cancelled });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
