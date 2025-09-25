import '@root/global.scss';

import { FadeInEffectWrapper } from '@root/components/FadeInEffectWrapper';

import PageGutterWrapper from '@root/components/PageGutterWrapper';
import FooterNoFade from '@root/components/FooterNoFade';
import Navbar from '@root/components/Navbar';
import { NAVIGATION_PRIVACY_POLICY_CONTENT } from '@root/content/privacy-policy-page';
import PrivacyPolicySection from '@root/pages/sections/PrivacyPolicySection';

export async function generateMetadata({ params, searchParams }) {
  const title = 'Nova Energy -  Privacy Policy';
  const description =
    'Ready to revolutionize your sustainability efforts with us? Explore our Energy Validation Process (EVP) & join our quest for a greener, more sustainable digital landscape';
  const url = 'http://novaenergy.ai';
  const handle = '@novaenergy';

  return {
    title,
    description,
    url,
    openGraph: {
      title,
      description,
      url,
      // SUMMARY_LARGE_IMAGE: 1500x785
      images: [''],
    },
    twitter: {
      title,
      description,
      url,
      handle,
      cardType: 'summary_large_image',
    },
    icons: {
      icon: '/favicon-32x32.png',
      shortcut: '/favicon-16x16.png',
    },
  };
}

export default async function Page(props) {
  const navigation = NAVIGATION_PRIVACY_POLICY_CONTENT;

  return (
    <div style={{ background: 'var(--color-beige)', color: 'var(--color-black)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Navbar navigation={navigation} />
        <PageGutterWrapper>
          <FadeInEffectWrapper>
            <PrivacyPolicySection />
          </FadeInEffectWrapper>
        </PageGutterWrapper>
      </div>
      <FooterNoFade />
    </div>
  );
}
