import styles from './FormMessages.module.scss';

import * as Queries from 'common/queries';
import * as React from 'react';
import * as Utilities from 'common/utilities';
import Button, { ButtonStyleEnum } from './Button';
import PageGutterWrapper from './PageGutterWrapper';
import SmallButton from './SmallButton';

export default function FormMessages({ documentId, formType, messages, sessionKey, setModal, viewer }) {
  return (
    <div className={styles.container}>
      <PageGutterWrapper>
        <p className={styles.title}>Messages</p>
        <FormThreads formType={formType} documentId={documentId} data={messages} sessionKey={sessionKey} setModal={setModal} style={{ marginTop: 32 }} viewer={viewer} />
      </PageGutterWrapper>
    </div>
  );
}

export function FormThreads({ documentId, data, formType, viewer, setModal, sessionKey, style }) {
  const [threads, setThreads] = React.useState(data || []);

  React.useEffect(() => {}, [data]);

  const onCreateThread = async () => {
    if (!viewer) {
      setModal({
        name: 'ERROR',
        message: 'You need to sign in first.',
      });
      return;
    }

    const plainText = window.prompt('Please type your message:');

    if (Utilities.isEmpty(plainText)) {
      setModal({
        name: 'ERROR',
        message: 'You must provide words.',
      });
      return;
    }

    const response = await Queries.userCreatePlainThread({
      key: sessionKey,
      documentId: documentId,
      formType: formType,
      fields: {
        thread: true,
        plainText,
      },
      src: null,
      type: 'GENERAL',
    });

    if (response && !response.error) {
      const threadId = response.id;
      const newThread = {
        id: threadId,
        user_id: viewer.id,
        created_at: new Date().toISOString(),
        data: { plainText },
      };

      setThreads((prevList) => [...prevList, newThread]);
    } else {
      setModal({
        name: 'ERROR',
        message: 'Something went wrong with creating a thread',
      });
    }
  };

  if (!threads || !threads.length) {
    return (
      <div className={styles.emptyState} style={style}>
        <p className={styles.emptyStateCaption} style={{ paddingBottom: '0.5rem' }}>
          Leave any comments or questions by creating a message below.
        </p>
        <Button onClick={onCreateThread} style={ButtonStyleEnum.BORDER_BLACK}>
          Create a Message
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.root} style={style}>
      {threads.map((each, index) => {
        const author = viewer && viewer.id === each.user_id ? `You` : `Auditor`;

        return (
          <div className={styles.itemWrapper} key={each.id}>
            <div className={styles.byline}>
              {author} ⎯ {Utilities.timeAgo(each.created_at)}
            </div>
            <div className={styles.body}>{each.data.plainText}</div>
          </div>
        );
      })}
      <Button onClick={onCreateThread} style={ButtonStyleEnum.BORDER_BLACK}>
        Create a Message
      </Button>
    </div>
  );
}

const FormThreadItem = (props) => {
  const [list, setList] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    onList();
  }, []);

  const onList = async (options?: Record<string, any>) => {
    const listing = await Queries.userListThreadReplies({ id: props.threadId, orderBy: { column: 'created_at', value: 'desc' } });
    if (!listing || listing.error) {
      props.setModal({
        name: 'ERROR',
        message: 'Something went wrong with listing replies to this post.',
      });
      return;
    }

    if (options && options.checkEmptyArrayError) {
      if (!listing.data.length) {
        props.setModal({
          name: 'ERROR',
          message: 'There are no replies to this thread, make one!',
        });
        return;
      }
    }

    setList(listing.data);
  };

  const onReply = async () => {
    if (!props.viewer) {
      props.setModal({
        name: 'ERROR',
        message: 'You need to sign in first.',
      });
      return;
    }

    const plainText = window.prompt('Please type your message:');

    if (Utilities.isEmpty(plainText)) {
      props.setModal({
        name: 'ERROR',
        message: 'You must provide words.',
      });
      return;
    }

    const response = await Queries.userCreatePlainThread({
      key: props.sessionKey,
      documentId: props.documentId,
      formType: props.formType,
      fields: {
        thread: true,
        parentId: props.threadId,
        plainText,
      },
      src: null,
      type: 'GENERAL',
    });
    if (!response || response.error) {
      props.setModal({
        name: 'ERROR',
        message: 'Something went wrong with creating a thread',
      });
      return;
    }

    const listing = await Queries.userListThreadReplies({ id: props.threadId, orderBy: { column: 'created_at', value: 'desc' } });
    if (!listing || listing.error) {
      props.setModal({
        name: 'ERROR',
        message: 'Something went wrong with listing threads',
      });
      return;
    }

    setList(listing.data);
  };

  React.useEffect(() => {
    onList();
  }, []);

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <div className={styles.top} />
        <div
          className={styles.symbol}
          style={list.length ? { backgroundColor: `var(--color-text)`, color: `var(--color-background)` } : undefined}
          onClick={() => {
            onList({ checkEmptyArrayError: true });
          }}
        >
          {list.length ? `𒆳` : `◈`}
        </div>
        {props.isLast ? null : <figure className={styles.bottom} />}
      </div>
      <div className={styles.right}>
        <div className={styles.children}>{props.children}</div>
        <div className={styles.actions}>
          <SmallButton onClick={onReply}>Reply</SmallButton>
        </div>
        {list.length ? (
          <div className={styles.replies}>
            {list.map((each, index) => {
              const author = props.viewer && props.viewer.id === each.user_id ? `You` : `Auditor`;

              return (
                <FormThreadItem
                  author={author}
                  isLast={index === list.length - 1}
                  key={each.id}
                  sessionKey={props.sessionKey}
                  setModal={props.setModal}
                  threadId={each.id}
                  viewer={props.viewer}
                >
                  <div className={styles.byline}>
                    {author} ⎯ {Utilities.timeAgo(each.created_at)}
                  </div>
                  <div className={styles.body}>{each.data.plainText}</div>
                </FormThreadItem>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};
