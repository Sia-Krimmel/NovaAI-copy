import styles from '@components/Form.module.scss';

import Button, { ButtonStyleEnum } from './Button';
import React from 'react';

function Form({ auditor, backLink, nextLink, children, style, handleSubmit, success }: any) {
  const isValidLink = (link) => link && !link.includes('//');

  const handleOnClick = (e) => {
    if (!success) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={{ paddingTop: '1rem' }}>
      <form style={style} className={styles.form}>
        {children}
      </form>
      <div className={styles.formButtons}>
        {isValidLink(backLink) && (
          <span>
            <Button style={ButtonStyleEnum.BORDER_BLACK} href={backLink}>
              Back
            </Button>
          </span>
        )}
        {isValidLink(nextLink) && (
          <>
            {!auditor ? (
              <a href={nextLink} onClick={handleOnClick} className={styles.link}>
                <Button style={ButtonStyleEnum.SQUARE_BLACK}> {success ? 'Next' : 'Submit'}</Button>
              </a>
            ) : (
              <a href={nextLink} onClick={handleOnClick} className={styles.link}>
                <Button style={ButtonStyleEnum.SQUARE_BLACK}> Next </Button>
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(Form);
