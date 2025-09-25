'use client';

import styles from '@components/FeaturedImageWithText.module.scss';

import { H3, H4, H5, Label, LargeHeading, P } from './typography';
import { useState } from 'react';
import Button, { ButtonStyleEnum } from './Button';
import InputWithSpotlight from './InputWithspotlight';
import PageGutterWrapper from './PageGutterWrapper';
import StarsSVG from './svgs/StarsSVG';

export default function FeaturedImageWithText({ id, title, contentHeading, contentLabel, contentDescription, image, withText, imagePosition, imageCaption, content }: any) {
  const imagePlacement = imagePosition ?? 'left';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('You must provide an email, or we will not be able to reach you');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/airtable/waitlist', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        console.log('success');
      } else {
        console.error('Failed to submit the form');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageGutterWrapper>
      <div className={styles.container} id={id || ''}>
        {title && <LargeHeading style={{ textAlign: 'center', color: 'var(--color-white-blue)', paddingBottom: '3rem' }}>{title}</LargeHeading>}

        {!withText && imagePlacement === 'left' && <div className={styles.image}>{image}</div>}

        {withText && (
          <div className={styles.contentWithImageRow}>
            <div className={styles.image}>
              {image}
              {imageCaption && <P className={styles.imageCaption}>{imageCaption} </P>}
            </div>

            <div className={styles.content}>
              {content?.map((item, index) => {
                return (
                  <div key={index} className={styles.content2Columns}>
                    <div>{item.icon}</div>
                    <div>
                      <H5 className={styles.contentTitle}>{item.title}</H5>

                      <P className={styles.contentDescription}>{item.description}</P>
                    </div>
                  </div>
                );
              })}

              <div>
                {contentHeading && (
                  <LargeHeading style={{ color: 'var(--color-white-blue)' }} className={styles.largeHeading}>
                    {contentHeading}
                  </LargeHeading>
                )}
                {contentDescription && (
                  <P className={styles.contentDescription} style={{ paddingTop: '0.5rem', paddingBottom: '2rem' }}>
                    {contentDescription}
                  </P>
                )}
                {contentLabel && <H5 className={styles.contentLabel}>{contentLabel}</H5>}

                <form className={styles.ctaRow} onSubmit={handleSubmit}>
                  {!success ? (
                    <>
                      <InputWithSpotlight type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." color="var(--color-white)" />

                      <Button style={ButtonStyleEnum.SQUARE_GREEN} withArrow={true}>
                        <span style={{ color: 'var(--color-black)' }}>Join Waitlist</span>
                      </Button>
                    </>
                  ) : (
                    <div className={styles.formSuccess}>
                      <StarsSVG alt="star-icon" className={styles.successStarIcon} />
                      <P style={{ color: 'var(--color-white-blue)' }}>Thank you for signing up!</P>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
        {!withText && imagePlacement === 'right' && (
          <div className={styles.image}>
            <div> {image} </div>
          </div>
        )}
      </div>
    </PageGutterWrapper>
  );
}
