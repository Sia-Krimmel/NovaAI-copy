import { toDateISOString } from './utilities';

export function calculateNextEVPProcess(providerEvpSubmissionDate) {
  if (!providerEvpSubmissionDate) {
    return null;
  }

  const NEXT_EVP_DATE = 90;

  const submissionDate = new Date(providerEvpSubmissionDate);

  const nextEVPProcessDate = new Date(submissionDate.setDate(submissionDate.getDate() + NEXT_EVP_DATE));

  return toDateISOString(nextEVPProcessDate.toISOString());
}
