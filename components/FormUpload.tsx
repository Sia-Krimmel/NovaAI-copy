import styles from './FormUpload.module.scss';

import { FileUploadSVG } from './svgs/FileUploadSVG';
import { P } from './typography';
import * as Utilities from 'common/utilities';
import AttachmentSVG from '@root/components/svgs/AttachmentSVG';
import Link from './Link';
import Loader from './Loader';
import React, { useState } from 'react';

export default function FormUpload(props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      props.onSetFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      props.onSetFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  return (
    <div className={styles.root} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} style={props.style}>
      <input className={styles.input} id={props.id} type="file" onChange={handleChange} />
      <label className={Utilities.classNames(styles.body, isDragOver ? styles.hover : null)} htmlFor={props.id} style={{ width: props.width || '100%' }}>
        {props.loading ? (
          <Loader />
        ) : isValidUrl(props.fileURL) ? (
          <Link href={props.fileURL} target="_blank" linkStyle="animated-green">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
              <AttachmentSVG width="12px" color="var(--theme-color-form-text)" />
              <P className={styles.attachment}> View Uploaded File </P>
            </div>
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '16px' }}>
            <AttachmentSVG color="var(--theme-color-form-text)" />
            <p color="var(--theme-color-form-text)">Upload a file</p>
          </div>
        )}
      </label>
    </div>
  );
}

export function EmptyFileUpload({ onClick, width, disabled }: any) {
  return (
    <div className={styles.emptyFile} onClick={onClick} style={{ width: width || '50%' }} {...disabled}>
      <FileUploadSVG color="var(--theme-color-form-text)" />
      <P style={{ color: 'var(--theme-color-form-text)' }}>Add File</P>
    </div>
  );
}
