import { Link } from "react-router-dom";
import styles from "./StartPage.module.css";

const NotFound = () => {
  return (
    <div className={styles.root}>
      <div>incorrect path, please go</div>
      <Link className={styles.link} to="/">
        chat
      </Link>
    </div>
  );
};

export default NotFound;
