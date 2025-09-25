'use client';

import * as Utilities from 'common/utilities';

import styles from '@components/RenewableEnergyProcurement.module.scss';
import sideNavStyles from '@components/SideNavigaton.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';

import { EnergyProcuredForm, EnergyProcuredFormDatabase, FormTypeEnum, ReviewStatusEnum } from '@root/common/types';
import { FormHeading } from '@root/components/typography/forms';
import { NOVA_ENERGY_DOMAIN, onUploadData } from '@root/common/files';
import { updateEnergyProcuredFormPostgres } from '@root/resolvers/PostgresResolvers';
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
import Button, { ButtonStyleEnum } from '@root/components/Button';

const energyUsageOptions = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];

export default function RenewableEnergyProcuredSection({ auditor, dashboard, sessionKey, messages, menu, userId, viewer, document, documentId }) {
  const [actualElectricityDelivered, setActualElectricityDelivered] = React.useState<string>(document?.actualElectricityDelivered ?? 0);
  const [actualElectricityReturned, setActualElectricityReturned] = React.useState<string>(document?.actualElectricityReturned ?? 0);
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [endDate, setEndDate] = useState(document?.endDate ?? '');
  const [energyUsage, setEnergyUsage] = useState(document?.energyUsage ?? energyUsageOptions[0].value);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [renewableEnergyPurchasedFrom, setRenewableEnergyPurchasedFrom] = useState(document?.renewableEnergyPurchasedFrom ?? '');
  const [renewableEnergyType, setRenewableEnergyType] = useState(document?.renewableEnergyType ?? '');
  const [startDate, setStartDate] = useState(document?.startDate ?? '');
  const [success, setSuccess] = useState(false);
  const [documentFiles, setDocumentFiles] = React.useState(document?.documentFiles || []);
  const [supportingFiles, setSupportingFiles] = React.useState(document?.supportingFiles || []);
  const [reviewStatus, setReviewStatus] = React.useState(document?.status ?? '');
  const [createdAt, setCreatedAt] = React.useState(document?.createdAt || '');
  const [updatedAt, setUpdatedAt] = React.useState(document?.updatedAt || '');

  const [uploading, setUploading] = React.useState<boolean>(false);

  const formType = FormTypeEnum.RENEWABLE_ENERGY_PROCUREMENT;
  const domain = NOVA_ENERGY_DOMAIN;

  const documentFilesRef = useRef<HTMLInputElement>(null);
  const supportingFilesRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (energyUsage && energyUsage === energyUsageOptions[1].value) {
      if (!startDate.trim()) {
        alert('Please provide your start date ');
        return;
      }

      if (energyUsage && !endDate.trim()) {
        alert('Please provide your end date ');
        return;
      }
      if (energyUsage && !renewableEnergyType) {
        alert('Please write the Total Solar Watt Peak ');
        return;
      }
    }

    const energyProcuredForm: EnergyProcuredForm = {
      endDate,
      startDate,
      renewableEnergyType,
      energyUsage,
      renewableEnergyPurchasedFrom,
      documentFiles,
      supportingFiles,
      actualElectricityDelivered,
      actualElectricityReturned,
      createdAt,
      updatedAt,
      status: ReviewStatusEnum.IN_REVIEW,
    };

    //Convert data keys to snake_case for the database
    const energyProcuredFormatted = Utilities.convertObjectKeysToSnakeCase(energyProcuredForm) as EnergyProcuredFormDatabase;
    try {
      const { success, result, error } = await updateEnergyProcuredFormPostgres({
        energyProcured: energyProcuredFormatted,
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

  const handleFileUpload = async (file, setFiles) => {
    setUploading(true);
    try {
      const response = await onUploadData({ file, domain, key: sessionKey, setModal });
      if (response.error) {
        setModal({ name: 'ERROR', message: response.message });
      } else {
        setFiles((prevFiles) => [...prevFiles, response.fileURL]);
      }
    } catch (error) {
      setModal({ name: 'ERROR', message: error.message || 'Failed to upload file.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSupportingFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, setSupportingFiles);
      e.target.value = null;
    }
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, setDocumentFiles);
      e.target.value = null;
    }
  };

  const handleSupportingFileClick = () => {
    if (supportingFilesRef.current) {
      supportingFilesRef.current.click();
    }
  };

  const handleDocumentFileClick = () => {
    if (documentFilesRef.current) {
      documentFilesRef.current.click();
    }
  };

  const handleReSubmit = () => {
    setSuccess(false);
    setReviewStatus(ReviewStatusEnum.IN_PROGRESS);
  };

  const isEditable = !auditor;

  const backLink = `/renewable-energy-produced/${documentId}`;
  const nextLink = `/results/${documentId}`;

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
          <div id="renewable-energy-procurement-form" className={styles.formContainer}>
            {(reviewStatus !== ReviewStatusEnum.IN_REVIEW && !success) || auditor ? (
              <Form handleSubmit={handleSubmit} style={{ paddingTop: '1rem' }} backLink={backLink} nextLink={nextLink} auditor={auditor}>
                <div className={styles.gridContainer}>
                  <div className={styles.submitSection}>
                    <HeaderText title="Renewable Energy Procurement" description="Provide Renewable Energy Procurement Information" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '0.2rem' }}>
                    {/* {createdAt && <FormHeading>Created At: {Utilities.toDateISOString(createdAt)}</FormHeading>} */}

                    {updatedAt && <FormHeading>Modified At: {Utilities.toDateISOString(updatedAt)}</FormHeading>}
                  </div>
                  <div>
                    <FormHeading>Is Renewable Energy purchased & used to power the network?</FormHeading>
                    <Select
                      type="select"
                      className={styles.waterUsage}
                      onChange={(e) => setEnergyUsage(e.target.value)}
                      options={energyUsageOptions}
                      value={energyUsage}
                      disabled={!isEditable}
                    />
                  </div>
                  {energyUsage === energyUsageOptions[1].value && (
                    <>
                      <div className={styles.twoColumnGrid}>
                        <div className={styles.datePicker}>
                          <FormHeading>Start Date</FormHeading>
                          <DatePicker id={'start-date'} value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!isEditable} />
                        </div>

                        <div className={styles.datePicker}>
                          <FormHeading>End Date </FormHeading>
                          <DatePicker id={'end-date'} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!isEditable} />
                        </div>
                      </div>

                      <div className={styles.twoColumnGrid}>
                        <div>
                          <FormHeading> Renewable Energy Type</FormHeading>
                          <InputWithSpotlight
                            type="text"
                            value={renewableEnergyType}
                            onChange={(e) => setRenewableEnergyType(e.target.value)}
                            placeholder="Type..."
                            disabled={!isEditable}
                          />
                        </div>

                        <div>
                          <FormHeading> Renewable Energy Purchased Form</FormHeading>
                          <InputWithSpotlight
                            type="text"
                            value={renewableEnergyPurchasedFrom}
                            onChange={(e) => setRenewableEnergyPurchasedFrom(e.target.value)}
                            placeholder="Name of the Company..."
                            disabled={!isEditable}
                          />
                        </div>
                      </div>

                      <div className={styles.twoColumnGrid} style={{ paddingBottom: '1.2rem' }}>
                        <div>
                          <FormHeading> Actual Electricity Delivered</FormHeading>
                          <InputWithSpotlight
                            type="text"
                            value={actualElectricityDelivered}
                            onChange={(e) => setActualElectricityDelivered(e.target.value)}
                            placeholder="(kWh):"
                            disabled={!isEditable}
                          />
                        </div>

                        <div>
                          <FormHeading> Actual Electricity Returned</FormHeading>
                          <InputWithSpotlight
                            type="text"
                            value={actualElectricityReturned}
                            onChange={(e) => setActualElectricityReturned(e.target.value)}
                            placeholder="(kWh):"
                            disabled={!isEditable}
                          />
                        </div>
                      </div>

                      <div>
                        <FormHeading>
                          If RECs are procured outside of our portal. You should submit invoices/attestation documents on RECS below to be audited, allocated, and included in our
                          REC purchases repository.
                        </FormHeading>
                        <div className={styles.flexColumn}>
                          <div style={{ paddingBottom: '1.5rem' }} className={gridStyles.threeColumnGrid}>
                            {documentFiles?.map((fileURL, index) => {
                              return (
                                <FormUpload
                                  key={`inspection-file-${index}`}
                                  loading={uploading}
                                  fileURL={fileURL}
                                  width="100%"
                                  onRemove={() => setDocumentFiles((prev) => prev.filter((_, i) => i !== index))}
                                />
                              );
                            })}
                            <EmptyFileUpload onClick={handleDocumentFileClick} width="100%" />
                            <input type="file" ref={documentFilesRef} style={{ display: 'none' }} onChange={handleDocumentFileChange} />
                          </div>

                          <FormHeading>Upload any other supporting certification</FormHeading>

                          <div className={gridStyles.threeColumnGrid} style={{ paddingBottom: '2.5rem' }}>
                            {supportingFiles?.map((fileURL, index) => {
                              return (
                                <FormUpload
                                  key={`purchase-file-${index}`}
                                  loading={uploading}
                                  fileURL={fileURL}
                                  width="100%"
                                  onRemove={() => setSupportingFiles((prev) => prev.filter((_, i) => i !== index))}
                                />
                              );
                            })}
                            <EmptyFileUpload onClick={handleSupportingFileClick} width="100%" />
                            <input type="file" ref={supportingFilesRef} style={{ display: 'none' }} onChange={handleSupportingFileChange} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            ) : (
              <div>
                <SuccessScreen message="Thank you for submitting the  Renewable Energy Procurement Form. It is being reviewed by our Auditors." />
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
