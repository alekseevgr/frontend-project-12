import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styles from "../styles/App.module.css";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const handleClick = () => {
    navigate("/", { replace: true });
  };

  return (
    <header className={styles.appHeader}>
      <span type="button" onClick={() => handleClick()}>
        {t("chatName")}
      </span>
      {isAuthenticated ? (
        <Button type="button" onClick={() => dispatch(logout())}>
          {t("app.exit")}
        </Button>
      ) : null}
    </header>
  );
};

export default Header;
