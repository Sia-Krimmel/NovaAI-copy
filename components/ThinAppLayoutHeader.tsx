import styles from './ThinAppLayoutHeader.module.scss';

import * as React from 'react';
import ActionItem from './ActionItem';

export default function ThinAppLayoutHeader(props) {
  return (
    <div className={styles.root}>
      <ActionItem href="/" icon={`⭠`}>
        Return home
      </ActionItem>
      {props.token ? (
        <ActionItem icon={`✳`} onClick={props.onSignOut}>
          Reset key and delete Cookie
        </ActionItem>
      ) : null}
    </div>
  );
}
