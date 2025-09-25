'use client';
import styles from '@components/GreenscoreAuditInput.module.scss';

import Button, { ButtonStyleEnum } from './Button';
import GreenscoreCalculationForm from './GreenscoreCalculationForm';
import GreenscoreResult from './GreenscoreResult';
import HeaderText from './HeaderText';

export default function GreenscoreAuditInput({ greenscores, document, documentId, providerProfile, sessionKey, locationInformation }: any) {
  return (
    <section className={styles.eventStyle}>
      <div className={styles.popup} style={{ paddingTop: '2rem', backgroundColor: styles.backgroundColor ?? 'var(--color-white)' }}>
        {greenscores?.length > 0 ? (
          <section>
            <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <HeaderText title="Greenscore Results" />
            </div>
            <div className={styles.greenscoreResults} style={{ paddingBottom: '3rem' }}>
              {greenscores?.map((item, index) => {
                const greenscore = item?.greenscore ?? null;

                const constructReportHref = () => {
                  const prefixItem = '';
                  return `/${prefixItem}report/${documentId}`;
                };

                return (
                  <div>
                    <GreenscoreResult
                      key={index}
                      date={item.date}
                      locationScore={greenscore.locationScore}
                      greenScore={greenscore.greenScore}
                      emissionsScore={greenscore.emissionsScore}
                      confidenceScore={greenscore.confidenceScore}
                    />

                    <div className={styles.buttonRow}>
                      <Button style={ButtonStyleEnum.SQUARE_BLACK} href={constructReportHref()} target={'_blank'}>
                        View EVP Report
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <GreenscoreCalculationForm
            document={document}
            documentId={documentId}
            greenscores={greenscores}
            locationInformation={locationInformation}
            providerProfile={providerProfile}
            sessionKey={sessionKey}
          />
        )}
      </div>
    </section>
  );
}
