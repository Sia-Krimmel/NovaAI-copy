import styles from '@components/CardWithAddedItems.module.scss';
import gridStyles from './GridStyles.module.scss';

import { classNames, formatToSnakeCase } from '@root/common/utilities';
import Button, { ButtonStyleEnum } from './Button';
import DeleteSVG from './svgs/DeleteSVG';
import EditSVG from './svgs/PencilSVG';
import InputWithSpotlight from './InputWithspotlight';

export interface CardWithAddedItems {
  canEdit?: boolean;
  minerIds: any;
  setMinerIds: any;
  disabled?: boolean;
}

interface MinerData {
  miner_id: string;
  ip_address: string;
}

type TableRows = [string, MinerData][];
const tableRowsExample: TableRows = [['1', { miner_id: 'f033232', ip_address: '192.168.1.1' }]];

export default function TabelWithAddedItems({ disabled, canEdit, minerIds, setMinerIds }: CardWithAddedItems) {
  const handleAddMiner = (e) => {
    e.preventDefault();
    const newMiner = { miner_id: '', ip_address: '' };
    setMinerIds([...minerIds, newMiner]);
  };

  const updateItem = (index, field, value) => {
    const snakeCaseField = formatToSnakeCase(field);
    const updatedMiners = minerIds.map((miner, idx) => {
      if (index === idx) {
        return { ...miner, [snakeCaseField]: value };
      }
      return miner;
    });
    setMinerIds(updatedMiners);
  };

  const handleDeleteItem = (index) => {
    //creating a new array without the index we want to delete
    const updatedMiners = minerIds.filter((_, idx) => idx !== index);
    setMinerIds(updatedMiners);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={classNames(styles.tableHeader, gridStyles.twoColumnGridTiny)} style={{ paddingBottom: '16px', gridColumn: 'span 3' }}>
          <p>MinerID</p>
          <p>IP Address</p>
        </div>

        {minerIds.map(({ miner_id, ip_address }, index) => (
          <div key={index} className={gridStyles.twoColumnGridTiny} style={{ gridColumn: 'span 3', paddingRight: '16px' }}>
            <InputWithSpotlight value={miner_id} onChange={(e) => updateItem(index, 'miner_id', e.target.value)} placeholder="Enter Node ID..." disabled={disabled} />
            <InputWithSpotlight
              className={styles.inputUnderline}
              value={ip_address}
              onChange={(e) => updateItem(index, 'ip_address', e.target.value)}
              disabled={disabled}
              placeholder="Enter IP Address..."
            />
            <div className={styles.cardItemOptions} style={{ paddingBottom: '16px', gridColumn: '4' }}>
              <Button style={ButtonStyleEnum.CIRCLE_BORDER_BLACK} onClick={() => handleDeleteItem(index)} disabled={disabled}>
                <DeleteSVG />
              </Button>
              {canEdit && (
                <Button style={ButtonStyleEnum.CIRCLE_BORDER_BLACK} onClick={() => console.log('Editing item', index)} disabled={disabled}>
                  <EditSVG />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ paddingTop: '8px' }}>
        <Button onClick={handleAddMiner} style={ButtonStyleEnum.SQUARE_GREEN} disabled={disabled}>
          Add a MinerID
        </Button>
      </div>
    </div>
  );
}
