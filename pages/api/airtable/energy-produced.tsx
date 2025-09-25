import * as S from 'common/server';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

function energyProducedFormRequestBody(reqBody) {
  return {
    fields: {
      fldESCBeCVunhREfU: reqBody.body.userId,
      fldK9oLePPOATF8BY: reqBody.body.selectFilecoinRenewableEnergyUsage,
      fld0zef6LuRdmqvBv: reqBody.body.installationDate,
      fldEXCpZLE4UcA3Ra: reqBody.body.inspectionDate,
      fldgVU1yCYlDg0avn: reqBody.body.solarWattPeak,
      fldpTbhHQTzAo8L9k: reqBody.body.numberOfSolarPanels,
      fldb9AXrVDEC1TBkp: reqBody.body.solarPanelBrand,
      fld8ujBZzK8EBVsm5: reqBody.body.solarPanelModalNumber,
      fldOaap51e3IVJSCw: reqBody.body.methodOfMesurement,
      fldgD2k5IpzhsctIr: reqBody.body.frequencyOfMesurement,
      fldfyyoER3LkyhNZj: reqBody.body.inspectionDocument,
      fldFG0WbvT7GwZ3yr: reqBody.body.purchaseReceipt,
    },
  };
}

export default async function apiAirtableEnergyProduced(req, res) {
  await S.cors(req, res);

  if (req.method === 'GET') {
    const userId = req.query.userId;
    if (!userId) {
      res.status(400).json({ error: 'Missing parameter' });
      return;
    }

    const filterFormula = encodeURIComponent(`{User ID} = '${userId}'`);
    const fetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_ENERGY_PRODUCED_TABLE_ID}?filterByFormula=${filterFormula}`;

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
      const reqBody = energyProducedFormRequestBody(req);
      const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_ENERGY_PRODUCED_TABLE_ID}`, {
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
