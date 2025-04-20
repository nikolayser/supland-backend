import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

const { TG_BOT_TOKEN, TG_CHAT_ID } = process.env;

app.use(express.json());
app.use(cors());

app.post('/feedback', async (req, res) => {
  const { name, phone, comment } = req.body;

  const text = `
    Новое сообщение с сайта:

    Имя: ${name}
    Телефон: ${phone}
    Сообщение: ${comment}
  `;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: 'Failed to send comment' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
