import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import routes from "../../utils/routes";
import axios from "axios";
import { setActiveChannel } from "../../slices/channelsSlice";
import styles from "./Channels.module.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const RemoveChannel = ({ show, onHide, channelId }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .delete(routes.removeChannel(channelId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(setActiveChannel("1"));
        toast.success(t("toast.removing"));
        onHide();
      })
      .catch((e) => {
        toast.error(!e.response ? t("errors.network") : t("errors.unknown"));
      });
  };
  const handleCancel = () => {
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>{t("channels.deleteChannel")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className={styles.form}>
          <Button type="submit" className={styles.button}>
            {t("channels.delete")}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            className={styles.button}
          >
            {t("channels.reject")}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
// END
