'use client';
import styles from './ContactUsTwo.module.scss';

import { useState } from 'react';
import PageGutterWrapper from './PageGutterWrapper';
import InputWithSpotlight from './InputWithspotlight';
import TextAreaWithSpotlight from './TextAreaWithSpotlight';
import Button, { ButtonStyleEnum } from './Button';
import StarsSVG from './svgs/StarsSVG';
import { LargeHeading } from './typography';

export default function ContactUsTwo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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
      const response = await fetch('/api/airtable/contact-us', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
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
    <div className={styles.wrapper} id="contact">
      <PageGutterWrapper>
        <div className={styles.contactSection} id="contact-us">
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <LargeHeading style={{ textAlign: 'center', paddingBottom: '1rem', color: 'var(--color-white)' }}>Contact Us</LargeHeading>

            {!success ? (
              <>
                <div className={styles.inputContainer}>
                  <label>
                    {' '}
                    Name <span className={styles.asterisk}>*</span>{' '}
                  </label>
                  <InputWithSpotlight
                    type="name"
                    color="var(--color-white)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    height="var(--input-height-regular)"
                  />
                </div>

                <div className={styles.inputContainer} style={{ color: 'var(--color-white)' }}>
                  <label>
                    Email <span className={styles.asterisk}>*</span>{' '}
                  </label>
                  <InputWithSpotlight
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    height="var(--input-height-regular)"
                    color="var(--color-white)"
                  />
                </div>

                <div className={styles.inputContainer}>
                  <label>
                    Message <span className={styles.asterisk}>*</span>{' '}
                  </label>
                  <TextAreaWithSpotlight
                    className={styles.message}
                    height="var(--textarea-height-regular)"
                    type="textarea"
                    value={message}
                    width={'100%'}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                    color="var(--color-white)"
                  />
                </div>

                <div className={styles.bottomForm}>
                  <Button style={ButtonStyleEnum.SQUARE_GREEN} type="submit" disabled={loading} withArrow={true}>
                    <span style={{ color: 'var(--color-black)' }}>Send</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className={styles.formSuccess}>
                <StarsSVG alt="star-icon" className={styles.successStarIcon} />
                <p>
                  Thank you for reaching out! <br /> <br />
                  We have received your message and will get back to you soon.
                </p>
              </div>
            )}
          </form>
          <div className={styles.imageContainer}>
            <img src="/media/grass-fields.png" className={styles.image} />
          </div>
        </div>
      </PageGutterWrapper>
    </div>
  );
}
