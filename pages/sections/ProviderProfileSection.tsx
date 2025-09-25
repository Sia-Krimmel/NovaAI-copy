'use client';

import * as Utilities from 'common/utilities';

import gridStyles from '@root/components/GridStyles.module.scss';

import { COUNTRIES_CONTENT } from '@root/content/location-content';
import { DASHBOARD_NAVIGATION } from '@root/content/dashboard';
import { FormHeading } from '@root/components/typography/forms';
import { ProviderTypeEnum, ProviderProfile, ProviderProfileDatabase, UserProfileTypeEnum } from '@root/common/types';
import { updateProfileDataPostgres } from '@root/resolvers/PostgresResolvers';
import { useRouter } from 'next/navigation';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import CardWithAddedItems from '@root/components/CardWithAddedItems';
import Checkbox from '@root/components/Checkbox';
import ContentLayout from '@root/components/ContentLayout';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import HeaderText from '@root/components/HeaderText';
import InputWithSpotlight from '@root/components/InputWithspotlight';
import React, { useState } from 'react';
import Select from '@root/components/Select';
import SuccessScreen from '@root/components/SuccessScreen';

interface ProviderProfileSection {
  profileData: ProviderProfile | null;
  userId: string | null;
  sitekey: string | null;
}

const options = [
  { value: ProviderTypeEnum.FILECOIN_SP, label: 'Filecoin SP' },
  { value: ProviderTypeEnum.ICP_NODE_OPERATOR, label: 'ICP Node Operator' },
  { value: ProviderTypeEnum.ETH_VALIDATOR, label: 'ETH Validator' },
  { value: ProviderTypeEnum.SOLANA_VALIDATOR, label: 'Solana Validator' },
  { value: ProviderTypeEnum.BTC_MINER, label: 'BTC Miner' },
];

export default function ProviderProfileSection({ userId, sitekey, profileData }) {
  const [btcMinerAddress, setBTCMinerAddress] = useState(profileData?.provider?.btc_miner_address || '');
  const [city, setCity] = useState(profileData?.city || '');
  const [country, setCountry] = useState(profileData?.country || '');
  const [email, setEmail] = useState(profileData?.email || '');
  const [emailConsent, setEmailConsent] = useState(profileData?.emailConsent || false);
  const [error, setError] = useState(null);
  const [ethAddress, setEthAddress] = useState(profileData?.provider?.eth_address || '');
  const [fullName, setFullName] = useState(profileData?.fullName || '');
  const [ipcNodeMachineId, setIPCNodeMachineId] = useState(profileData?.provider?.node_machine_id || '');
  const [ipcNodePrincipleId, setIpcNodePrincipleId] = useState(profileData?.provider?.node_principle_id || '');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [minerIds, setMinerIds] = useState(profileData?.minerIds || []);
  const [provider, setProvider] = useState(profileData?.provider || {});
  const [providerCity, setProviderCity] = useState(profileData?.providerCity || '');
  const [providerCountry, setProviderCountry] = useState(profileData?.providerCountry || '');
  const [providerLocation, setProviderLocation] = useState(profileData?.providerLocation || '');
  const [providerState, setProviderState] = useState(profileData?.providerState || '');
  const [providerType, setProviderType] = useState(profileData?.provider || ProviderTypeEnum.FILECOIN_SP);
  const [providerZipcode, setProviderZipcode] = useState(profileData?.providerZipcode || '');
  const [solanaAddress, setSolanaAddress] = useState(profileData?.provider?.solana_address || '');
  const [state, setState] = useState(profileData?.state || '');
  const [streetAddress, setStreetAddress] = useState(profileData?.streetAddress || '');
  const [entityCompany, setEntityCompany] = useState(profileData?.entityCompany || '');

  const [success, setSuccess] = useState(false);
  const [zipcode, setZipcode] = useState(profileData?.zipcode || '');
  const router = useRouter();

  const profileType = profileData?.profileType ? profileData?.provider?.type : UserProfileTypeEnum.PROVIDER;
  const dashboard = DASHBOARD_NAVIGATION;
  const existingUserRecord = userId && sitekey ? true : false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let providerDetails;

    switch (providerType) {
      case ProviderTypeEnum.ETH_VALIDATOR:
        providerDetails = { type: ProviderTypeEnum.ETH_VALIDATOR, eth_address: ethAddress };
        break;
      case ProviderTypeEnum.SOLANA_VALIDATOR:
        providerDetails = { type: ProviderTypeEnum.SOLANA_VALIDATOR, solana_address: solanaAddress };
        break;
      case ProviderTypeEnum.BTC_MINER:
        providerDetails = { type: ProviderTypeEnum.BTC_MINER, btc_address: btcMinerAddress };
        break;
      case ProviderTypeEnum.ICP_NODE_OPERATOR:
        providerDetails = {
          type: ProviderTypeEnum.ICP_NODE_OPERATOR,
          node_principle_id: ipcNodePrincipleId,
          node_machine_id: ipcNodeMachineId,
        };
        break;
      case ProviderTypeEnum.FILECOIN_SP:
        providerDetails = { type: ProviderTypeEnum.FILECOIN_SP, minerIds };
        break;
      default:
        providerDetails = { type: UserProfileTypeEnum.PROVIDER };
    }

    const provider = providerDetails;

    const profileData: ProviderProfile = {
      city,
      country,
      email,
      fullName,
      state,
      streetAddress,
      zipcode,
      emailConsent,
      profileType,
      provider,
      minerIds,
      entityCompany,
    };

    //Convert formData keys to snake_case for the database
    const profileDataFormatted = Utilities.convertObjectKeysToSnakeCase(profileData) as ProviderProfileDatabase;

    try {
      const { success, result, error } = await updateProfileDataPostgres({
        userId,
        profile: profileDataFormatted,
        sitekey,
      });

      if (success) {
        setSuccess(true);
        setIsEditMode(false);
        const timer = setTimeout(() => {
          router.push('/home');
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

  const countries = COUNTRIES_CONTENT;

  return (
    <div>
      <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />
      <ContentLayout>
        <div id="profile-form" style={{ minHeight: '100vh' }}>
          <form onSubmit={handleSubmit}>
            {!success ? (
              <div style={{ display: 'grid', rowGap: 'var(--type-scale-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <HeaderText
                    title={!isEditMode && existingUserRecord !== null ? 'My Profile' : 'Edit Profile'}
                    description={!isEditMode && existingUserRecord !== null ? '' : 'Please provide your Digital Infrastructure Provider Information'}
                  />
                  <span>
                    {isEditMode ? (
                      <Button type="submit" disabled={loading || !isEditMode} style={ButtonStyleEnum.BORDER_BLACK}>
                        Submit
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
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div className={gridStyles.twoColumnGrid}>
                  <div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Full Name</FormHeading>
                    <InputWithSpotlight
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Name..."
                      disabled={!isEditMode && existingUserRecord !== null}
                    />
                  </div>
                  <div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Email</FormHeading>
                    <InputWithSpotlight
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email..."
                      disabled={!isEditMode && existingUserRecord !== null}
                    />
                  </div>
                </div>
                <div className={gridStyles.twoColumnGrid}>
                  <div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Street Address</FormHeading>
                    <InputWithSpotlight
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Address..."
                      disabled={!isEditMode && existingUserRecord !== null}
                    />
                  </div>
                  <div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Country</FormHeading>

                    <Select
                      type="select"
                      disabled={!isEditMode && existingUserRecord !== null}
                      isForm
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      options={countries}
                    />
                  </div>
                </div>
                <section className={gridStyles.threeColumnGrid} style={{ paddingBottom: '1rem' }}>
                  <div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>City</FormHeading>
                    <InputWithSpotlight
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City..."
                      disabled={!isEditMode && existingUserRecord !== null}
                    />
                  </div>
                  <div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>State</FormHeading>
                    <InputWithSpotlight
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State..."
                      disabled={!isEditMode && existingUserRecord !== null}
                    />
                  </div>
                  <div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Zip Code / Postal Code</FormHeading>
                    <InputWithSpotlight
                      type="text"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      placeholder="00000"
                      disabled={!isEditMode && existingUserRecord !== null}
                    />
                  </div>
                </section>
                <FormHeading style={{ paddingTop: '1.2rem', paddingBottom: '0.5rem', maxWidth: '70ch' }}>
                  Please write your preferred <strong>Entity Company </strong>that would be used by default for all your Energy Validation Process reports. <br /> <br />
                  If you have multiple entity companies to complete the EVP for, you can specify them in each EVP report as well.
                </FormHeading>
                <div className={gridStyles.twoColumnGrid} style={{ paddingBottom: '1rem' }}>
                  <div>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Entity Company</FormHeading>

                    <div>
                      <InputWithSpotlight
                        type="text"
                        value={entityCompany}
                        onChange={(e) => setEntityCompany(e.target.value)}
                        placeholder="Entity Name"
                        disabled={!isEditMode && existingUserRecord !== null}
                      />
                    </div>
                  </div>
                </div>
                <section style={{ paddingBottom: '1rem' }}>
                  <HeaderText title="Select Your Provider Type" />
                  <div className={gridStyles.twoColumnGrid}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Please select your Provider Type from the dropdown</FormHeading>

                      <Select value={providerType} onChange={(e) => setProviderType(e.target.value)} options={options} disabled={!isEditMode && existingUserRecord !== null} />
                    </div>

                    <div>
                      {providerType === ProviderTypeEnum.ETH_VALIDATOR && (
                        <div>
                          <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide ETH Validator Address</FormHeading>
                          <InputWithSpotlight
                            type="text"
                            value={ethAddress}
                            onChange={(e) => setEthAddress(e.target.value)}
                            placeholder="ETH Address..."
                            disabled={!isEditMode && existingUserRecord !== null}
                          />
                        </div>
                      )}
                      {providerType === ProviderTypeEnum.SOLANA_VALIDATOR && (
                        <div>
                          <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide Solana Validator Address</FormHeading>
                          <InputWithSpotlight
                            type="text"
                            value={solanaAddress}
                            onChange={(e) => setSolanaAddress(e.target.value)}
                            placeholder="Solana Address..."
                            disabled={!isEditMode && existingUserRecord !== null}
                          />
                        </div>
                      )}
                      {providerType === ProviderTypeEnum.BTC_MINER && (
                        <div>
                          {' '}
                          <div>
                            <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide BTC Miner Address</FormHeading>
                            <InputWithSpotlight
                              type="text"
                              value={btcMinerAddress}
                              onChange={(e) => setBTCMinerAddress(e.target.value)}
                              placeholder="BTC Miner Address..."
                              disabled={!isEditMode && existingUserRecord !== null}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {providerType === ProviderTypeEnum.ICP_NODE_OPERATOR && (
                  <section className={gridStyles.twoColumnGrid}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide ICP Node Machine Id</FormHeading>
                      <InputWithSpotlight
                        type="text"
                        value={ipcNodeMachineId}
                        onChange={(e) => setIPCNodeMachineId(e.target.value)}
                        placeholder="IPC Node Machine ID..."
                        disabled={!isEditMode && existingUserRecord !== null}
                      />
                    </div>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide ICP Node Principle Id</FormHeading>
                      <InputWithSpotlight
                        type="text"
                        value={ipcNodePrincipleId}
                        onChange={(e) => setIpcNodePrincipleId(e.target.value)}
                        placeholder="Node Principle ID..."
                        disabled={!isEditMode && existingUserRecord !== null}
                      />
                    </div>
                  </section>
                )}

                {providerType === ProviderTypeEnum.FILECOIN_SP && (
                  <section>
                    <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide Node IDs</FormHeading>

                    <CardWithAddedItems minerIds={minerIds} setMinerIds={setMinerIds} disabled={!isEditMode && existingUserRecord !== null} />
                  </section>
                )}

                <section style={{ paddingBottom: '80px' }}>
                  <Checkbox
                    name="emailChecked"
                    disabled={!isEditMode && existingUserRecord !== null}
                    onChange={(e) => setEmailConsent(e.target.checked)}
                    value={emailConsent}
                    style={{ marginTop: 16 }}
                  >
                    Optional: Email me about weekly updates, our newsletter or other offers. You can subscribe at any time!
                  </Checkbox>
                </section>
              </div>
            ) : (
              <SuccessScreen message="Your Digital Infrastructure Provider Profile is Updated!" />
            )}
          </form>
        </div>
      </ContentLayout>
    </div>
  );
}
