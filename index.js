import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import chatRoutes from './routes/chat.js';
import bibleApi from './bibleApi.js'; // Import the bible API

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'https://niiboimancentral.vercel.app',
    'https://niiboiman.netlify.app'
  ],
  credentials: true,
};

app.use(cors(corsOptions)); 
app.use(express.json());

// Initialize Firebase Admin
try {
  const firebaseAdmin = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Firebase backend API!');
});

// Auth routes
app.post('/api/auth/config', async (req, res) => {
  try {
    const config = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };
    res.json({ config });
  } catch (error) {
    console.error('Error sending Firebase config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Chat routes
app.use('/chat', chatRoutes);

// Use the bible API routes
app.use('/api', bibleApi);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 