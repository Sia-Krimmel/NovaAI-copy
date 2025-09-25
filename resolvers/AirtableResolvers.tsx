import { AuditorRegistrationForm } from '@root/pages/sections/AuditorRegistrationSection';

export const fetchExistingAirtableRecord = async ({ userId, endpointName, view, host }: any) => {
  const fetchUrl = `http://${host}/api/airtable/${endpointName}?userId=${userId}&view=${view}`;

  try {
    const response = await fetch(fetchUrl);
    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error('Error fetching record:', error);
    return null;
  }
};

export const postProfileDataToAirtable = async ({ endpointName, userId, data, view, host }) => {
  const fetchUrl = `http://${host}/api/airtable/${endpointName}?userId=${userId}&view=${view}`;

  try {
    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log('success');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error posting record:', error);
    return null;
  }
};

export function formatAirtableProfileData(record) {
  return {
    city: record.fields['City'],
    country: record.fields['Country'],
    email: record.fields['Email Address'],
    name: record.fields['Storage Provider Name'],
    spLocation: record.fields['Storage Provider Location ID'],
    spZipCode: record.fields['Storage Provider Zip Code'],
    state: record.fields['State'],
    streetAddress: record.fields['Street Address'],
    userId: record.fields['User ID'],
    zipCode: record.fields['Zip Code / Postal Code'],
    creationDate: record.fields['Creation Date'],
    emailConsent: record.fields['receive_emails'],
  };
}

export enum WaterConsumptionFormFields {
  userId = 'fld0NoTJCm7NrXT79',
  waterCompany = 'fldFyTgMDLzh32HFw',
  startDate = 'fldaCZ4tO5kEJgVNP',
  endDate = 'fldaUHEgXBUyfk15c',
  reference = 'fldW6DsvROT8bYo6v',
  selectFilecoinWaterUsage = 'fldxYp6esE20LeSVJ',
}

export function formatAirtableWaterConsumptionData(record): any {
  //ADD: waterBillFiles

  return {
    userId: record.fields['User ID'],
    waterCompany: record.fields['Water Company'],
    startDate: record.fields['Water Consumption Start Date'],
    endDate: record.fields['Water Consumption End Date'],
    reference: record.fields['Reference / Bill ID'],
    selectFilecoinWaterUsage: record.fields['Is water used to cool Filecoin IT Infrastructure?'],
    status: record.fields['Status'],
    creationDate: record.fields['Creation Date'],
  };
}

export function formatAirtableEnergyProducedData(record): any {
  return {
    userId: record.fields['User ID'],
    selectFilecoinRenewableEnergyUsage: record.fields['Do you generate renewable energy to power Storage Provider Operations?'],
    installationDate: record.fields['Renewable Energy Installation Date'],
    solarWattPeak: record.fields['Total Solar Watt Peak (kWp)'],
    numberOfSolarPanels: record.fields['Number (#) of Solar Panels'],
    solarPanelBrand: record.fields['Solar Panel Brand'],
    solarPanelModalNumber: record.fields['Solar Panel Model Number'],
    methodOfMesurement: record.fields['Method of Measurement'],
    frequencyOfMesurement: record.fields['Frequency of Measurement'],
    inspectionDate: record.fields['Renewable Energy Inspection Date'],
    inspectionDocument: record.fields['Inspection documentation / Certificates'],
    purchaseReceipt: record.fields['Solar Panel Purchase Receipts / Documentations'],
    status: record.fields['Status'],
    creationDate: record.fields['Creation Date'],
  };
}

export function formatAirtableEnergyProcuredData(record): any {
  return {
    userId: record.fields['User ID'],
    energyProcuredStartDate: record.fields['Energy Procured Start Date'],
    energyProcuredEndDate: record.fields['Energy Procured End Date'],
    renewableEnergyType: record.fields['Renewable Energy Type'],
    renewableEnergyPurchasedFrom: record.fields['Purchased From'],
    selectFilecoinEnergyUsage: record.fields['Is Renewable Energy purchased & used to power the Filecoin network?'],
    supportingFile: record.fields['Supporting documentation'],
    status: record.fields['Status'],
  };
}

export function formatAirtableElectricityConsumptionData(record): any {
  return {
    userId: record.fields['User ID'],
    electricityCompany: record.fields['Electricity Provider'],
    electricityConsumptionStartDate: record.fields['Electricity Consumption Start Date'],
    electricityConsumptionEndDate: record.fields['Electricity Consumption End Date'],
    reference: record.fields['Reference / Bill ID #'],
    electricityBillFile: record.fields['Upload Your Most Recent Electricity Bill'],
    status: record.fields['Status'],
    annualElectricityUsage: record.fields['Estimated Annual Electricity Use'],
    electricityNotPoweringFilecoin: record.fields['Electricity Not Used to Power Filecoin Network'],
    estimationMethodology: record.fields['Estimation Methodology'],
    actualElectricityReturned: record.fields['Actual Electricity Returned'],
    actualElectricityConsumed: record.fields['Actual Electricity Consumed'],
    actualElectricityDelivered: record.fields['Actual Electricity Delivery'],
    creationDate: record.fields['Creation Date'],
  };
}

export function formatAirtableAuditorData(record): AuditorRegistrationForm {
  return {
    auditingFirm: record.fields['Auditing Firm'],
    auditorName: record.fields['Auditor Name'],
    emailAddress: record.fields['Email Address'],
    streetAddress: record.fields['Street Address'],
    country: record.fields['Country'],
    city: record.fields['City'],
    state: record.fields['State'],
    zip: record.fields['Zip Code'],
  };
}

export function formatAirtableReportsPortalData(record): any {
  return {
    auditor: record.fields['Auditor'],
    auditStatus: record.fields['Audit Details'],
    emailAddress: record.fields['Email Address'],
    energyProcuredFormStatus: record.fields['Energy Procured Form Status'],
    storageProviderZipCode: record.fields['Storage Provider Zip Code'],
    state: record.fields['State'],
    city: record.fields['City'],
    waterConsumptionStatus: record.fields['Water Consumption Status'],
    auditDate: record.fields['Audit Date'],
    storageProviderLocationId: record.fields['Storage Provider Location ID'],
    storageProviderName: record.fields['Storage Provider Name'],
    electricityFormStatus: record.fields['Electricity Form Status'],
    zipCodePostalCode: record.fields['Zip Code / Postal Code'],
    energyProducedFormStatus: record.fields['Energy Produced Form Status'],
    userId: record.fields['User ID'],
    country: record.fields['Country'],
    streetAddress: record.fields['Street Address'],

    //GREEN SCORE CALCULATION
    electricity_consumption_electricity_company: record.fields['Electricity Provider'], //update
    electricity_consumption_start_date: record.fields['Electricity Consumption Start Date'], //update
    electricity_consumption_end_date: record.fields['Electricity Consumption End Date'], //update
    electricity_consumption_reference: record.fields['Reference / Bill ID #'],
    electricity_consumption_electricity_bill_file: record.fields['Upload Your Most Recent Electricity Bill'],
    electricity_consumption_status: record.fields['Status'],
    electricity_consumption_annual_electricity_usage: record.fields['Estimated Annual Electricity Use'],
    electricity_consumption_electricity_not_powering_filecoin: record.fields['Electricity Not Used to Power Filecoin Network'],
    electricity_consumption_estimation_methodology: record.fields['Estimation Methodology'],
    electricity_consumption_actual_electricity_returned: record.fields['Actual Electricity Returned'],
    electricity_consumption_actual_electricity_consumed: record.fields['Actual Electricity Consumed'],
    electricity_consumption_actual_electricity_delivered: record.fields['Actual Electricity Delivery'],

    //Water Consumption
    water_consumption_start_date: record.fields['Water Consumption Start Date'],
    water_consumption_end_date: record.fields['Water Consumption End Date'],
    water_consumption_reference: record.fields['Reference / Bill ID'],
    water_consumption_status: record.fields['Status'],
    water_consumption_water_company: record.fields['Water Company'],
    water_consumption_filecoin_water_usage: record.fields['Is water used to cool Filecoin IT Infrastructure?'],

    //Energy Produced
    energy_produced_filecoin_renewable_energy_usage: record.fields['Do you generate renewable energy to power Storage Provider Operations?'],
    energy_produced_installation_date: record.fields['Renewable Energy Installation Date'],
    energy_produced_solar_watt_peak: record.fields['Total Solar Watt Peak (kWp)'],
    energy_produced_number_of_solar_panels: record.fields['Number (#) of Solar Panels'],
    energy_produced_solar_panel_brand: record.fields['Solar Panel Brand'],
    energy_produced_solar_panel_modal_number: record.fields['Solar Panel Model Number'],
    energy_produced_method_of_mesurement: record.fields['Method of Measurement'],
    energy_produced_frequency_of_mesurement: record.fields['Frequency of Measurement'],
    energy_produced_inspection_date: record.fields['Renewable Energy Inspection Date'],
    energy_produced_inspection_document: record.fields['Inspection documentation / Certificates'],
    energy_produced_solar_panel_purchase_receipt: record.fields['Solar Panel Purchase Receipts / Documentations'],

    //Energy Procured
    energy_procured_renewable_energy_type: record.fields['Renewable Energy Type'],
    energy_procured_renewable_energy_purchased_from: record.fields['Purchased From'],
    energy_procured_filecoin_energy_usage: record.fields['Is Renewable Energy purchased & used to power the Filecoin network?'],
  };
}

export function formatAirtableLocationData(record): any {
  return {
    storageProviderZipCode: record.fields['Storage Provider Zip Code'],
    state: record.fields['State'],
    city: record.fields['City'],
    storageProviderLocationId: record.fields['Storage Provider Location ID'],
    zipCodePostalCode: record.fields['Zip Code / Postal Code'],
    userId: record.fields['User ID'],
    country: record.fields['Country'],
    streetAddress: record.fields['Street Address'],
    creationDate: record.fields['Creation Date'],
  };
}

//Airtable Formating
interface AirtableRecord {
  creationDate: string;
  [key: string]: any;
}

export function filterAirtableRecordByEarliestCreationDate(records: AirtableRecord[]): AirtableRecord | null {
  const filteredRecords = records.filter((record) => record.creationDate);

  //sort all the records by creation date
  const sortedRecords = filteredRecords.sort((a, b) => {
    const dateA = new Date(a.creationDate).getTime();
    const dateB = new Date(b.creationDate).getTime();

    return dateA - dateB;
  });

  return sortedRecords[0] || null;
}
