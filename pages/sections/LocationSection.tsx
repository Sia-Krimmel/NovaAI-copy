'use client';

import * as Utilities from 'common/utilities';

import gridStyles from '@root/components/GridStyles.module.scss';
import sideNavStyles from '@components/SideNavigaton.module.scss';

import { COUNTRIES_CONTENT } from '@root/content/location-content';
import { FormHeading } from '@root/components/typography/forms';
import { FormTypeEnum, ProviderLocationForm, ProviderLocationFormDatabase, ReviewStatusEnum } from '@root/common/types';
import { updateLocationFormPostgres } from '@root/resolvers/PostgresResolvers';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import Checkbox from '@root/components/Checkbox';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import Form from '@root/components/Form';
import FormMessages from '@root/components/FormMessages';
import HeaderText from '@root/components/HeaderText';
import InputWithSpotlight from '@root/components/InputWithspotlight';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React, { useState } from 'react';
import Select from '@root/components/Select';
import SuccessScreen from '@root/components/SuccessScreen';
import { P } from '@root/components/typography';

export default function LocationSection({ auditor, dashboard, document, profile, profileLocation, menu, userId, documentId, messages, sessionKey, viewer }) {
  const [addressConfirmed, setAddressConfirmed] = useState(document?.addressConfirmed ?? 'no');
  const [createdAt, setCreatedAt] = React.useState(document?.createdAt || '');
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [entityCompany, setEntityCompany] = React.useState(profile?.entityCompany || '');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [providerCity, setProviderCity] = useState(document?.providerCity || '');
  const [providerCountry, setProviderCountry] = useState(document?.providerCountry || profileLocation?.country);
  const [providerLocation, setProviderLocation] = useState(document?.providerLocation || profileLocation?.providerLocation);
  const [providerState, setProviderState] = useState(document?.providerState || profileLocation?.providerState);
  const [providerZipcode, setProviderZipcode] = useState(document?.providerZipcode ?? profileLocation?.providerZipcode);
  const [reviewStatus, setReviewStatus] = React.useState(document?.status || '');
  const [success, setSuccess] = useState(false);
  const [updatedAt, setUpdatedAt] = React.useState(document?.updatedAt || '');

  const formType = FormTypeEnum.LOCATION_INFORMATION;

  const countries = COUNTRIES_CONTENT;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (addressConfirmed.trim() === 'no') {
      alert('Please confirm your address');
      return;
    }

    const now = new Date().toISOString();
    if (!createdAt) {
      setCreatedAt(now);
    }

    setUpdatedAt(now);

    const locationForm: ProviderLocationForm = {
      providerCity,
      providerCountry,
      providerLocation,
      providerZipcode,
      providerState,
      addressConfirmed,
      entityCompany,
      createdAt,
      updatedAt,
      status: ReviewStatusEnum.IN_REVIEW,
    };

    //Convert data keys to snake_case for the database
    const locationFormFormatted = Utilities.convertObjectKeysToSnakeCase(locationForm) as ProviderLocationFormDatabase;

    try {
      const { success, result, error } = await updateLocationFormPostgres({
        locationInformation: locationFormFormatted,
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

  const handleReSubmit = () => {
    setSuccess(false);
    setReviewStatus(ReviewStatusEnum.IN_PROGRESS);
  };

  const isEditable = !auditor;

  const backLink = `/evp-process/${documentId}`;
  const nextLink = `/evp-process/hardware-configuration/${documentId}`;

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
          <div id="profile-form" style={{ minHeight: '70vh', paddingTop: '1rem' }}>
            {reviewStatus !== ReviewStatusEnum.IN_REVIEW || auditor ? (
              <Form handleSubmit={handleSubmit} style={{ minHeight: '60vh' }} backLink={backLink} nextLink={nextLink} auditor={auditor} success={success}>
                {!success || auditor ? (
                  <div style={{ display: 'grid', rowGap: 'var(--type-scale-8)', paddingBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <HeaderText
                        title={'Location Information'}
                        description={
                          'Please confirm or edit the location information for which <strong style="color:var(--theme-color-text)">  you want to be audited</strong> for.'
                        }
                      />

                      {/* {!auditor && (
                        <span>
                          <Button style={ButtonStyleEnum.BORDER_BLACK}>Edit</Button>
                        </span>
                      )} */}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '0.2rem' }}>
                      {/* {createdAt && <FormHeading>Created At: {Utilities.toDateISOString(createdAt)}</FormHeading>} */}

                      {updatedAt && <FormHeading>Modified At: {Utilities.toDateISOString(updatedAt)}</FormHeading>}
                    </div>
                    <div className={gridStyles.twoColumnGrid}>
                      <div>
                        <FormHeading>Provider Location / Address</FormHeading>
                        <InputWithSpotlight
                          type="text"
                          value={providerLocation}
                          onChange={(e) => setProviderLocation(e.target.value)}
                          placeholder="Provider Address..."
                          disabled={!isEditable}
                          isForm
                        />
                      </div>
                      <div>
                        <FormHeading>Provider Country</FormHeading>

                        <Select type="select" disabled={!isEditable} isForm value={providerCountry} onChange={(e) => setProviderCountry(e.target.value)} options={countries} />
                      </div>
                    </div>

                    <div className={gridStyles.threeColumnGrid}>
                      <div>
                        <FormHeading>Provider City</FormHeading>
                        <InputWithSpotlight
                          isForm
                          type="text"
                          value={providerCity}
                          onChange={(e) => setProviderCity(e.target.value)}
                          placeholder="City..."
                          disabled={!isEditable}
                        />
                      </div>
                      <div>
                        <FormHeading>Provider State</FormHeading>
                        <InputWithSpotlight
                          isForm
                          type="text"
                          value={providerState}
                          onChange={(e) => setProviderState(e.target.value)}
                          placeholder="State..."
                          disabled={!isEditable}
                        />
                      </div>
                      <div>
                        <FormHeading>Provider Zip Code / Postal Code</FormHeading>
                        <InputWithSpotlight
                          isForm
                          type="number"
                          value={providerZipcode}
                          onChange={(e) => setProviderZipcode(e.target.value)}
                          placeholder="00000"
                          disabled={!isEditable}
                        />
                      </div>
                    </div>
                    <FormHeading style={{ paddingTop: '1rem' }}>
                      Please write your prefered entity company for this EVP report. <br />
                      Otherwise leave it as the default company from your profile page.
                    </FormHeading>

                    <div className={gridStyles.threeColumnGrid}>
                      <div>
                        <FormHeading>Entity Company</FormHeading>

                        <InputWithSpotlight
                          type="text"
                          value={entityCompany}
                          onChange={(e) => setEntityCompany(e.target.value)}
                          placeholder="Entity Company..."
                          disabled={!isEditable}
                          isForm
                        />
                      </div>
                    </div>
                    <Checkbox
                      name="spAddress"
                      type="checkbox"
                      onChange={(e) => setAddressConfirmed(e.target.checked ? 'yes' : 'no')}
                      value={addressConfirmed === 'yes'}
                      style={{ marginTop: 16 }}
                      disabled={!isEditable}
                    >
                      <span style={{ color: 'var(--theme-color-form-text)' }}> I confirm this is the address I would like to be audited for.</span>
                    </Checkbox>
                  </div>
                ) : (
                  <SuccessScreen message="Your location information for which you want to be audited for has been updated!" />
                )}
              </Form>
            ) : (
              <div>
                <SuccessScreen message="Thank you for submitting the Location Information Form. It is being reviewed by our Auditors." />

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
