import express from 'express';
import YouVersion from "@glowstudent/youversion";

const app = express();

// Get Verse of the Day
app.get('/verse-of-the-day', async (req, res) => {
  const { lang } = req.query; // Optional language parameter
  try {
    const verse = await YouVersion.getVerseOfTheDay(lang);
    res.status(200).json(verse);
  } catch (error) {
    console.error('Error fetching verse of the day:', error);
    res.status(500).json({ message: 'Error fetching verse of the day' });
  }
});

// Get any verse
app.get('/verse', async (req, res) => {
  const { book, chapter, verse, translation} = req.query;
  if (!book) {
    return res.status(400).json({ code: 400, message: "Missing field 'book'" });
  }
  try {
    const verseData = await YouVersion.getVerse(book, chapter, verse, translation);
    res.status(200).json(verseData);
  } catch (error) {
    console.error('Error fetching verse:', error);
    res.status(400).json({ code: 400, message: error.message });
  }
});

export default app; 