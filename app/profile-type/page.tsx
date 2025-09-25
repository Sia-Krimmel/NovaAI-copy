import '@root/global.scss';

import Page from '@components/Page';
import ProfileTypesSection from '@root/pages/sections/ProfileTypesSection';

const title = 'Nova Energy - Create a  Profile ';
const description = 'This is your profile';

export default async function ProfilePage(props) {
  return (
    <Page title={title} description={description} url="https://novaenergy.ai/profile-page">
      <ProfileTypesSection />
    </Page>
  );
}
