import styles from '@components/MessagesInbox.module.scss';

import { classNames, truncateText } from '@root/common/utilities';
import { FormTypeEnum } from '@root/common/types';
import { MessagesWithFormType, createMessage } from './ThreadsWithFormType';
import { P } from './typography';
import CopyOutlineSVG from './svgs/CopyOutlineSVG';
import ElectricitySVG from './svgs/ElectricitySVG';
import GridSVG from './svgs/GridSVG';
import LocationSVG from './svgs/LocationSVG';
import LockSVG from './svgs/LockSVG';
import MicroChipSVG from './svgs/MicroChipSVG';
import React, { useEffect, useState } from 'react';
import SendSVG from './svgs/SendSVG';
import TextAreaWithSpotlight from './TextAreaWithSpotlight';
import WaterSVG from './svgs/WaterSVG';

const formTypeMappingWithIcon = {
  [FormTypeEnum.LOCATION_INFORMATION]: {
    icon: <LocationSVG className={styles.iconSVG} color="var(--theme-label)" />,
    displayName: 'Location Information',
  },
  [FormTypeEnum.HARDWARE_CONFIGURATION]: {
    icon: <MicroChipSVG className={styles.iconSVG} color="var(--theme-label)" />,
    displayName: 'Hardware Configuration',
  },
  [FormTypeEnum.WATER_CONSUMPTION]: {
    icon: <WaterSVG className={styles.iconSVG} color="var(--theme-label)" />,
    displayName: 'Water Consumption',
  },
  [FormTypeEnum.ELECTRICITY_CONSUMPTION]: {
    icon: <ElectricitySVG className={styles.iconSVG} color="var(--theme-label)" />,
    displayName: 'Energy Consumption',
  },
  [FormTypeEnum.RENEWABLE_ENERGY_PRODUCED]: {
    icon: <GridSVG className={styles.iconSVG} color="var(--theme-label)" />,
    displayName: 'Renewable Energy Produced',
  },
  [FormTypeEnum.RENEWABLE_ENERGY_PROCUREMENT]: {
    icon: <LockSVG className={styles.iconSVG} color="var(--theme-label)" />,
    displayName: 'Renewable Energy Procurement',
  },
  [FormTypeEnum.ENERGY_PRODUCATION_DATA]: {
    icon: <GridSVG className={styles.iconSVG} color="var(--theme-label)" />,
    displayName: 'Renewable Energy Produced',
  },
};

export default function MessagesInbox({ messages, sessionKey, documentId, viewer }) {
  const [selectedFormType, setSelectedFormType] = useState(null);
  const [messagesToShow, setMessagesToShow] = useState([]);
  const [currentModal, setModal] = React.useState<Record<string, any> | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (selectedFormType) {
      const filteredMessages = messages.filter((message) => message.form_type === selectedFormType);
      setMessagesToShow(filteredMessages);
    } else {
      setMessagesToShow(messages);
    }
  }, [selectedFormType, messages]);

  // Create a map to store the most recent message for each form_type
  const messageMap = messages?.reduce((map, message) => {
    const { form_type, updated_at } = message;
    if (!map[form_type] || new Date(map[form_type].updated_at) < new Date(updated_at)) {
      map[form_type] = message;
    }
    return map;
  }, {});

  // Get an array of the most recent messages
  const filteredMessages: any = Object.values(messageMap).filter((message: any) => message.form_type && message.form_type !== 'No Form Type');
  const displayedMessages = selectedFormType ? messages.filter((message) => message.form_type === selectedFormType) : filteredMessages;

  // Set the first item as the default selected form type if none is selected
  useEffect(() => {
    if (filteredMessages.length > 0 && !selectedFormType) {
      setSelectedFormType(filteredMessages[0].form_type);
    }
  }, [filteredMessages, selectedFormType]);

  const handleCreateMessage = async () => {
    await createMessage({ viewer, setModal, sessionKey, documentId, selectedFormType, setMessagesToShow, newMessage });
    setNewMessage('');
  };

  return (
    <div className={styles.messageInboxGrid}>
      <div className={styles.tableContainer}>
        <div className={styles.heading}>
          <P className={styles.title}>Messages Inbox</P>

          {/* <P className={styles.messageCount}>
            Open (<span>16</span>)
          </P> */}
        </div>
        <div>
          {filteredMessages?.length > 0 ? (
            <>
              {filteredMessages?.map((item, index) => {
                const { form_type, updated_at, data } = item;
                const { plainText } = data;

                const formattedText = truncateText(plainText, 28);
                const formTypeInfo = formTypeMappingWithIcon[form_type] || { icon: <CopyOutlineSVG />, displayName: 'No Form Type' };

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedFormType(form_type)}
                    className={classNames(styles.inbox, form_type === selectedFormType ? styles.activeMessage : '')}
                    style={{ borderBottom: '1px solid var(--theme-color-border)' }}
                  >
                    <div className={styles.icon}>{formTypeInfo.icon}</div>

                    <div className={styles.messageItemWrapper}>
                      <div className={styles.messageItemHeader}>
                        <P className={styles.formName}>{formTypeInfo.displayName}</P>
                        <P className={styles.date}>{new Date(updated_at).toLocaleDateString()}</P>
                      </div>
                      <P className={styles.message}>{formattedText}</P>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className={styles.emptyInbox}>
              <P className={styles.emptyText}>No new messages. Please go to any of the forms to leave a message.</P>
            </div>
          )}
        </div>
      </div>
      <div className={styles.messageInbox}>
        <div className={styles.heading} style={{ position: 'fixed', width: '48.2vw' }}>
          <P className={styles.title}>Conversation</P>
        </div>
        <div className={styles.messagesContainer}>
          {displayedMessages?.length > 0 && filteredMessages.length > 0 ? (
            <div style={{ marginTop: '3rem', paddingBottom: '92px' }}>
              <MessagesWithFormType messages={messagesToShow} sessionKey={sessionKey} documentId={documentId} viewer={viewer} formType={selectedFormType} setModal={setModal} />{' '}
            </div>
          ) : (
            <div className={styles.emptyInbox}>
              <P className={styles.emptyText}>Please go to any of the forms to leave a message under the form.</P>
            </div>
          )}
          {displayedMessages?.length > 0 && filteredMessages?.length > 0 ? (
            <div className={styles.createMessageBox}>
              <TextAreaWithSpotlight
                width="100%"
                type="text"
                value={newMessage}
                height="60px"
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className={styles.inputBox}
              />
              <button onClick={handleCreateMessage} className={styles.sendMessageButton}>
                <SendSVG className={styles.sendMessageIcon} />
              </button>
            </div>
          ) : (
            <div className={styles.emptyInbox}>
              <P className={styles.emptyText}>Please go to any of the forms to leave a message under the form.</P>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
