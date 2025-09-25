import { ReviewStatusEnum } from '@root/common/types';

export function calculateCompletionFraction(evpReport) {
  // List of forms to check for completion
  const properties = [
    'water_consumption',
    'electricity_consumption',
    'renewable_energy_procurement',
    'energy_production',
    'location_information',
    'preliminary_results_rec_matching',
    'hardware_configuration',
  ];

  let completionCount = 0;

  // Check each property; if it is not empty, increment the completion count
  properties.forEach((property) => {
    if (Object.keys(evpReport[property] || {}).length !== 0) {
      completionCount += 1;
    }
  });

  const completionFraction = `${completionCount}/${properties.length}`;

  return completionFraction;
}

export function changeColorBasedOnCompletion(reportCompletion) {
  const [completed, total] = reportCompletion.split('/').map(Number);

  // Check if all items are completed
  if (completed === total) {
    return { color: 'var(--theme-color-accent)' };
  } else {
    return { color: 'var(--color-text)' };
  }
}

export function isEvpReportCompleteAndFullyCompleted(doc) {
  const evpReport = doc?.data?.audit_document?.evp_report || null;
  const providerStatus = evpReport?.audit_review?.provider_evp_status || null;

  if (!providerStatus) {
    return false;
  }

  // Check if the provider status is ReviewStatusEnum.COMPLETE
  const completeDocument = providerStatus === ReviewStatusEnum.COMPLETE;

  // Calculate the fraction of completed forms
  const formsCompleted = calculateCompletionFraction(evpReport);

  // Check if all forms are completed
  const [completed, total] = formsCompleted.split('/').map(Number);
  const isFullyCompleted = completed === total;

  // Return true if both conditions are satisfied
  return completeDocument && isFullyCompleted;
}

export function isEvpReportToBeAudited(doc) {
  const evpReport = doc?.data?.audit_document?.evp_report || null;
  const reviewStatus = evpReport?.audit_review?.review_status || null;

  if (!reviewStatus) {
    return false;
  }

  // Return true if the review status is not ReviewStatusEnum.COMPLETE
  return reviewStatus !== ReviewStatusEnum.COMPLETE;
}

export function isEvpReportAudited(doc) {
  const evpReport = doc?.data?.audit_document?.evp_report || null;
  const reviewStatus = evpReport?.audit_review?.review_status || null;

  if (!reviewStatus) {
    return false;
  }

  // Return true if the review status is ReviewStatusEnum.COMPLETE
  return reviewStatus == ReviewStatusEnum.COMPLETE;
}

export function isEvpReportIncomplete(doc) {
  const evpReport = doc?.data?.audit_document?.evp_report || null;
  const reviewStatus = evpReport?.audit_review?.review_status || null;

  // Calculate the fraction of completed forms
  const formsCompleted = calculateCompletionFraction(evpReport);

  // Check if all forms are completed
  const [completed, total] = formsCompleted.split('/').map(Number);
  const isNotFullyCompleted = completed !== total;

  // Return true only if the review status is not "complete" and forms are not fully completed
  return isNotFullyCompleted;
}

export const changeColorBasedOnStatus = (status) => {
  switch (status) {
    case ReviewStatusEnum.IN_REVIEW:
      return 'var(--color-text)';
    case ReviewStatusEnum.AUDITED:
      return 'var(--theme-color-accent)';
    case ReviewStatusEnum.COMPLETE:
      return 'var(--theme-color-accent)';
    case ReviewStatusEnum.MORE_DATA_NEEDED:
      return 'var(--color-text)';
    case ReviewStatusEnum.NOT_STARTED:
      return 'var(--theme-modal)';
    default:
      return 'var(--color-text)';
  }
};
