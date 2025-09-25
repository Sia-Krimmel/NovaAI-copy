import * as S from 'common/server';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

function createProfileRequestBody(reqBody) {
  return {
    fields: {
      fld6CYpuahmZGu5EV: reqBody.body.userId,
      fldGsVqMvZYgcP7hA: reqBody.body.email,
      fldGgurRZtvW0s0cn: reqBody.body.name,
      fldDUp0YxiX7mq4Yp: reqBody.body.streetAddress,
      fldzjmkJ7d4Q4lFGK: reqBody.body.city,
      fldql3T4K7nqepPzV: reqBody.body.country,
      fldzwY6gy5Dwo1CUH: reqBody.body.zipCode,
      fldZDfSvBcr4aiGDN: reqBody.body.state,
      fldCSdXHnxljXcJPA: reqBody.body.spLocation,
      fldsfbJSWfGmlgwtg: reqBody.body.spZipCode,
    },
  };
}
export default async function apiProviderProfile(req, res) {
  await S.cors(req, res);

  // Check the HTTP method
  if (req.method === 'GET') {
    const userId = req.query.userId;

    if (!userId) {
      res.status(400).json({ error: 'Missing userId query parameter' });
      return;
    }

    const filterFormula = encodeURIComponent(`{User ID} = '${userId}'`);
    const fetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.STORAGE_PROVIDER_TABLE_ID}?filterByFormula=${filterFormula}`;

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
      console.error(e, 'error in the API');
      res.status(500).json({ error: 'Error processing request, check the credentials or fields' });
    }
  } else if (req.method === 'POST') {
    const reqBody = createProfileRequestBody(req);

    try {
      const postResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.STORAGE_PROVIDER_TABLE_ID}`, {
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

      const postData = await postResponse.json();
      res.status(200).json(postData);
    } catch (e) {
      console.error(e, 'error in the API during POST');
      res.status(500).json({ error: 'Error processing request, check the credentials or fields' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
