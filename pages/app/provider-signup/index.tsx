import '@root/global.scss';

import * as Server from '@common/server';

import { AddressProvider } from '@root/components/AddressContext';
import { SignatureProvider } from '@root/components/SignatureContext';
import { UserProvider } from '@root/components/UserContext';
import AuthenticateProvider from '@root/components/AuthenticateProvider';
import Page from '@root/components/Page';

const title = 'Nova Energy - Register Digital Infrastructure Provider';
const description = 'Please provide Digital Infrastructure Provider information';

function AuthenticateProviderPage(props) {
  return (
    <Page title={title} description={description} url="https://novaenergy.ai/app/provider">
      <SignatureProvider>
        <UserProvider>
          <AddressProvider>
            <AuthenticateProvider signUp={true} modalTitle="Sign Up" sessionKey={props.sessionKey} viewer={props.viewer} />
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

export default AuthenticateProviderPage;
