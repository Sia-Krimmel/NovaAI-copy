import * as React from 'react';
import * as Utilities from '@common/utilities';

import Cookies from 'js-cookie';

function OAuthPage(props) {
  React.useEffect(() => {
    if (Utilities.isEmpty(props.code)) {
      window.location.replace('/');
    }
    if (Utilities.isEmpty(props.id)) {
      window.location.replace('/');
    }

    Cookies.set('sitekey', props.code, { secure: true });
    Cookies.set('userId', props.id, { secure: true });

    window.location.replace('/create-provider-profile');
  });
  return <div>Redirecting...</div>;
}

export async function getServerSideProps(context) {
  if (Utilities.isEmpty(context.query.key)) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  let viewer;
  const sessionKey = context.query.key;

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

  return {
    props: {
      code: String(context.query.key),
      id: String(viewer.id),
    },
  };
}

export default OAuthPage;
