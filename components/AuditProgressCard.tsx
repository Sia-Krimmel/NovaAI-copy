import styles from '@components/AuditProgressCard.module.scss';

import { changeColorBasedOnStatus } from '@root/resolvers/HelperResolvers';
import { classNames } from '@root/common/utilities';
import { LabelTiny, P } from './typography';
import { ReviewStatusEnum } from '@root/common/types';
import { useRouter } from 'next/navigation';
import ArrowUpSVG from './svgs/ArrowUpSVG';
import Button, { ButtonStyleEnum } from './Button';
import React, { useState } from 'react';

interface FormStatuses {
  auditId: string;
  auditNumber: string;
  auditReview: ReviewStatusEnum;
  auditStatus: ReviewStatusEnum;
  electricityFormStatus: ReviewStatusEnum;
  energyProcuredFormStatus: ReviewStatusEnum;
  energyProducedFormStatus: ReviewStatusEnum;
  hardwareConfigurationFormStatus: ReviewStatusEnum;
  locationInformationFormStatus: ReviewStatusEnum;
  preliminaryResultsFormStatus: ReviewStatusEnum;
  progressBarWidth: string;
  score: string;
  waterConsumptionFormStatus: ReviewStatusEnum;
  waterConsumptionStatus: ReviewStatusEnum;
}

interface AuditProgressCardProps {
  title: string;
  data: FormStatuses[];
}

function showStatus(status) {
  switch (status) {
    case ReviewStatusEnum.IN_REVIEW:
      return <span className={styles.statusGreen}>Submitted</span>;
    case ReviewStatusEnum.COMPLETE:
      return <span className={styles.statusSubmitted}>Submitted</span>;
    case ReviewStatusEnum.NOT_STARTED:
    case ReviewStatusEnum.NOT_SUBMITTED:
    case status == null || status == undefined:
    default:
      return <span className={styles.statusUnsubmitted}>Unsubmitted</span>;
  }
}

function calculateProgressWidth({
  auditReview,
  electricityFormStatus,
  energyProcuredFormStatus,
  energyProducedFormStatus,
  hardwareConfigurationFormStatus,
  locationInformationFormStatus,
  preliminaryResultsFormStatus,
  waterConsumptionFormStatus,
  waterConsumptionStatus,
}: any) {
  let totalScore = 0;

  const totalPoints = 100;
  const numberOfForms = 8;
  const amountPerForm = totalPoints / numberOfForms;
  const statuses = [
    auditReview,
    electricityFormStatus,
    energyProcuredFormStatus,
    energyProducedFormStatus,
    hardwareConfigurationFormStatus,
    locationInformationFormStatus,
    preliminaryResultsFormStatus,
    waterConsumptionFormStatus,
    waterConsumptionStatus,
  ];

  statuses.forEach((status) => {
    if (status === ReviewStatusEnum.AUDITED || status === ReviewStatusEnum.IN_PROGRESS || status === ReviewStatusEnum.IN_REVIEW || status === ReviewStatusEnum.COMPLETE) {
      totalScore += amountPerForm;
    }
  });

  return totalScore;
}

const AuditProgressCards: React.FC<AuditProgressCardProps> = ({ title, data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [collapsedIndices, setCollapsedIndices] = useState<boolean[]>(new Array(data?.length).fill(true));
  const router = useRouter();

  const maxRecordsPerPage = 5;
  const length = data?.length | 0;
  const totalPages = Math.ceil(length / maxRecordsPerPage);

  const start = currentPage * maxRecordsPerPage;
  const end = start + maxRecordsPerPage;
  let documents = data?.slice(start, end) || [];

  if (documents.length < maxRecordsPerPage && length > maxRecordsPerPage) {
    const additionalItems = data.slice(0, maxRecordsPerPage - documents.length);
    documents = documents.concat(additionalItems);
  }

  const updatePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updateNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleCollapse = (index: number) => {
    setCollapsedIndices((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleEventClick = (auditId) => {
    router.push(`/evp-process/${auditId}`);
  };

  return (
    <div className={styles.greenscoresStyling}>
      <p className={styles.header}>{title}</p>
      <div className={styles.greenscoresContainer}>
        {documents?.map((greenScore, index) => {
          const {
            auditId,
            auditNumber,
            auditReview,
            auditStatus,
            electricityFormStatus,
            energyProcuredFormStatus,
            energyProducedFormStatus,
            hardwareConfigurationFormStatus,
            locationInformationFormStatus,
            preliminaryResultsFormStatus,
            waterConsumptionFormStatus,
          } = greenScore;

          const score = calculateProgressWidth({
            auditReview,
            electricityFormStatus,
            energyProcuredFormStatus,
            energyProducedFormStatus,
            hardwareConfigurationFormStatus,
            locationInformationFormStatus,
            preliminaryResultsFormStatus,
            waterConsumptionFormStatus,
          });

          if (score == 100) {
            return <></>;
          }

          return (
            <section key={index}>
              {auditStatus !== ReviewStatusEnum.AUDITED && (
                <div className={styles.greenscoresBox}>
                  <div className={styles.progress}>
                    <div>
                      <div className={styles.progressRow}>
                        <div className={styles.auditTitle} style={{ paddingBottom: '0.2rem' }}>
                          Audit #{auditNumber}
                        </div>
                        <div className={styles.arrowButton} onClick={() => toggleCollapse(index)}>
                          <ArrowUpSVG className={collapsedIndices[index] ? styles.arrowCollapsed : styles.arrowExpanded} />
                        </div>
                      </div>
                      <p className={styles.label}>ID: {auditId}</p>
                    </div>

                    <div style={{ paddingTop: '1rem' }}>
                      <div className={styles.progressRow} style={{ paddingBottom: '0.5rem' }}>
                        <LabelTiny>Completion</LabelTiny>
                        <LabelTiny>{score}%</LabelTiny>
                      </div>

                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar} style={{ width: `${score}%`, color: 'var(--color-text)' }}></div>
                      </div>
                    </div>

                    <div className={styles.greenscoresFlex}>
                      {auditStatus && (
                        <div className={styles.score}>
                          <div>{score}%</div>
                          Complete
                        </div>
                      )}
                    </div>
                  </div>

                  {score < 100 ? (
                    <div className={styles.formsFlex}>
                      <div className={styles.expandContainer}>
                        <div className={classNames(styles.formContainer, collapsedIndices[index] ? styles.collapsed : styles.expanded)} style={{ paddingBottom: '1rem' }}>
                          {score < 100 ? (
                            <>
                              <div className={styles.formType}>
                                <p className={styles.formTitle}>Location Information</p>
                                <p className={styles.formTitle}>Hardware Configuration</p>
                                <p className={styles.formTitle}>Water Consumption</p>
                                <p className={styles.formTitle}>Energy Consumption</p>
                                <p className={styles.formTitle}>Renewable Energy Produced</p>
                                <p className={styles.formTitle}>Renewable Energy Procured</p>
                                <p className={styles.formTitle}>Preliminary Results</p>
                                <p className={styles.formTitle}>Audit Review</p>
                              </div>

                              <div className={styles.formStatus}>
                                {locationInformationFormStatus && (
                                  <p className={styles.formTitle} style={{ color: changeColorBasedOnStatus(locationInformationFormStatus) }}>
                                    {showStatus(locationInformationFormStatus)}
                                  </p>
                                )}
                                {hardwareConfigurationFormStatus && (
                                  <p className={styles.formTitle} style={{ color: changeColorBasedOnStatus(hardwareConfigurationFormStatus) }}>
                                    {showStatus(hardwareConfigurationFormStatus)}
                                  </p>
                                )}

                                {waterConsumptionFormStatus && (
                                  <p className={styles.formTitle} style={{ color: changeColorBasedOnStatus(waterConsumptionFormStatus) }}>
                                    {showStatus(waterConsumptionFormStatus)}
                                  </p>
                                )}
                                {electricityFormStatus && (
                                  <p className={styles.formTitle} style={{ color: changeColorBasedOnStatus(energyProcuredFormStatus) }}>
                                    {showStatus(electricityFormStatus)}
                                  </p>
                                )}

                                {energyProducedFormStatus && (
                                  <p className={styles.formTitle} style={{ color: changeColorBasedOnStatus(energyProducedFormStatus) }}>
                                    {showStatus(energyProducedFormStatus)}
                                  </p>
                                )}

                                {energyProcuredFormStatus && (
                                  <p className={styles.formTitle} style={{ color: changeColorBasedOnStatus(energyProcuredFormStatus) }}>
                                    {showStatus(energyProcuredFormStatus)}
                                  </p>
                                )}

                                {preliminaryResultsFormStatus && (
                                  <p className={styles.formTitle} style={{ color: changeColorBasedOnStatus(preliminaryResultsFormStatus) }}>
                                    {showStatus(preliminaryResultsFormStatus)}
                                  </p>
                                )}

                                {auditReview && (
                                  <p className={styles.formTitle} style={{ color: changeColorBasedOnStatus(auditReview) }}>
                                    {showStatus(auditReview)}
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <p style={{ color: 'var(--theme-color-accent)' }}> EVP Process is complete</p>
                          )}
                        </div>
                      </div>
                      {score < 100 ? (
                        <div style={{ width: '100%' }}>
                          <Button style={ButtonStyleEnum.SQUARE_BLACK} onClick={() => handleEventClick(auditId)} styles={{ width: '100%' }}>
                            Continue
                          </Button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <P style={{ color: 'var(--theme-color-accent)', padding: '2.4rem' }}> EVP Process is complete</P>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className={styles.footer}>
        <div className={styles.pagination}>
          <div className={styles.previous} onClick={updatePreviousPage}>
            Previous Page
          </div>

          <div className={styles.separator}> | </div>

          <div className={styles.next} onClick={updateNextPage}>
            Next Page
          </div>
        </div>
        <div className={styles.total}>
          <div>Total {length}</div>
        </div>
      </div>
    </div>
  );
};

export default AuditProgressCards;
