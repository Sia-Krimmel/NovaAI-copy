import styles from '@components/DefaultLayout.module.scss';

import '@root/global.scss';

import { BLOG_HOMEPAGE_CONTENT, FOOTER_CONTENT, NAVIGATION_HOMEPAGE_CONTENT } from '@root/content/homepage';
import { FadeInEffectWrapper } from '@root/components/FadeInEffectWrapper';
import Contact from '@root/components/Contact';
import Footer from '@root/components/Footer';
import Hero from '@root/components/Hero';
import Navbar from '@root/components/Navbar';
import Process from '@root/components/Process';

export async function generateMetadata({ params, searchParams }) {
  const title = 'Nova Energy';
  const description =
    'Ready to revolutionize your sustainability efforts with us? Explore our Energy Validation Process (EVP) & join our quest for a greener, more sustainable digital landscape.';
  const url = 'http://novaenergy.ai';
  const handle = '@novaenergy';

  return {
    metadataBase: new URL('https://novaenergy.ai'),
    title,
    description,
    url,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: 'https://res.cloudinary.com/dqgbhqpcj/image/upload/v1703254556/Nova%20Energy/nova-og_fplggw.png',
          width: 1200,
          height: 628,
        },
        {
          url: 'https://res.cloudinary.com/dqgbhqpcj/image/upload/v1703254641/Nova%20Energy/1200x1200.png',
          width: 1200,
          height: 1200,
        },
      ],
    },
    twitter: {
      title,
      description,
      url,
      handle,
      card: 'summary_large_image',
      images: ['./media/nova-og.png'],
    },
    icons: {
      icon: '/favicon-32x32.png',
      shortcut: '/favicon-16x16.png',
      apple: [{ url: '/apple-touch-icon.png' }, { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon-precomposed.png',
        },
      ],
    },
  };
}

export default async function Page(props) {
  const navigation = NAVIGATION_HOMEPAGE_CONTENT;
  const blog = BLOG_HOMEPAGE_CONTENT;
  const footer = FOOTER_CONTENT;

  return (
    <div style={{ background: 'var(--color-black)' }}>
      <Navbar navigation={navigation} />
      <div className={styles.blockGap}>
        <Hero />
        <Process />
        <FadeInEffectWrapper>
          <Contact />
        </FadeInEffectWrapper>
        <Footer {...footer} />
      </div>
    </div>
  );
}
