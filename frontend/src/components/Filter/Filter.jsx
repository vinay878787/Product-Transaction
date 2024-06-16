import { useTransactionContext } from '../../context/TransactionDetails/TransactionDetails';
import styles from './Filter.module.css';

const Filter = () => {
  const {month,setMonth} = useTransactionContext()
  return (
    <div className={styles.filterContainer}>
      <label htmlFor="month" className={styles.label}>Select Month:</label>
      <select 
        id="month" 
        value={month} 
        onChange={(e)=>setMonth(e.target.value)} 
        className={styles.select}
      >
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
          <option key={index} value={month}>{month}</option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
