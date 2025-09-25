import styles from 'HardwareTable.module.scss';
import Button, { ButtonStyleEnum } from './Button';

export default function HardwareTable() {
  return (
    <div className={styles.container}>
      <div className={styles.hardwareTableContainer}>
        <table className={styles.tableStyle}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.name}>Name</th>
              <th className={styles.th}>Function</th>
              <th className={styles.th}>Miner</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}> </th>
              <th className={styles.cta}>
                <Button className={styles.addButton} style={ButtonStyleEnum.SQUARE_BLACK}>
                  Add +
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            <tr>
              <td className={styles.td}>3Degrees Group, Inc</td>
              <td>REC</td>
              <td>Wind, Hydro</td>
              <td>712 MWh </td>
              <td className={styles.purchaseCTA}>Purchase</td>
            </tr>
            <tr>
              <td className={styles.td}>3Degrees Group, Inc</td>
              <td>REC</td>
              <td>Wind, Hydro</td>
              <td>712 MWh </td>
              <td className={styles.purchaseCTA}>Purchase</td>
            </tr>
            <tr>
              <td className={styles.td}>3Degrees Group, Inc</td>
              <td>REC</td>
              <td>Wind, Hydro</td>
              <td>712 MWh </td>
              <td className={styles.purchaseCTA}>Purchase</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
