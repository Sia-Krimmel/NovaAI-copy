import React from 'react';

import Page from '@components/Page';
import EVPReport from '@root/components/EVPReport';
import ReportLayout from '@root/components/ReportLayout';

function Report(props) {
  return (
    <Page title={`Report ${props.id}`} description={`date`}>
      <ReportLayout>
        <EVPReport document={null} documentId={null} greenscores={null} userId={null} showSummaryText={true} />
      </ReportLayout>
    </Page>
  );
}

export default Report;
