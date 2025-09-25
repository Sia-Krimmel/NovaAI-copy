'use client';

import styles from '@components/Table.module.scss';

import { classNames, toDateISOString } from '@root/common/utilities';
import {
  AuditReviewDatabase,
  DocumentType,
  ElectricityConsumptionFormDatabase,
  HardwareFormDatabase,
  ProviderLocationFormDatabase,
  RenewableEnergyProducedDatabase,
  ReviewStatusEnum,
} from '@root/common/types';
import { calculateCompletionFraction, changeColorBasedOnCompletion } from '@root/resolvers/HelperResolvers';
import { P } from './typography';
import { useRouter } from 'next/navigation';
import AttachmentSVG from './svgs/AttachmentSVG';
import formatEVPReportDocument from '@root/resolvers/PostgresResolvers';
import React, { useRef, useState } from 'react';
import { calculateNextEVPProcess } from '@root/common/helpers';

interface TableProps {
  title: string;
  length: any;
  allDocuments: Array<{
    data: AuditDocumentsDatabase;
  }>;
  messagesInDocuments: any;
}

interface AuditDocumentsDatabase {
  audit_document: {
    audit_review: AuditReviewDatabase;
    audit_status: ReviewStatusEnum;
    created_at: string;
    electricity_consumption: ElectricityConsumptionFormDatabase;
    energy_production: RenewableEnergyProducedDatabase;
    hardware_configuration: HardwareFormDatabase;
    location_information: ProviderLocationFormDatabase;
    preliminary_results_rec_matching: any; //todo
    renewable_energy_procurement: RenewableEnergyProducedDatabase;
    submitted_at: string | null;
    type: DocumentType.EVP_DOCUMENT;
    updated_at: string;
    user_id: string;
  };
}

function changeColorBasedOnStatus(status) {
  switch (status) {
    case ReviewStatusEnum.APPROVED:
      return { color: 'var(--theme-color-accent)' };
    case ReviewStatusEnum.COMPLETE:
      return { color: 'var(--theme-color-accent)' };
    default:
      return { color: 'var(--color-text)' };
  }
}

export function calculateCompletionPercentage(evpReport) {
  // List of forms to check for emptiness
  const forms = [
    'water_consumption',
    'electricity_consumption',
    'renewable_energy_procurement',
    'energy_production',
    'location_information',
    'preliminary_results_rec_matching',
    'hardware_configuration',
  ];

  let completionCount = 0;

  // Check each form; if it is not empty, increment the completion count
  forms?.forEach((form) => {
    if (Object.keys(evpReport[form] || {}).length !== 0) {
      completionCount += 1;
    }
  });

  const completionPercentage = (completionCount / forms.length) * 100;

  return completionPercentage.toFixed(0) + '%';
}

const Table: React.FC<TableProps> = ({ title, allDocuments, messagesInDocuments, length }: any) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const router = useRouter();

  const maxRecordsPerPage = 5;
  const totalPages = Math.ceil(length / maxRecordsPerPage);

  const start = currentPage * maxRecordsPerPage;
  const end = start + maxRecordsPerPage;
  const documents: any = allDocuments?.slice(start, end);

  const updatePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updateNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleOverlayClick = () => {
    setIsOverlayOpen(false);
  };

  const handlePopupClose = (e) => {
    setSelectedEvent(null);
    setIsOverlayOpen(false);
    window.history.pushState({}, '', window.location.pathname);
    e.preventDefault();
  };

  return (
    <>
      <div className={styles.heading}>
        <P className={styles.title}>{title}</P>
        {/* <div className={styles.actions}>
          <div> Filter by</div>
          <div>Sort by</div>
        </div> */}
      </div>
      <div className={styles.customTable}>
        <div className={styles.tableRow}>
          <p className={classNames(styles.tableColumn, styles.tableHeader)}>Audit ID</p>
          <p className={classNames(styles.tableColumn, styles.tableHeader)}>Creation Date</p>
          <p className={classNames(styles.tableColumn, styles.tableHeader)}>Auditor Review</p>
          <p className={classNames(styles.tableColumn, styles.tableHeader)}>Your Progress</p>
          <p className={classNames(styles.tableColumn, styles.tableHeader)}>Messages</p>
          <p className={classNames(styles.tableColumnTiny, styles.tableHeader)}>Notes</p>
        </div>
        <div>
          {documents?.map((row, index) => {
            const isLastIndex = index === documents.length - 1;
            const isFirstIndex = index === 0;
            const evpReport = row.data.audit_document.evp_report;
            const documentId = row.id;
            const document = formatEVPReportDocument(evpReport, documentId);

            const statusComplete = document.status === ReviewStatusEnum.AUDITED || document.status === ReviewStatusEnum.COMPLETE;

            const handleEventClickEVPDashboard = (auditId) => {
              const cleanDocumentId = documentId.startsWith('/') ? documentId.slice(1) : documentId;
              const targetUrl = `/evp-process/${cleanDocumentId}`;

              router.push(targetUrl);

              setSelectedEvent(auditId);
              setIsOverlayOpen(true);
            };

            const handleEventClickMessages = (auditId) => {
              const cleanDocumentId = documentId.startsWith('/') ? documentId.slice(1) : documentId;
              const targetUrl = `/evp-process/messages/${cleanDocumentId}`;

              router.push(targetUrl);

              setSelectedEvent(auditId);
              setIsOverlayOpen(true);
            };

            const handleEventClickAuditReview = (auditId) => {
              const cleanDocumentId = documentId.startsWith('/') ? documentId.slice(1) : documentId;
              const targetUrl = `/evp-process/audit-outputs/${cleanDocumentId}`;

              router.push(targetUrl);

              setSelectedEvent(auditId);
              setIsOverlayOpen(true);
            };

            const auditorReviewStatus = row.data?.audit_document?.evp_report?.audit_review?.review_status || ReviewStatusEnum.NOT_STARTED;
            const providerReportCompletion = calculateCompletionFraction(row.data?.audit_document?.evp_report) ?? null;
            const messagesInfo = messagesInDocuments[documentId] || { totalMessages: 0, mostRecentDate: 'N/A' };

            const evpSubmissionDate = document?.auditReview ? toDateISOString(document?.auditReview?.provider_evp_submission_date) : '';
            const nextEVPDate = calculateNextEVPProcess(document?.auditReview.provider_evp_submission_date);

            return (
              <div
                key={index}
                className={classNames(styles.tableRow)}
                style={{ paddingTop: isFirstIndex ? 'none' : '12px', borderBottom: isLastIndex ? 'none' : '1px solid var(--theme-color-border)' }}
              >
                <p className={classNames(styles.tableColumn, styles.tableRowLink)} onClick={() => handleEventClickEVPDashboard(document.audit)}>
                  <span>{document.documentIdShort}</span>
                </p>
                <p className={classNames(styles.tableColumn, styles.tableRowLink)} onClick={() => handleEventClickEVPDashboard(document.audit)}>
                  {document.createdAt}
                </p>
                <p
                  className={classNames(styles.tableColumn, styles.tableRowLink)}
                  style={changeColorBasedOnStatus(auditorReviewStatus)}
                  onClick={() => handleEventClickAuditReview(document.audit)}
                >
                  {auditorReviewStatus ? auditorReviewStatus : 'In progress'}
                </p>
                <p
                  className={classNames(styles.tableColumn, styles.label, styles.tableRowLink)}
                  style={changeColorBasedOnCompletion(providerReportCompletion)}
                  onClick={() => handleEventClickEVPDashboard(document.audit)}
                >
                  {providerReportCompletion} completed
                </p>
                <p className={classNames(styles.tableColumnLarge, styles.label, styles.tableRowLink)} onClick={() => handleEventClickMessages(document.audit)}>
                  {messagesInfo.totalMessages == 0 ? '0' : `${messagesInfo.totalMessages} total - ${messagesInfo.mostRecentDate}`}
                </p>

                {auditorReviewStatus == ReviewStatusEnum.COMPLETE && nextEVPDate && (
                  <p className={classNames(styles.tableColumn, styles.label, styles.accentLabel)}>Next Suggested EVP - {nextEVPDate}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.pagination}>
          <div className={styles.previous} onClick={updatePreviousPage}>
            Previous Page
          </div>

          <div className={styles.separator}> | </div>

          <div className={styles.next} onClick={updateNextPage}>
            Next Page
          </div>
        </div>
        <div className={styles.total}>
          <div>Total {length}</div>
        </div>
      </div>
    </>
  );
};

export default Table;
