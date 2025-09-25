import styles from '@components/LandingPageTwo.module.scss';

import { ARCHITECTURE, EVP_PROCESS, FEATURED_BLOGS, FUTURE_DEVELOPMENTS, FUTURE_DEVELOPMENTS_WITH_IMAGE, NAVIGATION_CONTENT, NOVA_PRODUCTS } from '@root/content/homepage-two';
import CardSlider from '@root/components/CardSlider';
import ContactUsTwo from '@root/components/ContactUsTwo';
import FeaturedBlogs from '@root/components/FeaturedBlogs';
import FeaturedImageWithText from '@root/components/FeaturedImageWithText';
import FooterTwo from '@root/components/FooterTwo';
import HeroTwo from '@root/components/HeroTwo';
import ImageWithCards from '@root/components/ImageWithCards';
import NavigationTwo from '@root/components/NavigationTwo';
import GradientGreenLargeSVG from '@root/components/svgs/GradientGreenLargeSVG';
import GradientGreenSmallSVG from '@root/components/svgs/GradientGreenSmallSVG';
import GradientGreenLongSVG from '@root/components/svgs/GradientGreenLongSVG';
import GradientGreenCircleSVG from '@root/components/svgs/GradientGreenCircleSVG';

export default function LandingPageSection() {
  const architecture = ARCHITECTURE;
  const futureDevelpments = FUTURE_DEVELOPMENTS;
  const navigation = NAVIGATION_CONTENT;
  const products = NOVA_PRODUCTS;
  const futureDevelopments = FUTURE_DEVELOPMENTS_WITH_IMAGE;
  const evpProcess = EVP_PROCESS;
  const blogs = FEATURED_BLOGS;

  return (
    <div className={styles.container}>
      <GradientGreenLargeSVG className={styles.gradientGreenHeader} />
      <GradientGreenSmallSVG className={styles.gradientGreenHeaderSmall} />

      <NavigationTwo {...navigation} />
      <HeroTwo />
      <ImageWithCards {...products} imagePosition="left" />
      <CardSlider {...evpProcess} style={{ paddingBottom: 'var(--page-gap-desktop)' }} />
      <div style={{ display: 'grid', rowGap: 'var(--page-gap-desktop)' }}>
        <FeaturedImageWithText {...architecture} withText={false} />
        <ImageWithCards {...futureDevelopments} imagePosition="right" />
        <FeaturedImageWithText {...futureDevelpments} withText={true} imagePosition="right" />
        <GradientGreenCircleSVG className={styles.gradientGreenWaitlist} />
        <FeaturedBlogs {...blogs} />
        <GradientGreenLongSVG className={styles.gradientGreenBlog} />
        <ContactUsTwo />
        <FooterTwo />
      </div>
    </div>
  );
}
