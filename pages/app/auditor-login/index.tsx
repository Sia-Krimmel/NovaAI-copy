import '@root/global.scss';

import * as Server from '@common/server';

import { AddressProvider } from '@root/components/AddressContext';
import { SignatureProvider } from '@root/components/SignatureContext';
import { UserProvider } from '@root/components/UserContext';
import Page from '@components/Page';
import AuthenticateAuditor from '@root/components/AuthenticateAuditor';

const title = 'Nova Energy - Register Auditor';
const description = 'Please provide auditor information';

function AuthenticateAuditorPage(props) {
  return (
    <Page title={title} description={description} url="https://novaenergy.ai/app/auditor">
      <SignatureProvider>
        <UserProvider>
          <AddressProvider>
            <AuthenticateAuditor modalTitle={'Log In'} signUp={false} sessionKey={props.sessionKey} viewer={props.viewer} />
          </AddressProvider>
        </UserProvider>
      </SignatureProvider>
    </Page>
  );
}

export async function getServerSideProps(context) {
  const { sessionKey, viewer } = await Server.setup(context);

  return {
    props: { sessionKey, viewer },
  };
}

export default AuthenticateAuditorPage;
