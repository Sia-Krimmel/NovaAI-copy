import * as Utilities from 'common/utilities';

import { FormHeading } from './typography/forms';
import { useRouter } from 'next/navigation';
import Button from './Button';
import GlobalModalManager from './modals/GlobalModalManager';
import Input from './Input';
import NovaEnergyLogo from './NovaEnergyLogo';
import Page from './Page';
import React, { useState } from 'react';
import SuccessScreen from './SuccessScreen';
import ThinAppLayout from './layouts/ThinAppLayout';

export default function VerifyAuditor({ sessionKey, auditorCode, userId }) {
  const [auditorLoginKey, setAuditorLoginKey] = useState<string>('');
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const verifyAuditorKey = async (auditorLoginKey, auditorCode) => {
    return auditorLoginKey === auditorCode;
  };

  const signIn = async () => {
    setLoading(true);
    const isPasswordCorrect = await verifyAuditorKey(auditorLoginKey, auditorCode);
    setLoading(false);

    if (isPasswordCorrect) {
      setSuccess(true);
      router.push('/auditor-profile');
    } else {
      console.log('error!', isPasswordCorrect);
      setErrorMessage('Invalid Auditor Login Key. Please try again.');
    }
  };

  return (
    <Page>
      <ThinAppLayout>
        {success ? (
          <SuccessScreen message="You have successfuly authenticated!" />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <NovaEnergyLogo />
              <FormHeading>Please Provider Your Auditor Key</FormHeading>
            </div>
            <div style={{ paddingBottom: '1.2rem' }}>
              <Input
                onChange={(e) => setAuditorLoginKey(e.target.value)}
                placeholder="Auditor Login Key"
                name="Login Key"
                style={{ marginTop: 8, marginBottom: 8 }}
                type="password"
                value={auditorLoginKey}
              />
            </div>
            <Button styles={{ width: '100%', border: '1px solid black' }} loading={loading} onClick={signIn}>
              Verify
            </Button>
            {errorMessage && <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-error)', marginTop: 10 }}>{errorMessage}</p>}
          </>
        )}
      </ThinAppLayout>
      <GlobalModalManager currentModal={currentModal} setModal={setModal} onHandleThemeChange={Utilities.onHandleThemeChange} />
    </Page>
  );
}
