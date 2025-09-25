'use client';

import * as Utilities from 'common/utilities';

import styles from '@root/components/WaterConsumptionSection.module.scss';
import formStyles from '@root/components/FormStyle.module.scss';
import sideNavStyles from '@root/components/SideNavigaton.module.scss';

import { FormHeading } from '@root/components/typography/forms';
import { FormTypeEnum, ReviewStatusEnum, WaterConsumptionForm, WaterConsumptionFormDatabase } from '@root/common/types';
import { NOVA_ENERGY_DOMAIN, onUploadData } from '@root/common/files';
import { updateWaterConsumptionFormPostgres } from '@root/resolvers/PostgresResolvers';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import DatePicker from '@root/components/DatePicker';
import Form from '@root/components/Form';
import FormMessages from '@root/components/FormMessages';
import FormUpload, { EmptyFileUpload } from '@root/components/FormUpload';
import HeaderText from '@root/components/HeaderText';
import InputWithSpotlight from '@root/components/InputWithspotlight';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React, { useRef, useState } from 'react';
import Select from '@root/components/Select';
import SuccessScreen from '@root/components/SuccessScreen';

const infrastructureOptions = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];

export default function WaterConsumptionSection({ auditor, dashboard, userId, documentId, menu, sessionKey, document, messages, viewer }) {
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [endDate, setEndDate] = useState(document?.endDate ?? '');
  const [existingUserRecord, setExistingUserRecord] = useState<WaterConsumptionForm | null>(document ?? null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [reference, setReference] = useState('');
  const [waterUsage, setWaterUsage] = useState(document?.waterUsage || infrastructureOptions[0].value);
  const [startDate, setStartDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [waterBillFiles, setWaterBillFiles] = useState<string[]>(Array.isArray(document?.waterBillFiles) ? document?.waterBillFiles : []);
  const [waterCompany, setWaterCompany] = useState('');
  const [reviewStatus, setReviewStatus] = useState(document?.status ?? '');
  const [createdAt, setCreatedAt] = React.useState(document?.createdAt || '');
  const [updatedAt, setUpdatedAt] = React.useState(document?.updatedAt || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formType = FormTypeEnum.WATER_CONSUMPTION;
  const domain = NOVA_ENERGY_DOMAIN;

  React.useEffect(() => {
    if (existingUserRecord !== null) {
      setReference(existingUserRecord.reference || '');
      setWaterBillFiles(
        Array.isArray(existingUserRecord.waterBillFiles) ? existingUserRecord.waterBillFiles : existingUserRecord.waterBillFiles ? [existingUserRecord.waterBillFiles] : ['']
      );
      setWaterCompany(existingUserRecord.waterCompany || '');
      setStartDate(existingUserRecord.startDate || '');
      setEndDate(existingUserRecord.endDate || '');
      setWaterUsage(existingUserRecord.waterUsage || '');
      setReviewStatus(existingUserRecord.status || '');
    }
  }, [existingUserRecord]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (waterUsage && !waterCompany.trim()) {
      alert('You must provide a water company');
      return;
    }

    if (waterUsage && !startDate.trim()) {
      alert('You must provide a start date');
      return;
    }

    const now = new Date().toISOString();
    if (!createdAt) {
      setCreatedAt(now);
    }

    setUpdatedAt(now);

    const waterConsumtionForm: WaterConsumptionForm = {
      endDate,
      reference,
      waterUsage,
      startDate,
      waterBillFiles,
      waterCompany,
      createdAt,
      updatedAt,
      status: ReviewStatusEnum.IN_REVIEW,
    };

    //Convert data keys to snake_case for the database
    const waterConsumtionFormFormatted = Utilities.convertObjectKeysToSnakeCase(waterConsumtionForm) as WaterConsumptionFormDatabase;

    try {
      const { success, result, error } = await updateWaterConsumptionFormPostgres({
        waterConsumption: waterConsumtionFormFormatted,
        sessionKey,
        documentId,
      });

      if (success) {
        setSuccess(true);
        console.log(success, 'success!');
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

  const handleSetWaterBillFiles = async (file) => {
    setUploading(true);
    try {
      const response = await onUploadData({ file, domain, key: sessionKey, setModal });
      if (response.error) {
        setModal({ name: 'ERROR', message: response.message });
      } else {
        setWaterBillFiles((prevFiles) => [...prevFiles, response.fileURL]); // Ensure this creates a new array
      }
    } catch (error) {
      setModal({ name: 'ERROR', message: error.message || 'Failed to upload file.' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isEditable = !auditor;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleSetWaterBillFiles(file);
      e.target.value = null;
    }
  };

  const handleReSubmit = () => {
    setSuccess(false);
    setReviewStatus(ReviewStatusEnum.IN_PROGRESS);
  };

  const nextLink = `/electricity-consumption/${documentId}`;
  const backLink = `/evp-process`;

  return (
    <div className={sideNavStyles.container}>
      <DashboardSideNavbar
        firstIcon={menu?.firstIcon ?? ''}
        brandLink={menu?.brandLink}
        firstLink={menu?.firstLink ?? ''}
        firstTitle={menu?.firstTitle ?? ''}
        menuNavigation={menu}
        documentId={documentId}
        prefix={menu?.prefix ?? null}
      />
      <div>
        <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />

        <PageGutterWrapper>
          <div id="water-consumption-form">
            {(reviewStatus !== ReviewStatusEnum.IN_REVIEW && !success) || auditor ? (
              <Form auditor={auditor} style={{ minHeight: '70vh' }} backLink={backLink} nextLink={nextLink} handleSubmit={handleSubmit} success={success}>
                <HeaderText title="Water Consumption" description="Please provide water consumption information" />

                <div className={styles.gridContainer}>
                  <div style={{ paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '0.2rem' }}>
                      {/* {createdAt && <FormHeading>Created At: {Utilities.toDateISOString(createdAt)}</FormHeading>} */}

                      {updatedAt && <FormHeading>Modified At: {Utilities.toDateISOString(updatedAt)}</FormHeading>}
                    </div>
                    <FormHeading className={formStyles.formHeading}> Is water used to cool your IT infrastructure?</FormHeading>

                    <Select
                      type="selectWaterUsage"
                      className={styles.waterUsage}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setWaterUsage(newValue);
                      }}
                      options={infrastructureOptions}
                      value={waterUsage}
                      disabled={!isEditable}
                    />
                  </div>
                  {waterUsage === infrastructureOptions[1].value && (
                    <>
                      <div>
                        <FormHeading>Water Utility Provider</FormHeading>
                        <InputWithSpotlight
                          type="waterCompany"
                          value={waterCompany}
                          onChange={(e) => setWaterCompany(e.target.value)}
                          placeholder="Water Company"
                          disabled={!isEditable}
                        />
                      </div>

                      <div className={styles.datePickerGrid}>
                        <div className={styles.fullWidth}>
                          <FormHeading>Start Date</FormHeading>
                          <DatePicker id={'start-date'} value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!isEditable} />
                        </div>

                        <div className={styles.fullWidth}>
                          <FormHeading>End Date </FormHeading>
                          <DatePicker id={'end-date'} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!isEditable} />
                        </div>
                      </div>

                      <div>
                        <FormHeading> Reference / Bill ID # </FormHeading>
                        <InputWithSpotlight type="reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="00.239.390112" disabled={!isEditable} />
                      </div>

                      <div style={{ paddingBottom: '2rem' }}>
                        <FormHeading>Upload your most recent water bill documents</FormHeading>
                        <div className={styles.formUploads}>
                          {waterBillFiles &&
                            waterBillFiles?.length > 0 &&
                            waterBillFiles?.map((fileURL, index) =>
                              fileURL ? (
                                <FormUpload
                                  key={`water-bill-${index}`}
                                  loading={uploading}
                                  fileURL={fileURL}
                                  width="100%"
                                  disabled={!isEditable}
                                  onRemove={() => setWaterBillFiles((prev) => prev.filter((_, i) => i !== index))}
                                />
                              ) : (
                                <></>
                              )
                            )}

                          <EmptyFileUpload onClick={handleAddFileClick} width="100%" disabled={!isEditable} />

                          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} disabled={!isEditable} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            ) : (
              <div>
                <SuccessScreen message="Thank you for submitting the  Water Consumption Form. It is being reviewed by our Auditors." />
                <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '2rem' }}>
                  <span>
                    <Button style={ButtonStyleEnum.BORDER_BLACK} href={backLink}>
                      Back
                    </Button>
                  </span>
                  <Button onClick={handleReSubmit} style={ButtonStyleEnum.SQUARE_BLACK}>
                    Re Submit Form
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PageGutterWrapper>
        <FormMessages formType={formType} documentId={documentId} messages={messages} sessionKey={sessionKey} setModal={setModal} viewer={viewer} />
      </div>
    </div>
  );
}
