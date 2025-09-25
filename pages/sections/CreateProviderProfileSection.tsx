'use client';

import gridStyles from '@root/components/GridStyles.module.scss';

import { convertObjectKeysToSnakeCase } from '@root/common/utilities';
import { FormHeading } from '@root/components/typography/forms';
import { ProviderTypeEnum, ProviderProfile, ProviderProfileDatabase, UserProfileTypeEnum } from '@root/common/types';
import { updateProfileDataPostgres } from '@root/resolvers/PostgresResolvers';
import { useRouter } from 'next/navigation';
import Button, { ButtonStyleEnum } from '@root/components/Button';
import CardWithAddedItems from '@root/components/CardWithAddedItems';
import Checkbox from '@root/components/Checkbox';
import ContentLayout from '@root/components/ContentLayout';
import HeaderText from '@root/components/HeaderText';
import InputWithSpotlight from '@root/components/InputWithspotlight';
import NovaLogoSVG from '@root/components/svgs/NovaLogoSVG';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React, { useState } from 'react';
import Select from '@root/components/Select';
import SuccessScreen from '@root/components/SuccessScreen';

const options = [
  { value: ProviderTypeEnum.FILECOIN_SP, label: 'Filecoin SP' },
  { value: ProviderTypeEnum.ICP_NODE_OPERATOR, label: 'ICP Node Operator' },
  { value: ProviderTypeEnum.ETH_VALIDATOR, label: 'ETH Validator' },
  { value: ProviderTypeEnum.SOLANA_VALIDATOR, label: 'Solana Validator' },
  { value: ProviderTypeEnum.BTC_MINER, label: 'BTC Miner' },
];

export default function CreateProviderProfileSection({ userId, sitekey, profileData }) {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fullName, setFullName] = useState('');
  const [state, setState] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [success, setSuccess] = useState(false);
  const [zipcode, setZipcode] = useState('');
  const [dataConsent, setDataConsent] = useState('no');
  const [emailConsent, setEmailConsent] = useState('no');
  const [minerIds, setMinerIds] = useState([]);
  const [providerType, setProviderType] = useState('');
  const [ipcNodeMachineId, setIPCNodeMachineId] = useState('');
  const [ipcNodePrincipleId, setIpcNodePrincipleId] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [solanaAddress, setSolanaAddress] = useState('');
  const [btcMinerAddress, setBTCMinerAddress] = useState('');
  const [entityCompany, setEntityCompany] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!dataConsent.trim()) {
      alert('You must agree to the Data Consent');
      return;
    }
    if (!email.trim()) {
      alert('You must provide an email');
      return;
    }
    if (!fullName.trim()) {
      alert('You must provide a name');
      return;
    }

    let providerDetails;

    switch (providerType) {
      case ProviderTypeEnum.ETH_VALIDATOR:
        providerDetails = { type: providerType, eth_address: ethAddress };
        break;
      case ProviderTypeEnum.SOLANA_VALIDATOR:
        providerDetails = { type: providerType, solana_address: solanaAddress };
        break;
      case ProviderTypeEnum.BTC_MINER:
        providerDetails = { type: providerType, btc_address: btcMinerAddress };
        break;
      case ProviderTypeEnum.ICP_NODE_OPERATOR:
        providerDetails = {
          type: providerType,
          node_principle_id: ipcNodePrincipleId,
          node_machine_id: ipcNodeMachineId,
        };
        break;
      case ProviderTypeEnum.FILECOIN_SP:
        providerDetails = { type: providerType, minerIds };
        break;
      default:
        providerDetails = {};
    }

    const provider = providerDetails;

    const profileData: ProviderProfile = {
      city,
      country,
      dataConsent,
      email,
      emailConsent,
      fullName,
      minerIds,
      profileType: UserProfileTypeEnum.PROVIDER,
      provider,
      state,
      streetAddress,
      zipcode,
      entityCompany,
    };

    // Convert formData keys to snake_case for the database
    const profileDataFormatted = convertObjectKeysToSnakeCase(profileData) as ProviderProfileDatabase;

    const { success, result, error } = await updateProfileDataPostgres({
      userId,
      profile: profileDataFormatted,
      sitekey,
    });

    if (success) {
      setSuccess(true);
      router.push('/home');
    } else {
      console.error('Failed to submit the profile form:', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <PageGutterWrapper>
        <ContentLayout>
          <NovaLogoSVG />
          <div id="profile-form" style={{ minHeight: '100vh' }}>
            <form onSubmit={handleSubmit}>
              {!success ? (
                <div style={{ display: 'grid', rowGap: 'var(--type-scale-8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <HeaderText title={'Create My Digital Infrastructure Provider Profile'} description={'Please provide your provider information'} />
                  </div>

                  <div className={gridStyles.twoColumnGrid}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Full Name</FormHeading>
                      <InputWithSpotlight type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Name..." />
                    </div>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Email</FormHeading>
                      <InputWithSpotlight type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." />
                    </div>
                  </div>

                  <div className={gridStyles.twoColumnGrid}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Street Address</FormHeading>
                      <InputWithSpotlight type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Address..." />
                    </div>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Country</FormHeading>
                      <InputWithSpotlight type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country..." />
                    </div>
                  </div>
                  <FormHeading style={{ paddingTop: '1.2rem', paddingBottom: '0.5rem', maxWidth: '70ch' }}>
                    Please write your preferred <strong>Entity Company </strong>that would be used by default for all your Energy Validation Process reports. <br /> <br />
                    If you have multiple entity companies to complete the EVP for, you can specify them in each EVP report as well.
                  </FormHeading>
                  <div className={gridStyles.twoColumnGrid}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Entity Company</FormHeading>
                      <InputWithSpotlight type="text" value={entityCompany} onChange={(e) => setEntityCompany(e.target.value)} placeholder="Entity Company..." />
                    </div>
                  </div>

                  <div className={gridStyles.threeColumnGrid}>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>City</FormHeading>
                      <InputWithSpotlight type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City..." />
                    </div>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>State</FormHeading>
                      <InputWithSpotlight type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State..." />
                    </div>
                    <div>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Zip Code / Postal Code</FormHeading>
                      <InputWithSpotlight type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)} placeholder="00000" />
                    </div>
                  </div>
                  <section style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
                    <HeaderText title="Select Your Provider Type" />
                    <div className={gridStyles.twoColumnGrid}>
                      <div>
                        <FormHeading style={{ paddingBottom: '0.5rem' }}>Select your Provider Type from the dropdown</FormHeading>

                        <Select value={providerType} onChange={(e) => setProviderType(e.target.value)} options={options} />
                      </div>

                      <div>
                        {providerType === ProviderTypeEnum.ETH_VALIDATOR && (
                          <div>
                            <FormHeading style={{ paddingBottom: '0.5rem' }}>Please provide ETH Validator Address</FormHeading>
                            <InputWithSpotlight type="text" value={ethAddress} onChange={(e) => setEthAddress(e.target.value)} placeholder="ETH Address..." />
                          </div>
                        )}
                        {providerType === ProviderTypeEnum.SOLANA_VALIDATOR && (
                          <div>
                            <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide Solana Validator Address</FormHeading>
                            <InputWithSpotlight type="text" value={solanaAddress} onChange={(e) => setSolanaAddress(e.target.value)} placeholder="Solana Address..." />
                          </div>
                        )}
                        {providerType === ProviderTypeEnum.BTC_MINER && (
                          <div>
                            <div>
                              <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide BTC Miner Address</FormHeading>
                              <InputWithSpotlight type="text" value={btcMinerAddress} onChange={(e) => setBTCMinerAddress(e.target.value)} placeholder="BTC Miner Address..." />
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
                        <InputWithSpotlight type="text" value={ipcNodeMachineId} onChange={(e) => setIPCNodeMachineId(e.target.value)} placeholder="IPC Node Machine ID..." />
                      </div>
                      <div>
                        <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide ICP Node Principle Id</FormHeading>
                        <InputWithSpotlight type="text" value={ipcNodePrincipleId} onChange={(e) => setIpcNodePrincipleId(e.target.value)} placeholder="Node Principle ID..." />
                      </div>
                    </section>
                  )}

                  {providerType === ProviderTypeEnum.FILECOIN_SP && (
                    <section>
                      <FormHeading style={{ paddingBottom: '0.5rem' }}>Provide Node IDs</FormHeading>

                      <CardWithAddedItems minerIds={minerIds} setMinerIds={setMinerIds} />
                    </section>
                  )}

                  <section style={{ paddingBottom: '16px' }}>
                    <HeaderText title="Data Consent" />
                    <Checkbox
                      name="dataConcentChecked"
                      type="checkbox"
                      onChange={(e) => setDataConsent(e.target.checked ? 'yes' : 'no')}
                      value={dataConsent === 'yes'}
                      style={{ marginTop: 16 }}
                    >
                      I have read and agree to the &nbsp;
                      <Button
                        target="_blank"
                        style={ButtonStyleEnum.LINK_GREEN}
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfJSMjXEiY1oAzP0XVcRG85gqeEyPelmc5zSLYsOuNY66QxaQ/viewform"
                      >
                        {' '}
                        data consent clause
                      </Button>
                    </Checkbox>
                    <Checkbox
                      name="emailChecked"
                      type="checkbox"
                      onChange={(e) => setEmailConsent(e.target.checked ? 'yes' : 'no')}
                      value={emailConsent === 'yes'}
                      style={{ marginTop: 16 }}
                    >
                      Optional: Email me about weekly updates, our newsletter or other offers. You can subscribe at any time!
                    </Checkbox>
                  </section>

                  <span style={{ paddingBottom: '96px' }}>
                    <Button style={ButtonStyleEnum.SQUARE_GREEN} onClick={handleSubmit}>
                      Create My Profile
                    </Button>
                  </span>
                </div>
              ) : (
                <SuccessScreen message="Your Digital Infrastructure Provider Profile has Been Created!" />
              )}
            </form>
          </div>
        </ContentLayout>
      </PageGutterWrapper>
    </div>
  );
}
