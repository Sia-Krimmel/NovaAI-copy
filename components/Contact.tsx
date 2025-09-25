'use client';
import styles from './Contact.module.scss';

import Button from './Button';
import InputWithSpotlight from './InputWithspotlight';
import LightSVG from './svgs/LightSVG';
import PageGutterWrapper from './PageGutterWrapper';
import React, { useState } from 'react';
import StarsSVG from './svgs/StarsSVG';
import TextAreaWithSpotlight from './TextAreaWithSpotlight';

export default function Contact() {
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
    <PageGutterWrapper>
      <div className={styles.contactSection} id="contact-us">
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <span className={styles.contactTitle}>Contact Us </span>

          {!success ? (
            <>
              <div className={styles.inputContainer}>
                <label>
                  {' '}
                  Name <span className={styles.asterisk}>*</span>{' '}
                </label>
                <InputWithSpotlight type="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              </div>

              <div className={styles.inputContainer}>
                <label>
                  {' '}
                  Email <span className={styles.asterisk}>*</span>{' '}
                </label>
                <InputWithSpotlight type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              </div>

              <div className={styles.inputContainer}>
                <label>
                  {' '}
                  Message <span className={styles.asterisk}>*</span>{' '}
                </label>
                <TextAreaWithSpotlight
                  height="var(--textarea-height-regular)"
                  type="textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  color="var(--color-grey)"
                />
              </div>

              <div className={styles.bottomForm}>
                <Button type="submit" disabled={loading} withArrow={true} className={`${styles.buttonWithArrow} ${loading ? styles.buttonLoading : ''}`}>
                  <span>{loading ? 'Submitting' : 'Send'}</span>
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
        <div className={styles.icon}>
          <LightSVG />
        </div>
      </div>
    </PageGutterWrapper>
  );
}
