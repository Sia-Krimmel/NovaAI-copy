import '@root/global.scss';
import styles from '@components/Authentication.module.scss';

import React, { useState, useEffect } from 'react';

import * as Utilities from 'common/utilities';

import { FormHeading, FormParagraph, InputLabel } from '@components/typography/forms';
import { Label, P } from './typography';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useAddress } from '@components/AddressContext';
import { useRouter } from 'next/navigation';
import { useUser } from '@components/UserContext';
import Button, { ButtonStyleEnum } from '@components/Button';
import Cookies from 'js-cookie';
import GlobalModalManager from '@root/components/modals/GlobalModalManager';
import Input from '@components/Input';
import Link from 'next/link';
import NovaEnergyGreenSVG from './svgs/NovaEnergyGreenSVG';
import Page from '@components/Page';
import PageGutterWrapper from './PageGutterWrapper';
import SignInWithWeb3 from './SignInWithWeb3';
import SuccessScreen from './SuccessScreen';
import NovaLogoSVG from './svgs/NovaLogoSVG';

// Registers a user's Metamask wallet for the first time if they've never done it before
async function register({ email, password, address }) {
  let result;
  const domain = 'novaenergy.ai';

  const REQUEST_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch('https://api-nova.onrender.com/api/users/authenticate', {
      method: 'POST',
      headers: REQUEST_HEADERS,
      body: JSON.stringify({ email, domain, password, wallet_address: address }),
    });
    result = await response.json();
  } catch (e) {
    console.log(e, 'error');
    return null;
  }

  if (!result) {
    return null;
  }

  if (!result.user) {
    return null;
  }
  return result;
}

export default function AuthenticateAuditor(props) {
  const [currentError, setError] = useState<string | null>(null);
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const { user, setUser } = useUser();
  const [email, setEmail] = useState<string>('');
  const [key, setKey] = React.useState<string>('');
  const [userId, setUserId] = React.useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const { address } = useAddress();
  const router = useRouter();

  let signer;

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        router.push('auditor/verify');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, router]);

  return (
    <Page>
      <div className={styles.twoColumns}>
        <img src="/media/hills.png" className={styles.image} />

        <div className={styles.columnTwo}>
          <PageGutterWrapper>
            <NovaLogoSVG color="var(--color-black)" className={styles.logo} />

            <div className={styles.authentication}>
              {user ? (
                <SuccessScreen message="You have successfuly signed in!" showBorder={false} />
              ) : (
                <div className={styles.signInContainer}>
                  {props?.viewer ? (
                    <>
                      <div className={styles.header}>
                        <FormHeading style={{ fontSize: 'var(--type-scale-3)', color: 'var(--color-black)' }}>{props?.modalTitle || 'Welcome Back'}</FormHeading>
                        <Label>Provider</Label>
                      </div>
                      <div style={{ paddingTop: '8px' }}>
                        <P style={{ color: 'var(--color-grey200)', paddingBottom: '16px' }}>Your session is currently in progress.</P>
                        <div style={{ paddingBottom: '8px' }}>
                          <Button
                            onClick={async () => {
                              router.push('auditor/verify');
                            }}
                            style={ButtonStyleEnum.SQUARE_BLACK}
                            styles={{ width: '100%' }}
                            loading={loading}
                          >
                            Go to My Dashboard
                          </Button>
                        </div>
                        <Button
                          style={ButtonStyleEnum.SQUARE_SECONDARY}
                          styles={{ width: '100%' }}
                          loading={loading}
                          onClick={async () => {
                            Cookies.remove('sitekey');
                            window.location.reload();
                          }}
                        >
                          Log Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.header}>
                        <FormHeading style={{ fontSize: 'var(--type-scale-3)', color: 'var(--color-black)' }}>{props?.modalTitle || 'Log In'}</FormHeading>
                        <Label>Auditor</Label>
                      </div>
                      <Label style={{ marginTop: 48 }}>E-mail</Label>
                      <Input
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        style={{ marginTop: 8, marginBottom: '0.8rem' }}
                        type="text"
                        placeholder="Your e-mail"
                        value={email}
                      />
                      <Label style={{ marginTop: 24 }}>Password</Label>
                      <Input
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        name="password"
                        style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                        type="password"
                        value={password}
                      />
                      <ThirdwebSDKProvider activeChain={'ethereum'} signer={signer} clientId="6c008bdcd6760736ab3ffcd4deb713dd">
                        <SignInWithWeb3 />
                      </ThirdwebSDKProvider>
                      {currentError && <FormParagraph style={{ marginTop: 8 }}>{currentError}</FormParagraph>}
                      <div style={{ paddingBottom: '0.5rem' }}>
                        <Button style={ButtonStyleEnum.SQUARE_SECONDARY} href="https://api-nova.onrender.com/authenticate-google" styles={{ width: '100%' }}>
                          Connect with Google
                        </Button>
                      </div>
                      <Button
                        style={ButtonStyleEnum.SQUARE_BLACK}
                        styles={{ width: '100%' }}
                        loading={loading}
                        onClick={async () => {
                          if (Utilities.isEmpty(email)) {
                            setModal({
                              name: 'ERROR',
                              message: 'You must provide an e-mail.',
                            });
                            return;
                          }

                          if (Utilities.isEmpty(password)) {
                            setModal({
                              name: 'ERROR',
                              message: 'You must provide a password.',
                            });
                            return;
                          }

                          if (password.length < 4) {
                            setModal({
                              name: 'ERROR',
                              message: 'You must use at least 4 characters for your password.',
                            });
                            return;
                          }

                          setLoading(true);
                          const response = await register({ email, password, address });
                          setLoading(false);
                          if (!response) {
                            setModal({
                              name: 'ERROR',
                              message: 'Authentication Error. Please try again.',
                            });
                            return;
                          }
                          setUser(response.user);
                          setKey(response.user.key);
                          Cookies.set('sitekey', response.user.key, { secure: true });
                          Cookies.set('userId', response.user.id, { secure: true });
                        }}
                      >
                        Log In
                      </Button>
                      {/* {props?.signUp ? <></> : <P className={styles.forgotPassword}>Forgot Password?</P>} */}
                    </>
                  )}
                </div>
              )}
            </div>
          </PageGutterWrapper>
          {props?.signUp ? (
            <Link href="auditor-signup" className={styles.signup} style={{ paddingTop: '2rem' }}>
              <P className={styles.signup}>
                Need an account? <span style={{ borderBottom: '1px solid black' }}>Sign up</span>
              </P>
            </Link>
          ) : (
            <Link href="auditor-login" className={styles.signup} style={{ paddingTop: '2rem' }}>
              <P className={styles.signup}>
                Have an account? <span style={{ borderBottom: '1px solid black' }}>Log In</span>
              </P>
            </Link>
          )}
        </div>
      </div>
      <GlobalModalManager currentModal={currentModal} setModal={setModal} onHandleThemeChange={Utilities.onHandleThemeChange} />
    </Page>
  );
}
