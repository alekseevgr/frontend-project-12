import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import routes from "../../utils/routes";
import axios from "axios";
import { setActiveChannel } from "../../slices/channelsSlice";
import styles from "./Channels.module.css";

const RemoveСhannel = ({ show, onHide, channelId }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

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
        onHide();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className={styles.form}>
          <Button type="submit" className={styles.button}>
            Delete Channel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveСhannel;
// END
