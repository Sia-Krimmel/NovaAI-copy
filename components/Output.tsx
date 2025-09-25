import React, { useState } from 'react';
import styles from '@components/Output.module.scss';

interface AuditOutput {
  auditNumber: string;
  submissionDate: string;
  auditName: string;
  recommendation: string;
}

interface ReusableAuditOutputProps {
  title: string;
  data: AuditOutput[];
  length: number;
}

const Output: React.FC<ReusableAuditOutputProps> = ({ title, data, length }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const maxRecordsPerPage = 3;
  const totalPages = Math.ceil(length / maxRecordsPerPage);

  const start = currentPage * maxRecordsPerPage;
  const end = start + maxRecordsPerPage;
  const currentData = data.slice(start, end);

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
    <>
      <div className={styles.heading}>
        <div>{title}</div>
        {/* <div className={styles.actions}>
          <div>Filter by</div>
          <div>Sort by</div>
        </div> */}
      </div>
      <div className={styles.auditColumns}>
        {currentData.map((audit, index) => {
          // border-bottom: 1px solid var(--theme-color-border);
          const isLastIndex = index === currentData.length - 1;
          return (
            <div
              className={styles.eachAudit}
              key={index}
              style={{
                paddingTop: '16px',
                borderBottom: isLastIndex ? 'none' : '1px solid var(--theme-color-border)',
              }}
            >
              <div className={styles.holding}>
                <div className={styles.auditOne}>Audit #{audit.auditNumber}</div>
                <div className={styles.auditOne}>{audit.submissionDate}</div>
              </div>
              <div className={styles.holding}>
                <div className={styles.auditOne}>{audit.auditName}</div>
                <div className={styles.rec}>{audit.recommendation}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.footer}>
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
      </div>
    </>
  );
};

export default Output;
