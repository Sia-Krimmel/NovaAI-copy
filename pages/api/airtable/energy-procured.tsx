import * as S from 'common/server';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

function energyProcuredFormRequestBody(reqBody) {
  return {
    fields: {
      fldFQ1znQSlRhOUvp: reqBody.body.userId,
      fldaXqr8JciGv40bi: reqBody.body.selectFilecoinEnergyUsage,
      fldEyQ3zmTyfVnzE7: reqBody.body.startDate,
      fldE75GEoq9jdCjaN: reqBody.body.endDate,
      fldLTwI9cCYhBaVRu: reqBody.body.renewableEnergyType,
      fldfZ2dNQFFiEFffQ: reqBody.body.renewableEnergyPurchasedFrom,
      fldBp9YvxYZhJZtP6: reqBody.body.supportingFile,
    },
  };
}

export default async function apiAirtableEnergyProcured(req, res) {
  await S.cors(req, res);

  //fld8WSBCIxQ6YBTLF: req.body.renewableEnergyAmount //calculation WIP
  if (req.method === 'GET') {
    const userId = req.query.userId;

    if (!userId) {
      res.status(400).json({ error: 'Missing parameter' });
      return;
    }

    const filterFormula = encodeURIComponent(`{User ID} = '${userId}'`);
    const fetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_ENERGY_PROCURED_TABLE_ID}?filterByFormula=${filterFormula}`;

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
    try {
      const reqBody = energyProcuredFormRequestBody(req);
      const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_ENERGY_PROCURED_TABLE_ID}`, {
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
