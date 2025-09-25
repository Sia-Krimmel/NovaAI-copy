import styles from '@components/AuditOutputs.module.scss';
import gridStyles from '@components/GridStyles.module.scss';
import sideNavStyles from '@components/SideNavigaton.module.scss';

import * as Utilities from 'common/utilities';

import { FormHeading } from '@root/components/typography/forms';
import { NOVA_ENERGY_DOMAIN, onUploadData } from '@root/common/files';
import { H4, P } from '@root/components/typography';
import { ReviewStatusEnum } from '@root/common/types';
import { updateAuditOutputsFormPostgres } from '@root/resolvers/PostgresResolvers';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import FormUpload from '@root/components/FormUpload';
import GreenScoreCard from '@root/components/GreenScoreCard';
import GreenscoreResult from '@root/components/GreenscoreResult';
import HeaderText from '@root/components/HeaderText';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React, { useState } from 'react';
import SuccessScreen from '@root/components/SuccessScreen';
import TextAreaWithSpotlight from '@root/components/TextAreaWithSpotlight';
import Link from '@root/components/Link';

export default function AuditOutputs({ auditOutputs, dashboard, documentId, greenscores, menu, viewer, document, sessionKey }: any) {
  // const [greenscore, setGreenscore] = useState(document?.greenscore ?? GreenscoreOptions[0].value);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [uploadingFile2, setUploadingFile2] = React.useState<boolean>(false);
  const [submitAnotherAuditOutput, setSubmitAnotherAuditOutput] = useState(false);
  const [viewOutputs, setViewOutputs] = useState(false);

  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [recommendationFile, setRecommendationFile] = React.useState<string | null>('');
  const [scoringMetricFile, setScoringMetricFile] = React.useState<string | null>('');

  const [feedback, setFeedback] = useState(document?.feedback || '');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = useState(false);

  const domain = NOVA_ENERGY_DOMAIN;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!greenscore) {
      alert('Please make sure the greenscore calculation is submitted');
      return;
    }

    const auditOutputsForm: any = {
      scoringMetricFile,
      recommendationFile,
      feedback,
      status: ReviewStatusEnum.APPROVED,
      reviewStatus: ReviewStatusEnum.APPROVED,
    };

    //Convert data keys to snake_case for the database
    const auditOutputsFormFormatted = Utilities.convertObjectKeysToSnakeCase(auditOutputsForm) as any;

    const todaysDate = new Date();
    const date = Utilities.toDateISOString(todaysDate.toISOString());

    const auditOutputsFormatted = {
      date: date,
      audit_outputs: auditOutputsFormFormatted,
    };

    try {
      const { success, result, error } = await updateAuditOutputsFormPostgres({
        auditOutputs: auditOutputsFormatted,
        documentId,
        sessionKey: sessionKey,
      });

      if (success) {
        setSuccess(true);
      } else {
        console.error('Failed to update and submit the water consumption form:', error);
      }

      setLoading(false);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  //old
  // const handleAnotherSubmission = () => {
  //   setSubmitAnotherAuditOutput(true);
  // };

  const handleToggleView = (e) => {
    e.preventDefault();
    setViewOutputs(!viewOutputs);
  };

  const latestGreenscoreSubmission = greenscores ? greenscores[greenscores.length - 1] : null;
  const greenscore = latestGreenscoreSubmission?.greenscore ?? null;

  console.log(greenscore, 'greenscore');

  console.log(document, 'document');

  return (
    <div className={sideNavStyles.container}>
      <DashboardSideNavbar
        firstIcon={menu?.firstIcon ?? ''}
        firstLink={menu?.firstLink}
        brandLink={menu?.brandLink}
        firstTitle={menu?.firstTitle}
        menuNavigation={menu}
        documentId={documentId}
        prefix={menu?.prefix ?? null}
      />
      <div>
        <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />
        <PageGutterWrapper>
          {submitAnotherAuditOutput || auditOutputs?.length < 1 ? (
            <div style={{ paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <HeaderText title="Audit Outputs" description="Tokenized Outputs to be submitted to the provider for their EVP Process submission." />

                {auditOutputs?.length > 0 && (
                  <Button style={ButtonStyleEnum.BORDER_BLACK} onClick={handleToggleView}>
                    View All Historic Outputs
                  </Button>
                )}
              </div>
              {!success ? (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div style={{ paddingBottom: '2rem' }}>
                    <FormHeading className={styles.formHeading} style={{ paddingBottom: '1rem' }}>
                      The following EVP Report will be submitted to the provider
                    </FormHeading>
                    <Button style={ButtonStyleEnum.LINK_GREEN} href={`/report/${documentId}`} target="_blank">
                      View Report
                    </Button>
                  </div>

                  <div style={{ paddingBottom: '2rem' }}>
                    <FormHeading className={styles.formHeading}>
                      (Optional) Upload a document describing how the provider scored & recommendations for better performance:
                    </FormHeading>
                    <FormUpload
                      id="recommendation-file-upload"
                      loading={uploading}
                      fileURL={recommendationFile}
                      onSetFile={async (file) => {
                        setUploadingFile2(true);

                        const response = await onUploadData({ file, domain, key: sessionKey, setModal });
                        if (!response) {
                          setUploadingFile2(false);
                          return;
                        }

                        if (response.error) {
                          setUploadingFile2(false);
                          setModal({ name: 'ERROR', message: response.message });
                          return;
                        }

                        setUploadingFile2(false);

                        setRecommendationFile(response.fileURL);
                      }}
                      className={styles.uploadBill}
                    />
                  </div>
                  <HeaderText title="Green Score" />

                  <FormHeading className={styles.formHeading}> Green Score results from the report calculations:</FormHeading>

                  {greenscores?.length > 0 ? (
                    <>
                      {greenscores[-1]?.map((item, index) => {
                        const greenscore = item?.greenscore;

                        return (
                          <section className={gridStyles.twoColumnGrid} style={{ paddingBottom: '1rem' }}>
                            <GreenscoreResult
                              key={index}
                              date={item.date}
                              emissionsScore={greenscore.emissionsScore}
                              locationScore={greenscore.location}
                              confidenceScore={greenscore.confidenceScore}
                              greenScore={greenscore.greenScore}
                            />

                            <div style={{ paddingTop: '2.5rem' }}>
                              <GreenScoreCard greenscore={greenscore.greenScore} withBorder={true} />
                            </div>
                          </section>
                        );
                      })}
                    </>
                  ) : (
                    <P style={{ paddingBottom: '1rem', color: 'var(--color-error)' }}>Please use the greenscore calculation to calculate the greenscore</P>
                  )}

                  <div style={{ paddingBottom: '2rem' }}>
                    <FormHeading className={styles.formHeading}>Additional Recommendations and Comments</FormHeading>

                    <TextAreaWithSpotlight
                      height="var(--textarea-height-regular)"
                      type="textarea"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Add comments..."
                    />
                  </div>

                  <Button style={ButtonStyleEnum.SQUARE_GREEN}>Submit to Provider</Button>
                </form>
              ) : (
                <SuccessScreen message="Your Audit Output has been successfully submitted! Please refresh this page to see the updated record." />
              )}
            </div>
          ) : (
            <section>
              <div style={{ paddingBottom: '2rem', paddingTop: '1rem', display: 'grid', rowGap: '1rem' }}>
                <HeaderText title="Submitted Audit Outputs" description={`Document ID: ${documentId}`} />
                {auditOutputs?.map((item, index) => {
                  if (!item) {
                    return null;
                  }
                  const auditOutput = item?.auditOutputs ?? null;
                  return (
                    <>
                      <div key={index} className={styles.auditOutputResult}>
                        <div>
                          <div className={Utilities.classNames(styles.gridContainer2Cols, styles.borderBottom, styles.auditResultRow)}>
                            <P>Submission Number</P>
                            <P>{index + 1}</P>
                          </div>
                          <div className={Utilities.classNames(styles.gridContainer2Cols, styles.borderBottom, styles.auditResultRow)}>
                            <P>Submission Date</P>
                            <P>{item.date}</P>
                          </div>

                          {/* <div className={Utilities.classNames(styles.gridContainer2Cols, styles.auditResultRow, styles.borderBottom)}>
                            <P>Scoring Metric Attachment</P>
                            <P>{auditOutput.scoringMetricFile || 'No File Provided'}</P>
                          </div> */}
                          <div className={Utilities.classNames(styles.gridContainer2Cols, styles.auditResultRow, styles.borderBottom)}>
                            <P>EVP Report Link</P>
                            <Button style={ButtonStyleEnum.LINK_GREEN} href={`/report/${documentId}`} target="_blank">
                              View Report
                            </Button>
                          </div>
                          <div className={Utilities.classNames(styles.gridContainer2Cols, styles.borderBottom, styles.auditResultRow)}>
                            <P>Report Attachment</P>
                            <P>{auditOutput?.recommendationFile || 'No File Provided'}</P>
                          </div>
                          {/* <div className={Utilities.classNames(styles.gridContainer2Cols, styles.auditResultRow, styles.borderBottom)}>
                            <P>EVP Final Report Link</P>
                            <P>{item.feedback}</P>
                          </div> */}
                          <div className={Utilities.classNames(styles.gridContainer2Cols, styles.auditResultRow)}>
                            <P>Feedback</P>
                            <P>{auditOutput?.feedback || 'No Feedback'}</P>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
                {/* 
                <H4>Step 2: Attest this EVP Report</H4>
                <P style={{ paddingBottom: '1rem' }}>
                  If you approve this EVP report, it can now be sent to the attestation service to be stored on chain. <br />
                  <br />
                  Please Review the Output template that would be sent{' '}
                  <Link linkStyle="animated-black" href={`/auditor/evp-process/attest-evp-report/${documentId}`} target="_blank">
                    <span style={{ color: 'var(--theme-color-accent)' }}>here</span>
                  </Link>
                  .
                  <br />
                  If everything looks correct, please attest this report.
                </P>

                <div>
                  <Button style={ButtonStyleEnum.SQUARE_GREEN}>Attest this EVP Report</Button>
                </div> */}
              </div>
            </section>
          )}
        </PageGutterWrapper>
      </div>
    </div>
  );
}
