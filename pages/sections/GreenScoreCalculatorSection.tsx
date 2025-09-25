import sideNavStyles from '@components/SideNavigaton.module.scss';
import * as Utilities from 'common/utilities';

import { AUDIT_STATUS } from '@root/content/dashboard';
import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import DashboardTopNavbar from '@root/components/DashboardTopNavbar';
import GreenscoreAuditInput from '@root/components/GreenscoreAuditInput';
import PageGutterWrapper from '@root/components/PageGutterWrapper';
import React from 'react';

export default function GreenScoreCalculatorSection({ document, dashboard, greenscores, providerProfile, menu, locationInformation, userId, documentId, sessionKey, viewer }) {
  // const [loading, setLoading] = React.useState<boolean>(false);
  // const [reviewStatus, setReviewStatus] = React.useState(document?.status ?? '');

  const auditStatus = AUDIT_STATUS;

  return (
    <div className={sideNavStyles.container}>
      <DashboardSideNavbar
        firstIcon={menu?.firstIcon ?? ''}
        brandLink={menu?.brandLink}
        firstLink={menu?.firstLink ?? ''}
        firstTitle={menu?.firstTitle ?? ''}
        menuNavigation={menu}
        documentId={documentId}
        prefix={menu?.prefix ?? null}
      />
      <div>
        <DashboardTopNavbar onHandleThemeChange={Utilities.onHandleThemeChange} dashboardNavigation={dashboard} />

        <PageGutterWrapper>
          <GreenscoreAuditInput
            greenscores={greenscores}
            document={document}
            documentId={documentId}
            sessionKey={sessionKey}
            locationInformation={locationInformation}
            providerProfile={providerProfile}
          />
        </PageGutterWrapper>
      </div>
    </div>
  );
}
