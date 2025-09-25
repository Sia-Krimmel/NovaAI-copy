import * as S from 'common/server';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

function waterConsumptionFormRequestBody(reqBody) {
  return {
    fields: {
      fld0NoTJCm7NrXT79: reqBody.body.userId,
      fldFyTgMDLzh32HFw: reqBody.body.waterCompany,
      fldaCZ4tO5kEJgVNP: reqBody.body.startDate,
      fldaUHEgXBUyfk15c: reqBody.body.endDate,
      fldW6DsvROT8bYo6v: reqBody.body.reference,
      fldxYp6esE20LeSVJ: reqBody.body.selectFilecoinWaterUsage,
    },
  };
}
// fldOQum9VnJjh19so: reqBody.body.waterBillFiles,

export default async function apiAirtableWaterConsumption(req, res) {
  await S.cors(req, res);

  // Check the HTTP method
  if (req.method === 'GET') {
    const userId = req.query.userId;

    if (!userId) {
      res.status(400).json({ error: 'Missing parameter' });
      return;
    }

    const filterFormula = encodeURIComponent(`{User ID} = '${userId}'`);
    const fetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_WATER_CONSUMPTION_TABLE_ID}?filterByFormula=${filterFormula}`;

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
    const reqBody = waterConsumptionFormRequestBody(req);

    try {
      const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_WATER_CONSUMPTION_TABLE_ID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const airtableResult = await response.json();
      res.status(200).json({ message: 'Response OK!', airtableResult });
    } catch (e) {
      console.log(e, 'error in the api');
      res.status(500).json({ error: 'Error processing request, check the credentials or fields' });
    }
  }
}
