'use client';
import styles from './PricingGrid.module.scss';

import { H2, H3, P, Title } from './typography';
import Button, { ButtonStyleEnum } from './Button';
import CheckMarkItem from './CheckmarkItem';

export default function PricingGrid() {
  return (
    <div style={{ color: 'var(--color-white-blue)', background: 'var(--color-black)' }}>
      <header className={styles.header}>
        <section className={styles.top}>
          <H2 style={{ color: 'var(--color-white-blue)' }}>Get access to our offering</H2>
          <P style={{ marginTop: `1rem`, maxWidth: '768px', color: 'var(--color-white-blue)' }}>
            <a className={styles.link} href="https://novaenergy.ai">
              Nova Energy
            </a>{' '}
            invites you to use all of our services. Those services include Energy Validation Process (EVP) with tailored insights and recommendations, verified by auditors, energy
            monitoring, and environmental reporting.
          </P>
        </section>
      </header>
      <div className={styles.row}>
        <div className={styles.container}>
          <div className={styles.column}>
            <div className={styles.content}>
              <Title>Starter</Title>
              <P style={{ marginTop: 16, minHeight: 156 }}>Get up and running with basic Energy Monitoring and Environmental Reporting.</P>
              <H3 style={{ marginTop: 24, paddingBottom: 48 }}>
                $20 USD<span className={styles.subtle}>/mo</span>
              </H3>
              {/* {props.viewer ? (
                <Button visual style={{ height: 48, marginTop: 24, width: '100%' }}>
                  Already obtained
                </Button>
              ) : ( */}
              <Button onClick={() => alert('Coming soon!')} style={ButtonStyleEnum.SQUARE_GREEN} styles={{ width: '100%' }}>
                Sign up
              </Button>
              {/* )} */}
              <div>
                <CheckMarkItem>Access to Nova Energy's energy monitoring dashboard.</CheckMarkItem>
                <CheckMarkItem>Monthly environmental impact reports.</CheckMarkItem>
                <CheckMarkItem>Alerts and notifications for energy usage.</CheckMarkItem>
                <CheckMarkItem>Basic support and onboarding assistance.</CheckMarkItem>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <Title>Plus</Title>
              <P style={{ marginTop: 16, minHeight: 156 }}>Granular Energy Validation Process (EVP) with tailored insights and recommendations, verified by auditors.</P>
              <H3 style={{ marginTop: 24, paddingBottom: 48 }}>
                $350 USD<span className={styles.subtle}>/EVP</span>
              </H3>
              {/* {props.viewer ? (
                props.viewer.level >= 20 ? (
                  <Button>Already obtained</Button>
                ) : (
                  <Button
                    href={`https://buy.stripe.com/28og0B2f9eIj8Io9AA?prefilled_email=${props.viewer.email}`}
                    // style={{ height: 48, marginTop: 24, width: '100%' }}
                    target="_blank"
                  >
                    Get started
                  </Button>
                )
              ) : ( */}
              <Button onClick={() => alert('Coming soon!')} style={ButtonStyleEnum.SQUARE_GREEN} styles={{ width: '100%' }}>
                Sign up
              </Button>
              {/* )} */}

              <div>
                <CheckMarkItem>All features in the Starter plan.</CheckMarkItem>
                <CheckMarkItem>Detailed and granular energy consumption analytics.</CheckMarkItem>
                <CheckMarkItem>Customized insights and sustainability recommendations.</CheckMarkItem>
                <CheckMarkItem>Verified energy usage reports by third-party auditors.</CheckMarkItem>
                <CheckMarkItem>Access to advanced data visualization tools.</CheckMarkItem>
                <CheckMarkItem>Priority support and onboarding assistance.</CheckMarkItem>
                <CheckMarkItem>Suitable for web3 node operators.</CheckMarkItem>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <Title>Business</Title>
              <P style={{ marginTop: 16, minHeight: 156 }}>Granular Energy Validation Process (EVP) with tailored insights and recommendations, verified by auditors.</P>
              <H3 style={{ marginTop: 24, paddingBottom: 48 }}>
                $750 USD<span className={styles.subtle}>/EVP</span>
              </H3>
              <Button onClick={() => alert('Coming soon!')} style={ButtonStyleEnum.SQUARE_GREEN} styles={{ width: '100%' }}>
                Sign Up
              </Button>

              <div>
                <CheckMarkItem>All features in the Plus plan.</CheckMarkItem>
                <CheckMarkItem>Advanced integrations with AI models and systems.</CheckMarkItem>
                <CheckMarkItem>Enhanced reporting capabilities for AI-driven operations.</CheckMarkItem>
                <CheckMarkItem>Customized consultancy sessions for optimizing energy usage.</CheckMarkItem>
                <CheckMarkItem>Regular audits and compliance checks.</CheckMarkItem>
                <CheckMarkItem>Access to a dedicated account manager.</CheckMarkItem>
                <CheckMarkItem>Suitable for businesses utilizing AI models.</CheckMarkItem>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <Title>Enterprise</Title>
              <P style={{ marginTop: 16, minHeight: 156 }}>Granular Energy Monitoring and Environmental Reporting, tailored to enterprise colocation data center operators.</P>
              <H3 style={{ opacity: 0, marginTop: 24, visibility: 'hidden', paddingBottom: 48 }}>Let's Talk</H3>
              <Button href="mailto:support@novaenergy.ai" style={ButtonStyleEnum.SQUARE_GREEN} styles={{ width: '100%' }}>
                Contact Us
              </Button>

              <div>
                <CheckMarkItem>All features in the Business plan.</CheckMarkItem>
                <CheckMarkItem>Fully customized energy monitoring solutions.</CheckMarkItem>
                <CheckMarkItem>Tailored environmental impact and sustainability strategies.</CheckMarkItem>
                <CheckMarkItem>On-site audits and consultations.</CheckMarkItem>
                <CheckMarkItem>Integration with enterprise systems and data centers.</CheckMarkItem>
                <CheckMarkItem>Comprehensive support and dedicated team for implementation.</CheckMarkItem>
                <CheckMarkItem>Flexible pricing based on specific enterprise needs and scale.</CheckMarkItem>
                <CheckMarkItem>Assistance in meeting Environmental Reporting requirements.</CheckMarkItem>
                <CheckMarkItem>Ideal for large-scale data center operators and enterprises.</CheckMarkItem>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.subRow}>
          <div className={styles.subRowContent}>
            <P style={{ marginTop: 16 }}>
              <i>
                <strong>٭ Data</strong> — By uploading data through our service, you consent to our{' '}
                <a href="/privacy-policy" className={styles.link} target="_blank">
                  Privacy Policy
                </a>
                .
              </i>
            </P>
          </div>
        </div>
      </div>
    </div>
  );
}
