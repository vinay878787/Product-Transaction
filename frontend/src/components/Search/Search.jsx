import styles from "./Search.module.css";
import { useTransactionContext } from "../../context/TransactionDetails/TransactionDetails";

const Search = () => {
  const { searchQuery, setSearchQuery } = useTransactionContext();

  return (
    <form className={styles.searchForm}>
      <input
        type="text"
        placeholder="Search with title/description/price"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
    </form>
  );
};

export default Search;
