import styles from '@components/AuditorTable.module.scss';

import { calculateCompletionFraction, changeColorBasedOnCompletion } from '@root/resolvers/HelperResolvers';
import { classNames } from '@root/common/utilities';
import { ReviewStatusEnum } from '@root/common/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import formatEVPReportDocument, { getEntityCompanyByUserId } from '@root/resolvers/PostgresResolvers';

export default function AuditorTable({ title, sessionKey, allDocuments, reportStatus, messagesInDocuments, length }: any) {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const maxRecordsPerPage = 80;
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

  return (
    <div>
      <div className={styles.heading}>
        <div>{title}</div>
        <div className={styles.actions}>
          {/* <div> Filter by</div> */}
          {/* <div>Sort by</div> */}
        </div>
      </div>
      <div className={styles.customTable}>
        <div className={styles.tableRow}>
          <p className={classNames(styles.tableColumnTiny, styles.tableHeader)}>Audit ID </p>
          <p className={classNames(styles.tableColumn, styles.tableHeader)}>Entity</p>
          <p className={classNames(styles.tableColumnSmall, styles.tableHeader)}>Creation Date</p>
          <p className={classNames(styles.tableColumn, styles.tableHeader)}>Messages</p>
          <p className={classNames(styles.tableColumnSmall, styles.tableHeader)}>Report Completion</p>
          <p className={classNames(styles.tableColumn, styles.tableHeader)}>EVP Status</p>
        </div>
        <div style={{ paddingTop: '16px' }}>
          {documents?.map((row, index) => {
            const isLastIndex = index === documents.length - 1;
            const isFirstIndex = index === 0;
            const evpReport = row.data.audit_document.evp_report;
            const documentId = row.id;
            const document = formatEVPReportDocument(evpReport, documentId);

            const handleEventClick = (auditId) => {
              const cleanDocumentId = documentId.startsWith('/') ? documentId.slice(1) : documentId;
              const targetUrl = `/auditor/evp-process/${cleanDocumentId}`;

              router.push(targetUrl);
            };

            const handleEventClickMessages = (auditId) => {
              const cleanDocumentId = documentId.startsWith('/') ? documentId.slice(1) : documentId;
              const targetUrl = `/auditor/evp-process/messages/${cleanDocumentId}`;

              router.push(targetUrl);
            };

            const handleEventClickAuditReview = (auditId) => {
              const cleanDocumentId = documentId.startsWith('/') ? documentId.slice(1) : documentId;
              const targetUrl = `/auditor/evp-process/audit-outputs/${cleanDocumentId}`;

              router.push(targetUrl);
            };

            const providerReportCompletion = calculateCompletionFraction(evpReport) ?? null;
            let messagesInfo;

            try {
              messagesInfo = messagesInDocuments[documentId] ?? { mostRecentDate: null, totalMessages: 0 };
            } catch (error) {
              console.error('Error accessing messages info:', error);
              messagesInfo = { mostRecentDate: null, totalMessages: 0 };
            }

            return (
              <div
                key={index}
                className={classNames(styles.tableRow)}
                style={{ paddingTop: isFirstIndex ? 'none' : '12px', borderBottom: isLastIndex ? 'none' : '1px solid var(--theme-color-border)' }}
                onClick={() => handleEventClick(document.audit)}
              >
                <p className={styles.tableColumnTiny}>{document.documentIdShort}</p>
                <p className={classNames(styles.tableColumn, styles.userId)} style={{ fontSize: '14px' }}>
                  {row?.entity_company ? row?.entity_company : 'N/A'}
                </p>
                <p className={styles.tableColumnSmall}>{document.createdAt}</p>
                <p className={styles.tableColumn} onClick={() => handleEventClickMessages(document.audit)}>
                  {messagesInfo?.totalMessages == 0 ? '0' : `${messagesInfo.totalMessages} total - ${messagesInfo.mostRecentDate}`}
                </p>
                <p className={classNames(styles.tableColumnSmall, styles.label)} style={changeColorBasedOnCompletion(providerReportCompletion)}>
                  {providerReportCompletion}
                </p>
                {reportStatus === ReviewStatusEnum.NEEDS_REVIEW && (
                  <p className={classNames(styles.tableColumn, styles.tableRowLink)} onClick={() => handleEventClickAuditReview(document.audit)}>
                    <p className={styles.textRed}>Needs Review</p>
                  </p>
                )}

                {reportStatus === ReviewStatusEnum.IN_PROGRESS && (
                  <div className={styles.tableColumn}>
                    <p className={styles.textGrey} style={{ fontSize: '14px' }}>
                      EVP in Progress
                    </p>
                  </div>
                )}

                {reportStatus === ReviewStatusEnum.AUDITED && (
                  <div className={styles.tableColumn}>
                    <p className={styles.textGreen}>EVP is Audited</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className={styles.footer}>
        <div className={styles.pagination}>
          {currentPage > 0 && (
            <div className={styles.previous} onClick={updatePreviousPage}>
              Previous Page
            </div>
          )}

          {currentPage > 0 && currentPage < totalPages - 1 && <div className={styles.separator}> | </div>}

          {currentPage < totalPages - 1 && (
            <div className={styles.next} onClick={updateNextPage}>
              Next Page
            </div>
          )}
        </div>
        <div className={styles.total}>
          <div>Total {length}</div>
        </div>
      </div> */}
    </div>
  );
}
