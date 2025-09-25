import '@root/global.scss';

import LandingPageSection from '@root/pages/sections/LandingPageSection';

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
  return (
    <div style={{ background: 'var(--color-black)' }}>
      <LandingPageSection />
    </div>
  );
}
