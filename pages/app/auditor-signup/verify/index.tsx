import '@root/global.scss';

import * as Server from '@common/server';

import { AddressProvider } from '@root/components/AddressContext';
import { SignatureProvider } from '@root/components/SignatureContext';
import { UserProvider } from '@root/components/UserContext';
import Page from '@components/Page';
import VerifyAuditor from '@root/components/VerifyAuditor';

const title = 'Nova Energy - Register Auditor';
const description = 'Please provide auditor information';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

function AuditorVerifyPage(props) {
  const sitekey = props.sessionKey || null;
  const userId = props.viewer?.userId || null;

  return (
    <Page title={title} description={description} url="https://novaenergy.ai/app/auditor">
      <SignatureProvider>
        <UserProvider>
          <AddressProvider>
            <VerifyAuditor userId={userId} sessionKey={sitekey} auditorCode={props.auditorCode} />
          </AddressProvider>
        </UserProvider>
      </SignatureProvider>
    </Page>
  );
}

export async function getServerSideProps(context) {
  const { sessionKey, viewer } = await Server.setup(context);
  const auditorCode = process.env.AUDITOR_PASSWORD;

  return {
    props: { sessionKey, viewer, auditorCode },
  };
}

export default AuditorVerifyPage;
