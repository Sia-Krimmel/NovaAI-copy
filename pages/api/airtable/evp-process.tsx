import * as S from 'common/server';
import { EVPStatuses } from '@root/common/types';

export default async function apiConsolidatedStatus(req, res) {
  await S.cors(req, res);

  const userId = req.query.userId;
  if (!userId) {
    res.status(400).json({ error: 'Missing userId query parameter' });
    return;
  }

  const filterFormula = encodeURIComponent(`{User ID} = '${userId}'`);
  const headers = {
    Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    // Fetch Water Consumption Status
    const waterFetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_WATER_CONSUMPTION_TABLE_ID}?filterByFormula=${filterFormula}`;
    const waterResponse = await fetch(waterFetchUrl, { headers });
    const waterData = await waterResponse.json();
    const waterStatus = waterData.records.length > 0 ? waterData.records[0].fields.Status : 'Not Submitted';

    // Fetch Electricity Consumption Status
    const electricityFetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_ELECTRICITY_CONSUMPTION_TABLE_ID}?filterByFormula=${filterFormula}`;
    const electricityResponse = await fetch(electricityFetchUrl, { headers });
    const electricityData = await electricityResponse.json();
    const electricityStatus = electricityData.records.length > 0 ? electricityData.records[0].fields.Status : 'Not Submitted';

    // Fetch Energy Procured Form Status
    const energyProcuredFetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_ENERGY_PROCURED_TABLE_ID}?filterByFormula=${filterFormula}`;
    const energyProcuredResponse = await fetch(energyProcuredFetchUrl, { headers });
    const energyProcuredData = await energyProcuredResponse.json();
    const energyProcuredStatus = energyProcuredData.records.length > 0 ? energyProcuredData.records[0].fields.Status : 'Not Submitted';

    // Fetch  Energy Produced Form Status
    const energyProducedFetchUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_ENERGY_PRODUCED_TABLE_ID}?filterByFormula=${filterFormula}`;
    const energyProducedResponse = await fetch(energyProducedFetchUrl, { headers });
    const energyProducedData = await energyProducedResponse.json();
    const energyProducedStatus = energyProducedData.records.length > 0 ? energyProducedData.records[0].fields.Status : 'Not Submitted';

    const records: any = {
      waterConsumptionForm: waterStatus,
      electricityConsumptionForm: electricityStatus,
      energyProcuredForm: energyProcuredStatus,
      energyProducedForm: energyProducedStatus,
    };

    res.status(200).json({
      records: records,
    });
  } catch (e) {
    console.error(e, 'error in the API');
    res.status(500).json({ error: 'Error processing request, check the credentials or fields' });
  }
}
