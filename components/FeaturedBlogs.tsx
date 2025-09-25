import styles from '@components/FeaturedBlogs.module.scss';

import { H6, Label, LargeHeading, P } from './typography';
import Link from 'next/link';
import PageGutterWrapper from './PageGutterWrapper';
import ArrowRightSVG from './svgs/ArrowRightSVG';

export default function FeaturedBlogs({ blogs }) {
  return (
    <PageGutterWrapper>
      <div className={styles.container} id="blog">
        <LargeHeading style={{ textAlign: 'center', paddingBottom: '3rem', color: 'var(--color-white)' }}>Blog</LargeHeading>

        <div className={styles.blogCards}>
          {blogs?.map((blog, index) => {
            return (
              <div key={index} className={styles.blogItem}>
                <Link href={blog.href} target="_blank" className={styles.link}>
                  <div className={styles.imageContainer}>
                    <img className={styles.image} src={blog.image} />
                  </div>
                </Link>
                <div className={styles.blogContent}>
                  <Label className={styles.tag}>{blog.tag}</Label>
                  <Link href={blog.href} target="_blank" className={styles.link}>
                    <P className={styles.blogTitle}>{blog.title}</P>
                  </Link>
                  <P className={styles.blogDescription}>{blog.description}</P>
                </div>
                <div className={styles.cta}>
                  <Link href={blog.href}>
                    <ArrowRightSVG stroke="var(--color-white)" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageGutterWrapper>
  );
}
