'use client';
import * as Utilities from 'common/utilities';

import formStyles from '@root/components/FormStyle.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';
import sideNavStyles from '@components/SideNavigaton.module.scss';
import styles from '@root/components/GridStyles.module.scss';

import { FormHeading } from '@root/components/typography/forms';
import { FormTypeEnum, RenewableEnergyProduced, RenewableEnergyProducedDatabase, ReviewStatusEnum } from '@root/common/types';
import { NOVA_ENERGY_DOMAIN, onUploadData } from '@root/common/files';
import { updateEnergyProductionFormPostgres } from '@root/resolvers/PostgresResolvers';
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

const renewableEnergyUsageOptions = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];

export default function RenewableEnergyProducedSection({ auditor, userId, dashboard, document, messages, menu, sessionKey, viewer, documentId }) {
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [renewableEnergyUsage, setRenewableEnergyUsage] = useState(document?.renewableEnergyUsage || renewableEnergyUsageOptions[0].value);
  const [frequencyOfMesurement, setFrequencyOfMesurement] = useState(document?.frequencyOfMesurement || '');
  const [inspectionDate, setInspectionDate] = useState(document?.inspectionDate || '');
  const [inspectionFiles, setInspectionFiles] = React.useState(document?.purchaseFiles || []);
  const [installationDate, setInstallationDate] = useState(document?.installationDate || '');
  const [loading, setLoading] = React.useState<boolean>(false);

  const [methodOfMesurement, setMethodOfMesurement] = useState(document?.methodOfMesurement || '');
  const [numberOfSolarPanels, setNumberOfSolarPanels] = useState(document?.numberOfSolarPanels || '');
  const [purchaseFiles, setPurchaseFiles] = React.useState(document?.purchaseFiles || []);
  const [solarPanelBrand, setSolarPanelBrand] = useState(document?.solarPanelBrand || '');
  const [solarPanelModalNumber, setSolarPanelModalNumber] = useState(document?.solarPanelModalNumber || '');
  const [solarWattPeak, setSolarWattPeak] = useState(document?.solarWattPeak || '');
  const [totalElectricityControlled, setTotalElectricityControlled] = useState(document?.totalElectricityControlled || '');
  const [createdAt, setCreatedAt] = React.useState(document?.createdAt || '');
  const [updatedAt, setUpdatedAt] = React.useState(document?.updatedAt || '');

  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = React.useState<boolean>(false);

  const [reviewStatus, setReviewStatus] = React.useState(document?.status ?? '');

  const formType = FormTypeEnum.RENEWABLE_ENERGY_PRODUCED;
  const domain = NOVA_ENERGY_DOMAIN;

  const inspectionFilesRef = useRef<HTMLInputElement>(null);
  const purchaseFilesRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (renewableEnergyUsage === renewableEnergyUsageOptions[1].value) {
      if (!installationDate.trim()) {
        alert('Please provide your installation date ');
        return;
      }
      if (!inspectionDate.trim()) {
        alert('Please provide your inspection date ');
        return;
      }

      if (!solarWattPeak) {
        alert('Please write the Total Solar Watt Peak ');
        return;
      }
      if (!totalElectricityControlled) {
        alert('Please write the total amount of electricity (in MWh) produced from electricity generation facilities');
        return;
      }
    }

    const renewableEnergyProducedForm: RenewableEnergyProduced = {
      frequencyOfMesurement,
      inspectionDate,
      installationDate,
      solarWattPeak,
      numberOfSolarPanels,
      solarPanelBrand,
      inspectionFiles,
      methodOfMesurement,
      renewableEnergyUsage,
      solarPanelModalNumber,
      purchaseFiles,
      totalElectricityControlled,
      createdAt,
      updatedAt,
      status: ReviewStatusEnum.IN_REVIEW,
    };

    //Convert data keys to snake_case for the database
    const renewableEnergyProducedFormFormatted = Utilities.convertObjectKeysToSnakeCase(renewableEnergyProducedForm) as RenewableEnergyProducedDatabase;

    try {
      const { success, result, error } = await updateEnergyProductionFormPostgres({
        energyProduction: renewableEnergyProducedFormFormatted,
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

  const handleInspectionFileClick = () => {
    if (inspectionFilesRef.current) {
      inspectionFilesRef.current.click();
    }
  };

  const handlePurchaseFileClick = () => {
    if (purchaseFilesRef.current) {
      purchaseFilesRef.current.click();
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

  const handlePurchaseFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, setPurchaseFiles);
      e.target.value = null; // Reset the input to allow new uploads
    } else {
      console.log('No file selected or file input reset');
    }
  };

  const handleInspectionFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, setInspectionFiles);
      e.target.value = null;
    }
  };

  const handleReSubmit = () => {
    setSuccess(false);
    setReviewStatus(ReviewStatusEnum.IN_PROGRESS);
  };

  const isEditable = !auditor;

  const backLink = '/evp-process';
  const nextLink = `/renewable-energy-procurement/${documentId}`;

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
          <div id="renewable-energy-consumption-form">
            {(reviewStatus !== ReviewStatusEnum.IN_REVIEW && !success) || auditor ? (
              <Form auditor={auditor} handleSubmit={handleSubmit} style={{ minHeight: '60vh' }} backLink={backLink} nextLink={nextLink} success={success}>
                <div style={{ display: 'grid', rowGap: 'var(--type-scale-8)' }}>
                  <HeaderText title="Renewable Energy Produced" description="Provide Renewable Energy Produced Information" />

                  <div style={{ paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '0.2rem' }}>
                      {updatedAt && <FormHeading>Modified At: {Utilities.toDateISOString(updatedAt)}</FormHeading>}

                      {/* {createdAt && <FormHeading>Created At: {Utilities.toDateISOString(createdAt)}</FormHeading>} */}
                    </div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Do you generate renewable energy to power Digital Infrastructure Provider Operations?</FormHeading>

                    <Select
                      type="select"
                      style={{ marginTop: 8 }}
                      onChange={(e) => setRenewableEnergyUsage(e.target.value)}
                      options={renewableEnergyUsageOptions}
                      value={renewableEnergyUsage}
                      disabled={!isEditable}
                    />
                  </div>
                  {renewableEnergyUsage === renewableEnergyUsageOptions[1].value && (
                    <>
                      <div className={styles.twoColumnGrid} style={{ paddingBottom: '0.5rem' }}>
                        <div style={{ width: '100%' }}>
                          <FormHeading>Renewable Energy Installation Date</FormHeading>
                          <DatePicker disabled={!isEditable} id={'start-date'} value={installationDate} onChange={(e) => setInstallationDate(e.target.value)} />
                        </div>

                        <div style={{ width: '100%' }}>
                          <FormHeading>Renewable Energy Inspection Date</FormHeading>
                          <DatePicker disabled={!isEditable} id={'end-date'} value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} />
                        </div>
                      </div>

                      <div className={styles.twoColumnGrid} style={{ paddingBottom: '0.5rem' }}>
                        <div>
                          <FormHeading style={{ paddingBottom: '0.5rem' }}> Total Solar Watt Peak</FormHeading>
                          <InputWithSpotlight disabled={!isEditable} type="text" value={solarWattPeak} onChange={(e) => setSolarWattPeak(e.target.value)} placeholder="(kWp)" />
                        </div>

                        <div>
                          <FormHeading style={{ paddingBottom: '0.5rem' }}> Number of Solar Panels</FormHeading>
                          <InputWithSpotlight
                            disabled={!isEditable}
                            type="text"
                            value={numberOfSolarPanels}
                            onChange={(e) => setNumberOfSolarPanels(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className={styles.twoColumnGrid} style={{ paddingBottom: '0.5rem' }}>
                        <div>
                          <FormHeading style={{ paddingBottom: '0.5rem' }}>Solar Panel Brand</FormHeading>
                          <InputWithSpotlight
                            disabled={!isEditable}
                            type="text"
                            value={solarPanelBrand}
                            onChange={(e) => setSolarPanelBrand(e.target.value)}
                            placeholder="Brand Name..."
                          />
                        </div>

                        <div>
                          <FormHeading style={{ paddingBottom: '0.5rem' }}>Solar Panel Model Number</FormHeading>
                          <InputWithSpotlight
                            type="text"
                            disabled={!isEditable}
                            value={solarPanelModalNumber}
                            onChange={(e) => setSolarPanelModalNumber(e.target.value)}
                            placeholder="Enter a modal number..."
                          />
                        </div>
                      </div>

                      <div className={styles.twoColumnGrid} style={{ paddingBottom: '0.5rem' }}>
                        <div>
                          <FormHeading style={{ paddingBottom: '0.5rem' }}>Method of Measurement</FormHeading>
                          <InputWithSpotlight
                            disabled={!isEditable}
                            type="text"
                            value={methodOfMesurement}
                            onChange={(e) => setMethodOfMesurement(e.target.value)}
                            placeholder="Mesurement method..."
                          />
                        </div>

                        <div>
                          <FormHeading style={{ paddingBottom: '0.5rem' }}>Frequency of Measurement</FormHeading>
                          <InputWithSpotlight
                            disabled={!isEditable}
                            type="text"
                            value={frequencyOfMesurement}
                            onChange={(e) => setFrequencyOfMesurement(e.target.value)}
                            placeholder="Frequency..."
                          />
                        </div>
                      </div>

                      <div style={{ paddingBottom: '0.5rem' }}>
                        <FormHeading style={{ paddingBottom: '0.5rem' }}>Scope 1 (Controlled) Electricity Production</FormHeading>
                        <p style={{ paddingBottom: '0.5rem', maxWidth: '75ch' }}>
                          Please specify the total amount of electricity (in megawatt-hours, MWh) produced from electricity generation facilities that your operations control
                          during the reporting period. <br />
                          <br />
                          If your operations do not control any electricity generation facilities, please enter '0'
                        </p>
                        <div className={styles.twoColumnGrid}>
                          <InputWithSpotlight
                            disabled={!isEditable}
                            type="text"
                            value={totalElectricityControlled}
                            onChange={(e) => setTotalElectricityControlled(e.target.value)}
                            placeholder="Total amount of electricity (MWh)..."
                          />
                        </div>
                      </div>
                      <div style={{ paddingBottom: '2rem' }}>
                        <FormHeading className={formStyles.formHeading}>Upload supporting documentation</FormHeading>

                        <FormHeading className={formStyles.formHeading}>Inspection documentation or certificates </FormHeading>
                        <div style={{ paddingBottom: '1rem' }} className={gridStyles.threeColumnGrid}>
                          {inspectionFiles?.map((fileURL, index) => {
                            return (
                              <FormUpload
                                key={`inspection-file-${index}`}
                                loading={uploading}
                                fileURL={fileURL}
                                width="100%"
                                disabled={!isEditable}
                                onRemove={() => setInspectionFiles((prev) => prev.filter((_, i) => i !== index))}
                              />
                            );
                          })}
                          <EmptyFileUpload onClick={handleInspectionFileClick} width="100%" disabled={!isEditable} />
                          <input type="file" ref={inspectionFilesRef} style={{ display: 'none' }} onChange={handleInspectionFileChange} disabled={!isEditable} />
                        </div>

                        <FormHeading className={formStyles.formHeading}>Solar Panel Purchase Receipts / Documentations</FormHeading>

                        <div className={gridStyles.threeColumnGrid}>
                          {purchaseFiles?.map((fileURL, index) => {
                            return (
                              <FormUpload
                                key={`purchase-file-${index}`}
                                loading={uploading}
                                fileURL={fileURL}
                                width="100%"
                                onRemove={() => setPurchaseFiles((prev) => prev.filter((_, i) => i !== index))}
                              />
                            );
                          })}
                          <EmptyFileUpload onClick={handlePurchaseFileClick} width="100%" disabled={!isEditable} />
                          <input type="file" ref={purchaseFilesRef} style={{ display: 'none' }} onChange={handlePurchaseFileChange} disabled={!isEditable} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            ) : (
              <div>
                <SuccessScreen message="Thank you for submitting the  Renewable Energy Produced Form. It is being reviewed by our Auditors." />
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
