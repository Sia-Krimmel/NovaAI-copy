import * as S from 'common/server';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export default async function apiAirtableContactUs(req, res) {
  await S.cors(req, res);

  const body = { fields: { email: req.body.email } };

  try {
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID_WAITLIST}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const airtableResult = await response.json();

    res.status(200).json({ message: 'Response OK!' });
  } catch (e) {
    console.log(e, 'error in the api');
    res.status(500).json({ error: 'Error processing request, check the credentials' });
  }
}
