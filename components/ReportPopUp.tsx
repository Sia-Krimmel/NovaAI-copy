import styles from '@components/ReportPopUp.module.scss';

import { classNames } from '@root/common/utilities';
import { P } from './typography';
import AttachmentSVG from './svgs/AttachmentSVG';
import Button, { ButtonStyleEnum } from './Button';
import CloseXIconSVG from './svgs/CloseXIconSVG';
import GreenScoreCard from './GreenScoreCard';

export function ReportPopUp({ currentData, isOpen, onClose, style }: any) {
  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <section className={styles.eventStyle}>
      <div className={styles.popup} style={{ backgroundColor: styles.backgroundColor ?? 'var(--color-white)' }}>
        <div className={styles.header}>
          <div>
            <P className={styles.eventName} style={{ paddingBottom: '0.5rem' }}>
              Energy Validation Process
            </P>
            <p>Findings & Recommendations</p>
          </div>

          <Button style={ButtonStyleEnum.CIRCLE_BORDER_BLACK} type="button" onClick={(e) => handleCloseClick(e)}>
            <CloseXIconSVG />
          </Button>
        </div>

        <div className={styles.scheduleContainer}>
          <section className={styles.eventDetails}>
            <p className={styles.time}>
              <strong style={{ color: 'var(--theme-color-accent)' }}>Digital Infrastructure Provider Name:</strong> INT DEV
            </p>

            <p className={styles.time}>
              <strong style={{ color: 'var(--theme-color-accent)' }}>Location:</strong> Worldwide
            </p>

            <p className={styles.time}>
              <strong style={{ color: 'var(--theme-color-accent)' }}>Audit Date:</strong> March, 2024
            </p>
          </section>

          <p style={{ paddingBottom: '8px' }}>Summary</p>

          <div style={{ paddingBottom: '32px' }}>
            <p style={{ paddingBottom: '16px' }}>
              Thank you for completing the Nova Energy Validation Process (EVP). We recognize the dedication necessary to complete the EVP, and we appreciate your commitment to
              providing this level of transparency into your energy use. Your EVP results and attached documents have been reviewed and validated against our environmental impact
              matrix and Green Score methodology.
              <br /> <br />
              This EVP includes reported nodeIDs
              <strong>G011111, G011111</strong>
            </p>

            <p style={{ paddingBottom: '16px' }}>How would you like to download the report? </p>
            <Button style={ButtonStyleEnum.BORDER_BLACK} type="button" target="_blank" href="/reports/test">
              <div style={{ display: 'flex', gap: '8px' }}>
                <AttachmentSVG /> <p>Download the Report in PDF</p>
              </div>
            </Button>
          </div>

          <p style={{ paddingBottom: '16px' }}>Audit Outputs</p>

          <div>
            <div className={` ${styles.tableHeader}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', width: '100%' }}>
              <p className={` ${styles.headerTitle}`}>Green Score Criteria</p>
              <p className={`${styles.headerTitle}`}>Data Inputs</p>
            </div>
          </div>

          <div className={styles.gridContainer2Cols} style={{ paddingBottom: '24px' }}>
            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>SP Name</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>INT DEV</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>NodeIDs</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>G011111, G011111</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Location</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>Worldwide</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Reporting Period Start</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>03/01/24</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Reporting Period End</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>09/30/23</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>SP Actual Net Power Consumed (kWh)</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>100,000</p>
            </div>
            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>SP Renewable Energy Consumption Total (kWh)</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>124,075</p>
            </div>
            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>SP Renewable Energy Consumption Total (kWh)</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>10.732</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>
                SP Average Data Storage Capacity Over Reporting Time Period (PiB)
              </p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>100,000,000</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>
                Estimate Cumulative Netwwork Energy Use for Reporting Time Period (PiB)
              </p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>11,000.12</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Network Average Renewable Energy Purchases (kWh)</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>0</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>SP Grid Ave Emissions Factor gCO2/kW</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>233</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>
                Global Average Grid Emissions Factor from OurWorldInData (gCO2/kWh)
              </p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>436</p>
            </div>
            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>SP Marginal Emissions Factor gCO2/kWh</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>503</p>
            </div>

            <div className={styles.row}>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Global Average Marginal Emissions Factor (gCO2/kWh)</p>
              <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>we</p>
            </div>
          </div>

          <div style={{ paddingBottom: '24px' }}>
            <div className={` ${styles.tableHeader}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', width: '100%' }}>
              <p className={` ${styles.headerTitle}`}>Your Green Score Results</p>
            </div>
            <div className={styles.gridContainer2Cols}>
              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Emissions Score</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>1.000</p>
              </div>

              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Location Score</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>1.000</p>
              </div>
              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Confidence Score</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>0.950</p>
              </div>
              <div className={styles.row}>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight, styles.borderLeft)}>Green Score</p>
                <p className={classNames(styles.columnContainer, styles.reportTitles, styles.borderRight)}>98.333</p>
              </div>
            </div>
          </div>

          <div className={styles.gridContainer2Cols}>
            <div className={styles.row}>
              <GreenScoreCard />
            </div>
          </div>
        </div>
        <p className={styles.tooltip}>Scroll down to see report details</p>
      </div>
    </section>
  );
}
