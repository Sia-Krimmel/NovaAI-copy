'use client';

import * as Utilities from 'common/utilities';

import styles from '@root/components/GridStyles.module.scss';

import { AUDITOR_DASHBOARD_NAVIGATION } from '@root/content/dashboard';
import { AuditorProfile, AuditorProfileDatabase, UserProfileTypeEnum } from '@root/common/types';
import { FormHeading } from '@root/components/typography/forms';
import { updateProfileDataPostgres } from '@root/resolvers/PostgresResolvers';
import { useRouter } from 'next/navigation';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import Checkbox from '@root/components/Checkbox';
import ContentLayout from '@root/components/ContentLayout';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import HeaderText from '@root/components/HeaderText';
import InputWithSpotlight from '@root/components/InputWithspotlight';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React, { useState } from 'react';
import SuccessScreen from '@root/components/SuccessScreen';

export interface AuditorRegistrationForm {
  auditingFirm: string;
  auditorName: string;
  city: string;
  country: string;
  emailAddress: string;
  state: string;
  streetAddress: string;
  zip: string;
}

export default function AuditorRegistrationSection({ sessionKey, userId, profileData }) {
  const [auditingFirm, setAuditingFirm] = useState(profileData?.auditingFirm || '');
  const [auditorFullName, setAuditorFullName] = useState(profileData?.auditorFullName || '');
  const [city, setCity] = useState(profileData?.city || '');
  const [country, setCountry] = useState(profileData?.country || '');
  const [email, setEmail] = useState(profileData?.email || '');
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = useState(profileData?.state || '');
  const [streetAddress, setStreetAddress] = useState(profileData?.streetAddress || '');
  const [success, setSuccess] = useState(false);
  const [zipcode, setZipcode] = useState(profileData?.zipcode || '');
  const [dataConsent, setDataConsent] = useState(profileData?.dataConsent || 'no');
  const router = useRouter();
  const profileType = UserProfileTypeEnum.AUDITOR;
  const dashboard = AUDITOR_DASHBOARD_NAVIGATION;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!dataConsent.trim()) {
      alert('You must agree to the Data Consent');
      return;
    }

    if (!auditorFullName.trim()) {
      alert('You must provide a full name');
      return;
    }

    if (!auditingFirm.trim()) {
      alert('You must provide an auditing firm');
      return;
    }

    if (!email.trim()) {
      alert('You must provide an email');
      return;
    }

    setError(null);

    const profileData: AuditorProfile = {
      profileType,
      email,
      auditingFirm,
      auditorFullName,
      streetAddress,
      country,
      city,
      state,
      zipcode,
      userId,
      dataConsent,
    };

    //Convert formData keys to snake_case for the database
    const profileDataFormatted = Utilities.convertObjectKeysToSnakeCase(profileData) as AuditorProfileDatabase;

    try {
      const { success, result, error } = await updateProfileDataPostgres({
        userId,
        profile: profileDataFormatted,
        sitekey: sessionKey,
      });
      console.log('Response received');

      if (success) {
        setSuccess(true);
        setIsEditMode(false);

        const timer = setTimeout(() => {
          router.push('/auditor-home');
        }, 2000);

        return () => clearTimeout(timer);
      } else {
        console.error('Failed to update and submit the profile form:', error);
        setError(error);
      }

      setLoading(false);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />
      <ContentLayout>
        <PageGutterWrapper>
          <div id="auditor-registration-form">
            <form onSubmit={handleSubmit}>
              {!success ? (
                <div style={{ display: 'grid', rowGap: 'var(--type-scale-8)' }}>
                  <HeaderText title={!isEditMode ? 'Auditor Profile' : 'Edit Auditor Profile'} description="Provide Digital Infrastructure Provider Information:" />

                  <div className={styles.threeColumnGrid} style={{ paddingBottom: '0.5rem' }}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Auditing Firm Name</FormHeading>
                      <InputWithSpotlight
                        type="Auditing Firm"
                        value={auditingFirm}
                        onChange={(e) => setAuditingFirm(e.target.value)}
                        placeholder="Firm Name..."
                        disabled={!isEditMode}
                      />
                    </div>

                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Auditor Full Name</FormHeading>
                      <InputWithSpotlight
                        type="Full Name"
                        value={auditorFullName}
                        onChange={(e) => setAuditorFullName(e.target.value)}
                        placeholder="Full Name..."
                        disabled={!isEditMode}
                      />
                    </div>

                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Email Address</FormHeading>
                      <InputWithSpotlight type="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" disabled={!isEditMode} />
                    </div>
                  </div>

                  <div className={styles.twoColumnGrid} style={{ paddingBottom: '0.5rem' }}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Street Address</FormHeading>
                      <InputWithSpotlight
                        id={'Street Address'}
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="Street Address..."
                        disabled={!isEditMode}
                      />
                    </div>

                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Country</FormHeading>
                      <InputWithSpotlight id={'Country.'} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country..." disabled={!isEditMode} />
                    </div>
                  </div>

                  <div className={styles.threeColumnGrid} style={{ paddingBottom: '1rem' }}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>City</FormHeading>
                      <InputWithSpotlight id={'City'} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City..." disabled={!isEditMode} />
                    </div>

                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>State</FormHeading>
                      <InputWithSpotlight id={'State'} value={state} onChange={(e) => setState(e.target.value)} placeholder="State..." disabled={!isEditMode} />
                    </div>

                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Zip Code</FormHeading>
                      <InputWithSpotlight id={'Zip'} value={zipcode} onChange={(e) => setZipcode(e.target.value)} placeholder="000000" disabled={!isEditMode} />
                    </div>
                  </div>

                  <div style={{ paddingBottom: '1rem' }}>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Data Consent</FormHeading>

                    <Checkbox
                      name="dataConcentChecked"
                      type="checkbox"
                      onChange={(e) => setDataConsent(e.target.checked ? 'yes' : 'no')}
                      value={dataConsent === 'yes'}
                      style={{ marginTop: 16 }}
                    >
                      I consent to the &nbsp;
                      <Button
                        target="_blank"
                        style={ButtonStyleEnum.LINK_GREEN}
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfJSMjXEiY1oAzP0XVcRG85gqeEyPelmc5zSLYsOuNY66QxaQ/viewform"
                      >
                        {' '}
                        data consent clause
                      </Button>
                      for auditing purposes
                    </Checkbox>
                  </div>

                  <div>
                    <span>
                      {isEditMode ? (
                        <Button type="submit" disabled={loading} style={ButtonStyleEnum.SQUARE_GREEN} onClick={handleSubmit}>
                          <span>Submit</span>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditMode(true);
                          }}
                          disabled={loading}
                          style={ButtonStyleEnum.BORDER_BLACK}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <SuccessScreen message="Your Auditor Profile has been updated!" />
              )}
            </form>
          </div>
        </PageGutterWrapper>
      </ContentLayout>
    </div>
  );
}
