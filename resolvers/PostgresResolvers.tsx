import { RequestOptions, ReviewStatusEnum, ProviderProfile } from '@root/common/types';
import { convertNestedObjectKeysToCamelCase, convertObjectKeysToCamelCase, toDateISOString } from '@root/common/utilities';

export async function fetchPostgresExisitingUserRecord({ sitekey, userId }) {
  const fetchUrl = `https://api-nova.onrender.com/api/users?userId=${userId}`;
  const reqOptions: RequestOptions = {
    headers: {
      'X-API-KEY': `${sitekey}`,
    },
  };

  try {
    const response = await fetch(fetchUrl, reqOptions);
    if (!response.ok) throw new Error('Network response was not ok.');
    const data = await response.json();

    return data;
  } catch (error) {
    console.log({ error }, 'error fetching data');
    return null;
  }
}

export async function fetchPostgresExisitingUserDocuments({ sitekey, documentType, userId }) {
  const fetchUrl = `https://api-nova.onrender.com/api/documents?userId=${userId}&type=${encodeURIComponent(documentType)}`;

  const reqOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': `${sitekey}`,
    },
  };

  try {
    const response = await fetch(fetchUrl, reqOptions);
    if (!response.ok) throw new Error('Network response was not ok.');

    const data = await response.json();

    return data;
  } catch (error) {
    console.log({ error }, 'error fetching data');
    return null;
  }
}

export async function fetchPostgresAllProvidersDocuments({ sitekey, documentType }) {
  const fetchUrl = `https://api-nova.onrender.com/api/documents`;

  const reqOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': `${sitekey}`,
    },
  };

  try {
    const response = await fetch(fetchUrl, reqOptions);
    if (!response.ok) throw new Error('Network response was not ok.');

    const data = await response.json();

    const filteredData = await data?.data.filter((document) => document.data && document.data.audit_document && document.data.audit_document.type === documentType);
    return filteredData;
  } catch (error) {
    console.log({ error }, 'error fetching data');
    return null;
  }
}

interface ApiResponse {
  success: boolean;
  result?: any;
  error?: string;
}

export async function createPostgresUserEVPDocument({ sitekey, userId, audit_document }): Promise<ApiResponse> {
  const apiUrl = `https://api-nova.onrender.com/api/documents/create`;

  try {
    const bodyData = {
      id: userId,
      type: audit_document.type,
      audit_document,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': sitekey,
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, result: data };
    } else {
      console.log(`Error creating a new audit: ${response.status}`);
      return { success: false, error: data.message || 'An error occurred' };
    }
  } catch (error) {
    console.error('Error creating/updating audit:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
}

export async function updatePostgresUserAuditDocument({ sitekey, userId, audit_document }) {
  const apiUrl = `https://api-nova.onrender.com/api/documents/create`;

  try {
    const bodyData = {
      id: userId,
      updates: { audit_document },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': sitekey,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
  } catch (error) {
    console.error('Error creating/updating audit:', error);
  }
}

export const updateProfileDataPostgres = async ({ userId, sitekey, profile }) => {
  const fetchUrl = `https://api-nova.onrender.com/api/users/update`;

  try {
    const bodyData = {
      id: userId,
      updates: { profile },
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sitekey,
      },
      body: JSON.stringify(bodyData),
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

export default function formatEVPReportDocument(evp_report, documentId): any {
  // Convert keys from database to camelCase
  let formattedObject: any = convertObjectKeysToCamelCase(evp_report);

  // Format the dates
  if (formattedObject.createdAt) {
    formattedObject.createdAt = toDateISOString(formattedObject.createdAt);
  }
  if (formattedObject.updatedAt) {
    formattedObject.updatedAt = toDateISOString(formattedObject.updatedAt);
  }
  if (formattedObject.submittedAt && formattedObject.submittedAt !== null) {
    formattedObject.submittedAt = toDateISOString(formattedObject.submittedAt);
  }

  // Truncate and include the document ID in the formatted object
  formattedObject.documentId = documentId ? documentId : null;
  formattedObject.documentIdShort = documentId ? documentId.substring(0, 4) + '...' : null;

  return formattedObject;
}

export async function fetchPostgresDocumentById(sessionKey, id) {
  const fetchUrl = `https://api-nova.onrender.com/api/documents/${id}`;

  const reqOptions = {
    method: 'GET',
    headers: {
      'X-API-KEY': sessionKey,
    },
  };

  try {
    const response = await fetch(fetchUrl, reqOptions);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.data;
  } catch (error) {
    console.error('Error fetching document data:', error);
    return null;
  }
}

export function filterPostgresMessagesByFormType({ allMessages, formType }) {
  return allMessages?.filter((message) => message?.form_type === formType) || [];
}

export const updateWaterConsumptionFormPostgres = async ({ waterConsumption, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        water_consumption: {
          ...currentDocument.audit_document.evp_report.water_consumption,
          ...waterConsumption,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export const updateElectricityConsumptionFormPostgres = async ({ electricityConsumption, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        electricity_consumption: {
          ...currentDocument.audit_document.evp_report.electricity_consumption,
          ...electricityConsumption,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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
export const updateRenewableEnergyProcurementFormPostgres = async ({ renewableEnergyProcurement, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        renewable_energy_procurement: {
          ...currentDocument.audit_document.evp_report.renewable_energy_procurement,
          ...renewableEnergyProcurement,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export const updateEnergyProductionFormPostgres = async ({ energyProduction, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        energy_production: {
          ...currentDocument.audit_document.evp_report.energy_production,
          ...energyProduction,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export const updatePreliminaryResultsPostgres = async ({ preliminaryResults, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        preliminary_results_rec_matching: {
          ...currentDocument.audit_document.evp_report.preliminary_results_rec_matching,
          ...preliminaryResults,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export const updateLocationFormPostgres = async ({ locationInformation, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        location_information: {
          ...currentDocument.audit_document.evp_report.location_information,
          ...locationInformation,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export const updateHardwareFormPostgres = async ({ hardwareConfiguration, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        hardware_configuration: {
          ...currentDocument.audit_document.evp_report.location_information,
          ...hardwareConfiguration,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export const updateAuditOutputsFormPostgres = async ({ auditOutputs, documentId, sessionKey }) => {
  if (typeof auditOutputs !== 'object' || auditOutputs === null) {
    console.error('Expected an object for auditOutputs, received:', auditOutputs);
    return null;
  }

  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  // Retrieve existing audit outputs or initialize as an empty array if not present
  // const existingAuditOutputs = documentData.audit_document?.evp_report?.audit_review?.audit_outputs || [];

  // Add the new auditOutputs object to the array of existing audit outputs
  const updatedAuditOutputs = auditOutputs;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        audit_review: {
          ...currentDocument.audit_document.evp_report.audit_review,
          audit_outputs: updatedAuditOutputs,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export const updateGreenscoreFormPostgres = async ({ greenscore, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        audit_review: {
          ...currentDocument.audit_document.evp_report.audit_review,
          greenscore: [...(currentDocument.audit_document.evp_report.audit_review.greenscore || []), ...greenscore],

          review_status: ReviewStatusEnum.COMPLETE,
        },
      },
    },
    greenscore: [...(currentDocument.greenscore || []), ...greenscore],
  };
  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export function formatReportsToAuditDataFromPostgres(allDocuments) {
  if (!allDocuments) return null;

  return allDocuments?.map((report, index) => {
    const { auditStatus } = report;
    const evpReport = report.data.audit_document.evp_report;
    const evpReportFormatted: any = convertObjectKeysToCamelCase(evpReport);

    return {
      auditNumber: index + 1,
      auditId: report.id,
      auditStatus: auditStatus,
      hardwareConfigurationFormStatus: evpReportFormatted?.hardwareConfiguration?.status || ReviewStatusEnum.NOT_SUBMITTED,
      electricityFormStatus: evpReportFormatted?.electricityConsumption?.status || ReviewStatusEnum.NOT_SUBMITTED,
      energyProcuredFormStatus: evpReportFormatted?.renewableEnergyProcurement?.status || ReviewStatusEnum.NOT_SUBMITTED,
      energyProducedFormStatus: evpReportFormatted?.energyProduction?.status || ReviewStatusEnum.NOT_SUBMITTED,
      waterConsumptionFormStatus: evpReportFormatted?.waterConsumption?.status || ReviewStatusEnum.NOT_SUBMITTED,
      locationInformationFormStatus: evpReportFormatted?.locationInformation?.status || ReviewStatusEnum.NOT_SUBMITTED,
      preliminaryResultsFormStatus: evpReportFormatted?.preliminaryResultsRecMatching?.status || ReviewStatusEnum.NOT_SUBMITTED,
      auditReview: evpReportFormatted?.auditReview?.provider_evp_status || ReviewStatusEnum.NOT_SUBMITTED,
    };
  });
}

export const updateEnergyProcuredFormPostgres = async ({ energyProcured, documentId, sessionKey }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        renewable_energy_procurement: {
          ...currentDocument.audit_document.evp_report.renewable_energy_procurement,
          ...energyProcured,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export function formatGreenscoresFromPostgres({ greenscore }) {
  if (!Array.isArray(greenscore)) {
    return [];
  }

  const greenscoresFormatted = greenscore.map((item) => ({
    ...item,
    greenscore: convertNestedObjectKeysToCamelCase(item.greenscore),
  }));

  return greenscoresFormatted;
}

export function formatAuditOutputs(auditOutputsArray) {
  if (!Array.isArray(auditOutputsArray)) {
    console.error('Expected an array for auditOutputs, received:', auditOutputsArray);
    return [];
  }

  const auditOutputsFormatted = auditOutputsArray.map((item) => ({
    ...item,
    auditOutputs: convertNestedObjectKeysToCamelCase(item.auditOutputs),
  }));

  return auditOutputsFormatted;
}

export const updateAuditReviewPostgres = async ({ sessionKey, documentId, auditReview }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        audit_review: {
          ...currentDocument.audit_document.evp_report.audit_review,
          ...auditReview,
        },
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export const updateEVPreportProcessPostgres = async ({ sessionKey, documentId, reportPeriod }) => {
  const documentData = await fetchPostgresDocumentById(sessionKey, documentId);
  const currentDocument = documentData;

  const fetchUrl = `https://api-nova.onrender.com/api/documents/update`;

  const updatedDocument = {
    ...currentDocument,
    audit_document: {
      ...currentDocument.audit_document,
      evp_report: {
        ...currentDocument.audit_document.evp_report,
        ...reportPeriod,
      },
    },
  };

  try {
    const bodyData = {
      id: documentId,
      updates: updatedDocument,
    };

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sessionKey,
      },
      body: JSON.stringify(bodyData),
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

export async function fetchPostgresAllMessages({ documentId, sessionKey }) {
  //get messages from posts
  let allMessages = null;

  try {
    const response = await fetch('https://api-nova.onrender.com/api/posts', {
      method: 'POST',
      headers: { 'X-API-KEY': sessionKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_id: documentId,
        type: 'GENERAL',
      }),
    });
    const result = await response.json();

    if (result && result.data) {
      allMessages = result.data;
    }
  } catch (e) {
    console.log(e, 'error');
  }
}

async function fetchMessagesForDocumentResolver(documentId, sessionKey) {
  try {
    const response = await fetch('https://api-nova.onrender.com/api/posts', {
      method: 'POST',
      headers: { 'X-API-KEY': sessionKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_id: documentId,
        type: 'GENERAL',
      }),
    });
    const result = await response.json();
    if (result && result.data) {
      return result.data;
    }
  } catch (e) {
    console.error('Error fetching messages for document ID:', documentId, e);
  }
  return [];
}

export async function createDocumentMessageMapResolver(allDocuments, sessionKey) {
  if (!allDocuments) return null;
  const documentMessageMap = {};

  // Initialize the map with document IDs
  allDocuments?.forEach((doc) => {
    documentMessageMap[doc.id] = {
      totalMessages: 0,
      mostRecentDate: null,
    };
  });

  // Fetch messages for each document ID and populate the map
  for (const doc of allDocuments) {
    const messages = await fetchMessagesForDocumentResolver(doc.id, sessionKey);

    messages?.forEach((message) => {
      const { document_id, updated_at } = message;

      if (documentMessageMap[document_id]) {
        documentMessageMap[document_id].totalMessages += 1;

        const messageDate = new Date(updated_at);
        const currentMostRecentDate = new Date(documentMessageMap[document_id].mostRecentDate);

        if (!documentMessageMap[document_id].mostRecentDate || messageDate > currentMostRecentDate) {
          documentMessageMap[document_id].mostRecentDate = toDateISOString(updated_at);
        }
      }
    });
  }

  return documentMessageMap;
}

export async function fetchEmissionFactors() {
  const fetchUrl = `https://api-nova.onrender.com/api/emission-factors`;
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch emission factors:', error);
    return [];
  }
}

export async function getEmissionFactorsByCountry(countryName) {
  const DEFAULT_EMISSIONS_FACTOR = 436;

  if (!countryName) return null;

  const response = await fetchEmissionFactors();
  const emissionFactors = response.emissionFactors;

  if (!Array.isArray(emissionFactors)) {
    console.error('Emission factors is not an array:', emissionFactors);
    return null;
  }

  const countryData = emissionFactors.find((country) => country.country && country.country.trim().toLowerCase() === countryName.trim().toLowerCase());

  if (!countryData) {
    console.error(`No emission data found for ${countryName}`);
    return DEFAULT_EMISSIONS_FACTOR;
  }

  if (countryData.iea_2021) {
    return countryData.iea_2021;
  } else if (countryData.iea_2020) {
    return countryData.iea_2020;
  } else {
    return DEFAULT_EMISSIONS_FACTOR;
  }
}

export async function getMarginalEmissionsFactorByCountry(countryName) {
  const DEFAULT_MARGINAL_EMISSIONS_FACTOR = 614.38;

  if (!countryName) return null;

  const response = await fetchEmissionFactors();
  const emissionFactors = response.emissionFactors;

  if (!Array.isArray(emissionFactors)) {
    console.error('Emission factors is not an array:', emissionFactors);
    return null;
  }

  const countryData = emissionFactors.find((country) => country.country && country.country.trim().toLowerCase() === countryName.trim().toLowerCase());

  if (!countryData) {
    console.error(`No emission data found for ${countryName}`);
    return DEFAULT_MARGINAL_EMISSIONS_FACTOR;
  }

  if (countryData.world_marginal_emissions) {
    return countryData.world_marginal_emissions;
  } else if (countryData.marginal_emissions_2020) {
    return countryData.marginal_emissions_2020;
  } else {
    return DEFAULT_MARGINAL_EMISSIONS_FACTOR;
  }
}

export async function getEntityCompanyByUserId(userId, sessionKey) {
  try {
    const response = await fetch(`https://api-nova.onrender.com/api/users?userId=${userId}`, {
      headers: { 'X-API-KEY': sessionKey },
    });
    const result = await response.json();

    if (result?.data?.profile?.entity_company) {
      return result.data.profile.entity_company;
    } else {
      return 'N/A'; // Ensuring a default value is returned if not present
    }
  } catch (e) {
    console.error('Failed to fetch or process user profile:', e);
    return 'N/A'; // Return 'N/A' on error to ensure all paths return a serializable value
  }
}
