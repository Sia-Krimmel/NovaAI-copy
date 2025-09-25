'use client';

import * as Utilities from 'common/utilities';

import styles from '@components/ElectricityConsumptionSection.module.scss';
import sideNavStyles from '@components/SideNavigaton.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';

import { NOVA_ENERGY_DOMAIN, onUploadData } from '@root/common/files';
import { ElectricityConsumptionForm, ElectricityConsumptionFormDatabase, FormTypeEnum, ReviewStatusEnum } from '@root/common/types';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import DatePicker from '@root/components/DatePicker';
import Form from '@root/components/Form';
import FormMessages from '@root/components/FormMessages';
import FormUpload, { EmptyFileUpload } from '@root/components/FormUpload';
import HeaderText from '@root/components/HeaderText';
import InputWithSpotlight from '@root/components/InputWithspotlight';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import SuccessScreen from '@root/components/SuccessScreen';
import TextAreaWithSpotlight from '@root/components/TextAreaWithSpotlight';
import { FormHeading } from '@root/components/typography/forms';
import { updateElectricityConsumptionFormPostgres } from '@root/resolvers/PostgresResolvers';
import React, { useEffect, useRef, useState } from 'react';
import Button, { ButtonStyleEnum } from '@root/components/Button';

export default function ElectricityConsumptionSection({ auditor, dashboard, document, documentId, menu, messages, viewer, profile, sessionKey }: any) {
  const [actualElectricityConsumed, setActualElectricityConsumed] = useState(document?.actualElectricityConsumed || 0);
  const [actualElectricityDelivered, setActualElectricityDelivered] = useState(document?.actualElectricityDelivered || 0);
  const [actualElectricityReturned, setActualElectricityReturned] = useState(document?.actualElectricityReturned || 0);
  const [annualElectricityUsage, setAnnualElectricityUsage] = useState(document?.annualElectricityUsage ?? 0);
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [electricityBillFiles, setElectricityBillFiles] = React.useState(() => {
    return document && Array.isArray(document.electricityBillFiles) && document.electricityBillFiles.length > 0 ? document.electricityBillFiles : [];
  });
  const [electricityCompany, setElectricityCompany] = useState(document?.electricityCompany ?? '');
  const [electricityNotPoweringInfrastructure, setElectricityNotPoweringInfrastructure] = useState(document?.electricityNotPoweringInfrastructure ?? '');
  const [endDate, setEndDate] = useState(document?.endDate ?? '');
  const [estimationMethodology, setEstimationMethodology] = useState(document?.estimationMethodology ?? '');
  const [loading, setLoading] = React.useState(false);
  const [reference, setReference] = useState(document?.reference ?? '');
  const [startDate, setStartDate] = useState(document?.startDate ?? '');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [reviewStatus, setReviewStatus] = React.useState(document?.status ?? '');

  const formType = FormTypeEnum.ELECTRICITY_CONSUMPTION;
  const domain = NOVA_ENERGY_DOMAIN;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!electricityCompany.trim()) {
      alert('You must provide an electricity company.');
      return;
    }
    if (!startDate.trim()) {
      alert('You must provide a start date.');
      return;
    }
    if (!endDate.trim()) {
      alert('You must provide a end date.');
      return;
    }
    if (!annualElectricityUsage) {
      alert('You must provide Annual Electricity Usage.');
      return;
    }
    if (!actualElectricityDelivered) {
      alert('You must provide Annual Electricity Usage.');
      return;
    }
    if (!actualElectricityReturned) {
      alert('You must provide Annual Electricity Usage.');
      return;
    }

    if (!electricityNotPoweringInfrastructure) {
      alert('You must provide  Electiricity not used to power Filecoin Network (kWh).');
      return;
    }

    setLoading(true);

    const electricityConsumptionForm: ElectricityConsumptionForm = {
      electricityCompany,
      startDate,
      endDate,
      reference,
      annualElectricityUsage,
      electricityNotPoweringInfrastructure,
      estimationMethodology,
      actualElectricityReturned,
      actualElectricityConsumed,
      actualElectricityDelivered,
      electricityBillFiles,
      status: ReviewStatusEnum.IN_REVIEW,
    };

    //Convert data keys to snake_case for the database
    const electricityConsumptionFormFormatted = Utilities.convertObjectKeysToSnakeCase(electricityConsumptionForm) as ElectricityConsumptionFormDatabase;

    try {
      const { success, result, error } = await updateElectricityConsumptionFormPostgres({
        electricityConsumption: electricityConsumptionFormFormatted,
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

  useEffect(() => {
    const consumed = actualElectricityDelivered - actualElectricityReturned;

    setActualElectricityConsumed(consumed);
  }, [actualElectricityDelivered, actualElectricityReturned]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFileClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    } else {
      console.log('File input ref is null');
    }
  };

  const handleSetElectricityBillFiles = async (file) => {
    setUploading(true);
    try {
      const response = await onUploadData({ file, domain, key: sessionKey, setModal });
      if (response.error) {
        setModal({ name: 'ERROR', message: response.message });
      } else {
        setElectricityBillFiles((prevFiles) => [...prevFiles, response.fileURL]);
      }
    } catch (error) {
      setModal({ name: 'ERROR', message: error.message || 'Failed to upload file.' });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleSetElectricityBillFiles(file);
      e.target.value = null;
    }
  };

  const handleElectricityDeliveredChange = (e) => {
    const value = e.target.value;
    setActualElectricityDelivered(value ? parseFloat(value) : '');
  };

  const handleElectricityReturnedChange = (e) => {
    const value = e.target.value;
    setActualElectricityReturned(value ? parseFloat(value) : '');
  };

  // Update the useEffect hook for calculating consumed electricity
  useEffect(() => {
    if (actualElectricityDelivered && actualElectricityReturned) {
      const consumed = parseFloat(actualElectricityDelivered) - parseFloat(actualElectricityReturned);
      setActualElectricityConsumed(consumed);
    } else {
      setActualElectricityConsumed(0);
    }
  }, [actualElectricityDelivered, actualElectricityReturned]);

  const isEditable = !auditor;

  const handleReSubmit = () => {
    setSuccess(false);
    setReviewStatus(ReviewStatusEnum.IN_PROGRESS);
  };

  const backLink = `/evp-process/water-consumption/${documentId}`;
  const nextLink = `/evp-process/electricity-consumption/${documentId}`;

  return (
    <div className={sideNavStyles.container}>
      <DashboardSideNavbar
        firstIcon={menu?.firstIcon ?? ''}
        firstLink={menu?.firstLink ?? ''}
        firstTitle={menu?.firstTitle ?? ''}
        menuNavigation={menu}
        documentId={documentId}
        prefix={menu?.prefix ?? null}
      />

      <div>
        <DashboardTopNavbar dashboardNavigation={dashboard} onHandleThemeChange={Utilities.onHandleThemeChange} />

        <PageGutterWrapper>
          <div id="electricity-consumption-form" className={styles.formContainer}>
            {(reviewStatus !== ReviewStatusEnum.IN_REVIEW && !success) || auditor ? (
              <Form auditor={auditor} handleSubmit={handleSubmit} style={{ minHeight: '60vh' }} backLink={backLink} nextLink={nextLink}>
                <div className={styles.gridContainer}>
                  <HeaderText title="Energy Consumption" description="Please provide electricity consumption information" />

                  <div className={gridStyles.twoColumnGrid}>
                    <div>
                      <FormHeading>Electricity Provider</FormHeading>
                      <InputWithSpotlight
                        type="Elecricity Company"
                        value={electricityCompany}
                        onChange={(e) => setElectricityCompany(e.target.value)}
                        placeholder="Electricity Company"
                        disabled={!isEditable}
                      />
                    </div>

                    <div>
                      <FormHeading>Reference / Bill ID #</FormHeading>
                      <InputWithSpotlight type="reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="00.00.00" disabled={!isEditable} />
                    </div>
                  </div>
                  <div style={{ paddingBottom: '1rem' }}>
                    <FormHeading>Upload your most recent electricity bill documents</FormHeading>

                    <div className={styles.formUploads}>
                      {electricityBillFiles.map((fileURL, index) => {
                        return fileURL ? (
                          <FormUpload
                            key={`electricity-bill-${index}`}
                            loading={uploading}
                            fileURL={fileURL}
                            width="100%"
                            disabled={!isEditable}
                            onRemove={() => setElectricityBillFiles((prev) => prev.filter((_, i) => i !== index))}
                          />
                        ) : (
                          <></>
                        );
                      })}

                      <EmptyFileUpload onClick={handleAddFileClick} width="100%" disabled={!isEditable} />
                    </div>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} disabled={!isEditable} />
                  </div>

                  <div className={gridStyles.twoColumnGrid}>
                    <div>
                      <FormHeading>Start Date</FormHeading>
                      <DatePicker disabled={!isEditable} id={'start-date'} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>

                    <div>
                      <FormHeading>End Date </FormHeading>
                      <DatePicker disabled={!isEditable} id={'end-date'} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>

                  <div className={gridStyles.twoColumnGrid}>
                    <div>
                      <FormHeading>Estimated Annual Electricity Usage (kWh)</FormHeading>
                      <InputWithSpotlight
                        disabled={!isEditable}
                        type="number"
                        value={annualElectricityUsage}
                        onChange={(e) => setAnnualElectricityUsage(e.target.value)}
                        placeholder="(kWh)"
                      />
                    </div>

                    <div>
                      <FormHeading>Electricity not used to power your IT Infrastructure (kWh)</FormHeading>
                      <InputWithSpotlight
                        disabled={!isEditable}
                        type="number"
                        value={electricityNotPoweringInfrastructure}
                        onChange={(e) => setElectricityNotPoweringInfrastructure(e.target.value)}
                        placeholder="(kWh)"
                      />
                    </div>
                  </div>

                  <div className={gridStyles.threeColumnGrid} style={{ paddingBottom: '1rem' }}>
                    <div>
                      <FormHeading>Actual Electricity Delivery</FormHeading>

                      <InputWithSpotlight
                        type="number"
                        disabled={!isEditable}
                        value={actualElectricityDelivered}
                        onChange={handleElectricityDeliveredChange}
                        placeholder="0 (kWh)"
                      />
                    </div>

                    <div>
                      <FormHeading>Actual Electricity Returned</FormHeading>
                      <InputWithSpotlight type="number" disabled={!isEditable} value={actualElectricityReturned} onChange={handleElectricityReturnedChange} placeholder="0 (kWh)" />
                    </div>

                    <div>
                      <FormHeading>Actual Electricity Consumed</FormHeading>
                      <InputWithSpotlight
                        type="number"
                        disabled={!isEditable}
                        value={actualElectricityConsumed}
                        onChange={(e) => {
                          setActualElectricityConsumed(e.target.value);
                        }}
                        placeholder="(kWh)"
                        readOnly
                      />
                    </div>
                  </div>

                  <div style={{ paddingBottom: '2rem' }}>
                    <FormHeading>Estimation Methodology</FormHeading>
                    <p style={{ paddingBottom: '1rem' }}>
                      Estimation methodology can be self-reported data, utility bills, metering logs (from behind-the-meter devices or PDUs), manufacturing docs (for hardware
                      vendors)
                    </p>
                    <TextAreaWithSpotlight
                      height="var(--textarea-height-regular)"
                      type="textarea"
                      disabled={!isEditable}
                      value={estimationMethodology}
                      onChange={(e) => setEstimationMethodology(e.target.value)}
                      placeholder="Methodology..."
                    />
                  </div>
                </div>
              </Form>
            ) : (
              <div>
                <SuccessScreen message="Thank you for submitting the Electricity Consumption Form. It is being reviewed by our Auditors." />
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
