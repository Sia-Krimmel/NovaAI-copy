import styles from '@components/MessagesSection.module.scss';

import DashboardSideNavbar from '@root/components/DashboardSideNavbar';
import MessagesInbox from '@root/components/MessagesInbox';
import { AUDITOR_SIDE_NAVIGATION, SIDE_NAVIGATION } from '@root/content/dashboard';

export default function MessagesSection({ allMessages, viewer, documentId, sessionKey }) {
  // if (profileType !== UserProfileTypeEnum.AUDITOR) {
  //   return redirect('/app');
  // }
  const menu = AUDITOR_SIDE_NAVIGATION;

  return (
    <div className={styles.container}>
      <DashboardSideNavbar
        firstIcon={menu?.firstIcon ?? ''}
        firstLink={menu?.firstLink ?? ''}
        firstTitle={menu?.firstTitle ?? ''}
        secondTitle={'Audit Details'}
        menuNavigation={menu}
        documentId={documentId}
        prefix={menu?.prefix || ''}
        auditor={true}
      />

      <div>
        <div style={{ paddingTop: '1rem' }}>
          <MessagesInbox messages={allMessages} sessionKey={sessionKey} documentId={documentId} viewer={viewer} />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let viewer = null;
  let sessionKey = context.req.cookies['sitekey'] || '';
  let userId = context.req.cookies['userId'] || '';

  if (!userId || userId == '') {
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch('https://api-nova.onrender.com/api/users/viewer', {
      method: 'PUT',
      headers: { 'X-API-KEY': sessionKey, 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (result && result.viewer) {
      viewer = result.viewer;
    }
  } catch (e) {
    return null;
  }

  const { id } = context.params;
  const documentId = id;

  //get messages from posts
  let allMessages = null;

  try {
    const response = await fetch('https://api-nova.onrender.com/api/posts', {
      method: 'POST',
      headers: { 'X-API-KEY': sessionKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_id: documentId,
        type: 'GENERAL',
      }),
    });
    const result = await response.json();

    if (result && result.data) {
      allMessages = result.data;
    }
  } catch (e) {}

  return {
    props: { allMessages, sessionKey, userId, viewer, documentId },
  };
}
