'use client';
import styles from '@components/HeroTwo.module.scss';

import { H2, Label, P } from './typography';
import { PARTNER_LOGOS_TWO_CONTENT } from '@root/content/homepage-two';
import { useState } from 'react';
import Button, { ButtonStyleEnum } from './Button';
import InputWithSpotlight from './InputWithspotlight';
import LightningSVG from './svgs/LightningSVG';
import PageGutterWrapper from './PageGutterWrapper';
import PartnersTwo from './PartnersTwo';
import StarsSVG from './svgs/StarsSVG';

export default function HeroTwo() {
  const partnerLogos = PARTNER_LOGOS_TWO_CONTENT;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('You must provide an email, or we will not be able to reach you');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/airtable/waitlist', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        console.log('success');
      } else {
        console.error('Failed to submit the form');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageGutterWrapper>
        <div className={styles.container}>
          <div className={styles.textContainer}>
            <div className={styles.heading}>
              <Label style={{ color: 'var(--color-white-blue)' }}>Energy Monitoring</Label>
              <H2 style={{ color: 'var(--color-white-blue)' }}>Charting paths to a cleaner digital future.</H2>
            </div>
            <P className={styles.description}>Our solutions monitor and mitigate the environmental impact of web3 nodes, AI models, & data center operations.</P>

            <form className={styles.ctaRow} onSubmit={handleSubmit}>
              {!success ? (
                <>
                  <InputWithSpotlight type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." color="inherit" />
                  <Button style={ButtonStyleEnum.SQUARE_GREEN} withArrow={true}>
                    <span style={{ color: 'var(--cololor-black)' }}>Join Waitlist</span>
                  </Button>
                </>
              ) : (
                <div className={styles.formSuccess}>
                  <StarsSVG alt="star-icon" className={styles.successStarIcon} />
                  <p>Thank you for signing up!</p>
                </div>
              )}
            </form>
          </div>

          {/* <LightningSVG className={styles.image} /> */}
          <img className={styles.image} src="/media/chrome-transformed.png" />
        </div>
        <div className={styles.partners}>
          <PartnersTwo partnerLogos={partnerLogos} />
        </div>
      </PageGutterWrapper>
    </>
  );
}
