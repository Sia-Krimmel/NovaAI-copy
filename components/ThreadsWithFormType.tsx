import styles from './ThreadsWithFormType.module.scss';

import * as Queries from 'common/queries';
import * as React from 'react';
import * as Utilities from 'common/utilities';
import Button, { ButtonStyleEnum } from './Button';

const ThreadItemWithFormType = (props) => {
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

  React.useEffect(() => {
    onList();
  }, []);

  return (
    <div className={styles.item}>
      <div className={styles.left}></div>
      <div className={styles.right}>
        <div className={styles.children}>{props.children}</div>
      </div>
    </div>
  );
};

export function ThreadsWithFormType({ documentId, data, formType, viewer, setModal, sessionKey, style }) {
  const [threads, setThreads] = React.useState(data || []);

  React.useEffect(() => {
    setThreads(data);
  }, [data]);

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
    <div style={style} className={styles.messagesWithFormType}>
      {threads?.map((each, index) => {
        const author = viewer && viewer.id === each.user_id ? `You` : `${viewer.data.profile.full_name}, ${viewer?.data?.profile?.profile_type || 'Auditor'} `;
        const formType = each?.form_type ?? null;
        const formattedDate = Utilities.toDateISOString(each.created_at);
        const isCurrentUser = viewer && viewer.id === each.user_id;

        return (
          <div
            className={Utilities.classNames(styles.itemWrapper, {
              [styles.currentUserMessage]: isCurrentUser,
              [styles.otherUserMessage]: !isCurrentUser,
            })}
            key={each.id}
          >
            <ThreadItemWithFormType
              isLast={index === threads.length - 1}
              sessionKey={sessionKey}
              setModal={setModal}
              threadId={each.id}
              viewer={viewer}
              documentId={documentId}
              formType={each.form_type}
            >
              <div
                className={Utilities.classNames(styles.messageDetailsRow, {
                  [styles.messageDetailsRowCurrentUser]: isCurrentUser,
                  [styles.messageDetailsRowOtherUser]: !isCurrentUser,
                })}
              >
                <span>{formattedDate}</span>
                <span className={styles.date}>{Utilities.timeAgo(each.created_at)}</span>
              </div>
              {/* <div className={styles.byline}>
                <div>
                  <span style={{ color: 'var(--color-accent)' }}>{formType}</span>
                </div>
              </div> */}
              <div className={styles.messageGrid}>
                {!isCurrentUser && <div className={Utilities.classNames({ [styles.currentUserSymbol]: isCurrentUser, [styles.otherUserSymbol]: !isCurrentUser })}>◈</div>}
                <div className={styles.body}>
                  <span className={Utilities.classNames({ [styles.currentAuthor]: isCurrentUser, [styles.author]: !isCurrentUser })} style={{ fontWeight: 'bold' }}>
                    {author}
                  </span>
                  <span className={styles.bodyText}>{each.data.plainText}</span>
                </div>
                {isCurrentUser && <div className={Utilities.classNames({ [styles.currentUserSymbol]: isCurrentUser, [styles.otherUserSymbol]: !isCurrentUser })}>◈</div>}
              </div>
            </ThreadItemWithFormType>
          </div>
        );
      })}
    </div>
  );
}

export const createMessage = async ({ viewer, setModal, sessionKey, documentId, selectedFormType, setMessagesToShow, newMessage }) => {
  if (!viewer) {
    setModal({
      name: 'ERROR',
      message: 'You need to sign in first.',
    });
    return;
  }

  if (Utilities.isEmpty(newMessage)) {
    setModal({
      name: 'ERROR',
      message: 'You must provide words.',
    });
    return;
  }

  const response = await Queries.userCreatePlainThread({
    key: sessionKey,
    documentId: documentId,
    formType: selectedFormType,
    fields: {
      thread: true,
      plainText: newMessage,
    },
    src: null,
    type: 'GENERAL',
  });

  if (response && !response.error) {
    const newThread = {
      id: response.id,
      user_id: viewer.id,
      created_at: new Date().toISOString(),
      form_type: selectedFormType,
      data: { plainText: newMessage },
    };

    setMessagesToShow((prevList) => [...prevList, newThread]);
  } else {
    setModal({
      name: 'ERROR',
      message: 'Something went wrong with creating a thread',
    });
  }
};

export function MessagesWithFormType({ documentId, formType, messages, sessionKey, setModal, viewer }) {
  return (
    <div className={styles.container}>
      <ThreadsWithFormType formType={formType} documentId={documentId} data={messages} sessionKey={sessionKey} setModal={setModal} style={{ marginTop: 32 }} viewer={viewer} />
    </div>
  );
}
