import classes from "./SearchBar.module.css";
const SearchBar: React.FC = (props) => {
  return (
    <form className={classes.form}>
      <div className={classes.controls}>
        <div className={classes.control}>
          <label htmlFor="year">State</label>
          <select id="year">
            <option value="2021">Gujarat</option>
          </select>
        </div>
        <div className={classes.control}>
          <label htmlFor="year">City</label>
          <select id="year">
            <option value="2021">Surat</option>
            <option value="2022">Ahmedabad</option>
          </select>
        </div>
        <div className={classes.control}>
          <label htmlFor="month">MediaPlans</label>
          <select id="month">
            <option value="" defaultValue="selected">
              Select Media Type
            </option>
            <option value=""> BillBoard Hoarding</option>
            <option value=""> Bus Stands</option>
            <option value=""> Airports/Railways</option>
          </select>
        </div>
      </div>
      <button>Search OOH </button>
    </form>
  );
};

export default SearchBar;
