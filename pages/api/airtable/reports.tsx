import * as S from 'common/server';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

function ReportsRequestBody(reqBody) {
  return {
    fields: {
      fldmJaXH9w8k4i1Ia: reqBody.body.userId,
      fld1GhE2188bb3Ii8: reqBody.body.email,
      flde0PGxBaZ3y2Oup: reqBody.body.name,
      fldzf8uuC8j5QnVRi: reqBody.body.streetAddress,
      fldMhAkl0nXiR781m: reqBody.body.city,
      fldvOpznJIWqz5ZZO: reqBody.body.country,
      fldgG96dWnOWFsOep: reqBody.body.zipCode,
      fldMAylKVCrDfQbcD: reqBody.body.state,
      fldZiYcIchyZKEW8s: reqBody.body.spLocation,
      fldFmUBnySa3QSHjW: reqBody.body.spZipCode,
      fldrkxqumLt9bNrsh: reqBody.body.dataConsentChecked,
      fldJrYowOlZaXykkt: reqBody.body.emailConsentChecked,
    },
  }; //add node ids, data consent and email consent
}

export default async function apiAirtableReports(req, res) {
  await S.cors(req, res);

  const { userId, view: view } = req.query;

  if (!userId || !view) {
    res.status(400).json({ error: 'Missing userId query parameter' });
    return;
  }

  const filterFormula = encodeURIComponent(`{User ID} = '${userId}'`);

  const fetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tblyc9ubdq1Ig2k9l?filterByFormula=${filterFormula}&view=${encodeURIComponent(view)}`;

  if (req.method === 'GET') {
    const userId = req.query.userId;

    if (!userId) {
      res.status(400).json({ error: 'Missing parameter' });
      return;
    }

    try {
      const getResponse = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!getResponse.ok) {
        throw new Error('Failed to fetch records');
      }

      const getData = await getResponse.json();
      res.status(200).json(getData);
    } catch (e) {
      console.error(e, 'error in the API to get records');
      res.status(500).json({ error: 'Error processing request, check the credentials or fields' });
    }
  } else if (req.method === 'POST') {
    const reqBody = ReportsRequestBody(req);

    try {
      const postResponse = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });

      if (!postResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const getData = await postResponse.json();
      res.status(200).json({ success: true, data: getData });
    } catch (e) {
      console.error(e, 'error in the API');
      res.status(500).json({ error: 'Error processing request, check the credentials or fields' });
    }
  }
}

// try {
//   const getResponse = await fetch(fetchUrl, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!getResponse.ok) {
//     throw new Error('Failed to fetch records');
//   }

//   const getData = await getResponse.json();

//   res.status(200).json(getData);
// }
// catch (e) {
//   console.error(e, 'error in the API');
//   res.status(500).json({ error: 'Error processing request, check the credentials or fields' });
// }
