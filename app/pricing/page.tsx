import '@root/global.scss';

import Page from '@components/Page';
import PricingGrid from '@root/components/PricingGrid';
import FooterTwo from '@root/components/FooterTwo';
import NavigationTwo from '@root/components/NavigationTwo';
import { NAVIGATION_CONTENT_OUTSIDE_OF_LANDING_PAGE } from '@root/content/homepage-two';

const title = 'Nova Energy - Pricing';
const description = 'Nova Energy Pricing';

export default async function ProfilePage(props) {
  const navigation = NAVIGATION_CONTENT_OUTSIDE_OF_LANDING_PAGE;

  return (
    <Page title={title} description={description} url="https://novaenergy.ai/profile" style={{ background: 'black' }}>
      <NavigationTwo {...navigation} />

      <PricingGrid />
      <FooterTwo />
    </Page>
  );
}
