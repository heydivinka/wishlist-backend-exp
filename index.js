// @ts-check
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import addWishlistHandler from './api/add-to-wishlist.js';
import getWishlistHandler from './api/get-wishlist.js';
import removeWishlistHandler from './api/remove-from-wishlist.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Info di Root Path /
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Wishlist Backend Server is running. Ready for Postman testing!',
    endpoints: {
      add_wishlist: `POST http://localhost:${PORT}/api/add-to-wishlist`,
      get_wishlist: `GET http://localhost:${PORT}/api/get-wishlist?user_identifier=USER_ID`,
      remove_wishlist: `POST http://localhost:${PORT}/api/remove-from-wishlist`
    }
  });
});

// Route Handlers (Mendukung Vercel Serverless convention)
app.all('/api/add-to-wishlist', addWishlistHandler);
app.all('/api/add-wishlist', addWishlistHandler); // Alias
app.all('/api/get-wishlist', getWishlistHandler);
app.all('/api/remove-from-wishlist', removeWishlistHandler);

// Route Alias Singkat
app.all('/wishlist/add', addWishlistHandler);
app.all('/wishlist/remove', removeWishlistHandler);
app.all('/wishlist', getWishlistHandler);

// Global Error Handler (tangkap error bodyParser/malformed JSON tanpa crash)
// @ts-ignore
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: 'Bad Request', details: err.message || 'Invalid JSON or Request Body' });
  }
  next();
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan', path: req.path });
});

app.listen(PORT, () => {
  console.log(`🚀 Wishlist Backend Server jalan di http://localhost:${PORT}`);
});