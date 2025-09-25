'use client';

import * as Utilities from 'common/utilities';

import styles from '@components/HardwareSection.module.scss';
import gridStyles from '@root/components/GridStyles.module.scss';
import sideNavStyles from '@components/SideNavigaton.module.scss';
import formStyles from '@root/components/FormStyle.module.scss';

import { FormHeading } from '@root/components/typography/forms';
import { FormTypeEnum, Hardware, HardwareConfigurationDatabase, HardwareForm, ReviewStatusEnum } from '@root/common/types';
import { NOVA_ENERGY_DOMAIN, onUploadData } from '@root/common/files';
import { updateHardwareFormPostgres } from '@root/resolvers/PostgresResolvers';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import Form from '@root/components/Form';
import FormMessages from '@root/components/FormMessages';
import FormUpload, { EmptyFileUpload } from '@root/components/FormUpload';
import HeaderText from '@root/components/HeaderText';
import InputWithSpotlight from '@root/components/InputWithspotlight';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React, { useState } from 'react';
import SuccessScreen from '@root/components/SuccessScreen';

export default function HardwareSection({ auditor, dashboard, documentId, menu, messages, viewer, document, sessionKey }: any) {
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [reviewStatus, setReviewStatus] = useState(document?.status ?? '');
  const [createdAt, setCreatedAt] = React.useState(document?.createdAt || '');
  const [updatedAt, setUpdatedAt] = React.useState(document?.updatedAt || '');

  const defaultHardwareItem: Hardware = {
    hardwareType: '',
    description: '',
    hardwareDetails: '',
    supportingFile: [],
  };

  const [hardware, setHardware] = useState(() => {
    if (document?.hardware && document.hardware.length > 0) {
      return document.hardware.map((item) => ({
        hardwareType: item.hardware_type || '',
        description: item.description || '',
        hardwareDetails: item.hardware_details || '',
        supportingFile: Array.isArray(item.supporting_file) ? item.supporting_file : [item.supporting_file].filter(Boolean), // Ensure it's an array
      }));
    } else {
      return [defaultHardwareItem];
    }
  });

  const domain = NOVA_ENERGY_DOMAIN;
  const formType = FormTypeEnum.HARDWARE_CONFIGURATION;

  const handleAddSection = () => {
    const newSection = {
      hardwareType: '',
      description: '',
      hardwareDetails: '',
      supportingFile: [],
    };
    const newHardware = [...hardware, newSection];
    setHardware(newHardware);
  };

  const handleRemoveSection = (index) => {
    setHardware(hardware.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index, field, value) => {
    const updatedSections = hardware.map((section, i) => {
      if (i === index) {
        return { ...section, [field]: value };
      }
      return section;
    });
    setHardware(updatedSections);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    if (!createdAt) {
      setCreatedAt(now);
    }
    setUpdatedAt(now);

    const formattedHardware = hardware.map(Utilities.convertObjectKeysToSnakeCase);

    const hardwareConfigurationForm: HardwareForm = {
      hardware: formattedHardware,
      status: ReviewStatusEnum.IN_REVIEW,
      createdAt,
      updatedAt,
    };

    const hardwareConfigurationFormFormatted = Utilities.convertObjectKeysToSnakeCase(hardwareConfigurationForm) as HardwareConfigurationDatabase;

    try {
      const { success, result, error } = await updateHardwareFormPostgres({
        hardwareConfiguration: hardwareConfigurationFormFormatted,
        sessionKey,
        documentId,
      });

      if (success) {
        setSuccess(true);
        console.log(success, 'success!');
      } else {
        console.error('Failed to update and submit the hardware configuration form:', error);
      }

      setLoading(false);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEditable = !auditor;

  // function handleSetSupportingFile(index, fileURL) {
  //   setSupportingFiles((prevFiles) => ({
  //     ...prevFiles,
  //     [index]: fileURL,
  //   }));
  // }

  const handleSetSupportingFile = (index, fileURL) => {
    setHardware((prevHardware) => {
      const updatedHardware = [...prevHardware];
      const updatedSupportingFile = [...updatedHardware[index].supportingFile, fileURL];
      updatedHardware[index] = { ...updatedHardware[index], supportingFile: updatedSupportingFile };
      return updatedHardware;
    });
  };

  const handleReSubmit = () => {
    setSuccess(false);
    setReviewStatus(ReviewStatusEnum.IN_PROGRESS);
  };

  const backLink = `/evp-process/${documentId}`;
  const nextLink = `/evp-process/water-consumption/${documentId}`;

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
          {(reviewStatus !== ReviewStatusEnum.IN_REVIEW && !success) || auditor ? (
            <Form auditor={true} handleSubmit={handleSubmit} style={{ minHeight: '60vh' }} backLink={backLink} nextLink={nextLink} success={success}>
              <div className={styles.titleContainer}>
                <HeaderText title="Hardware Configuration" description="Add information about your hardware configuration" />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '0.2rem' }}>
                {/* {createdAt && <FormHeading>Created At: {Utilities.toDateISOString(createdAt)}</FormHeading>} */}

                {updatedAt && <FormHeading>Modified At: {Utilities.toDateISOString(updatedAt)}</FormHeading>}
              </div>
              <div style={{ paddingBottom: '2rem' }}>
                <div className={styles.hardwareTableContainer}>
                  <div className={styles.tableStyle}>
                    <div className={styles.tr}>
                      <div className={styles.name}>Hardware Configuration</div>
                      <div className={styles.cta}>
                        <Button type="button" onClick={handleAddSection} className={styles.addButton} style={ButtonStyleEnum.SQUARE_BLACK}>
                          Add +
                        </Button>
                      </div>
                    </div>

                    {hardware.map((section, index) => {
                      return (
                        <React.Fragment key={index}>
                          <HardwareConfigurationSection
                            index={index}
                            auditor={auditor}
                            hardwareItem={section}
                            handleUpdateSection={handleUpdateSection}
                            setUploading={setUploading}
                            setSupportingFile={(fileURL) => handleSetSupportingFile(index, fileURL)}
                            uploading={uploading}
                            setModal={setModal}
                            domain={domain}
                            sessionKey={sessionKey}
                            isEditable={isEditable}
                          />
                          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--theme-color-border)' }}>
                            {hardware.length > 1 && index !== 0 && (
                              <Button onClick={() => handleRemoveSection(index)} className={styles.deleteButton} style={ButtonStyleEnum.CIRCLE_BORDER_BLACK}>
                                Delete
                              </Button>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Form>
          ) : (
            <div>
              <SuccessScreen message="Thank you for submitting the Hardware Configuration Form. It is being reviewed by our Auditors." />
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
        </PageGutterWrapper>
        <FormMessages formType={formType} documentId={documentId} messages={messages} sessionKey={sessionKey} setModal={setModal} viewer={viewer} />
      </div>
    </div>
  );
}

function HardwareConfigurationSection({ auditor, isEditable, hardwareItem, index, handleUpdateSection, setUploading, setSupportingFile, uploading, setModal, domain, sessionKey }) {
  const handleAddFileClick = () => {
    const fileInput: any = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (event) => {
      const file: any = event.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    fileInput.click();
  };

  const handleFileUpload = async (file) => {
    setUploading(true);

    const response = await onUploadData({ file, domain, key: sessionKey, setModal });
    if (!response) {
      setUploading(false);
      return;
    }

    if (response.error) {
      setUploading(false);
      setModal({ name: 'ERROR', message: response.message });
      return;
    }

    setUploading(false);
    setSupportingFile(response.fileURL);
  };

  return (
    <section style={{ padding: '0.5rem 1rem' }}>
      <div className={gridStyles.twoColumnGrid} style={{ paddingBottom: '0.5rem' }}>
        <div>
          <FormHeading>Hardware Type</FormHeading>
          <InputWithSpotlight
            width="40%"
            height="48px"
            placeholder="Type of hardware..."
            type="textarea"
            isForm
            value={hardwareItem.hardwareType}
            onChange={(e) => handleUpdateSection(index, 'hardwareType', e.target.value)}
            disabled={!isEditable}
          />
        </div>

        <div>
          <FormHeading>Description</FormHeading>
          <InputWithSpotlight
            width="40%"
            isForm
            placeholder="Description..."
            height="48px"
            type="textarea"
            value={hardwareItem.description}
            onChange={(e) => handleUpdateSection(index, 'description', e.target.value)} // Update via handleUpdateSection
            disabled={!isEditable}
          />
        </div>
      </div>
      <div style={{ paddingBottom: '0.5rem' }}>
        <FormHeading>Additional details about your hardware</FormHeading>
        <InputWithSpotlight
          isForm
          width="40%"
          placeholder="Additional details..."
          height="48px"
          type="textarea"
          value={hardwareItem.hardwareDetails}
          disabled={!isEditable}
          onChange={(e) => handleUpdateSection(index, 'hardwareDetails', e.target.value)} // Update via handleUpdateSection
        />
      </div>
      <div>
        <FormHeading>Upload receipts and attestation documents to verify claims and photo / video evidence to further verify claims.</FormHeading>
        <div className={styles.formUploads}>
          {hardwareItem.supportingFile.length > 0 &&
            hardwareItem.supportingFile.map((fileURL, fileIndex) => (
              <FormUpload
                key={`hardware-${index}-${fileIndex}`}
                loading={uploading}
                fileURL={fileURL}
                width="100%"
                disabled={!isEditable}
                onRemove={() => {
                  if (isEditable) {
                    setSupportingFile(
                      index,
                      hardwareItem.supportingFile.filter((_, i) => i !== fileIndex)
                    );
                  }
                }}
              />
            ))}
          {!auditor && <EmptyFileUpload onClick={handleAddFileClick} width="100%" disabled={!isEditable} />}
        </div>
      </div>
    </section>
  );
}
