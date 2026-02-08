import { useFormik } from "formik";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

import routes from "../../utils/routes";
import axios from "axios";
import styles from "./MessageList.module.css";
import { useTranslation } from "react-i18next";

//{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]
const NewMessage = () => {
  const token = useSelector((state) => state.auth.token);
  const currentName = useSelector((state) => state.auth.username);
  const currentId = useSelector((state) => state.channels.activeChannelId);

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values, { resetForm }) => {
      const newMessage = {
        body: values.message,
        channelId: currentId,
        username: currentName,
      };

      return axios
        .post(routes.messages(), newMessage, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          resetForm();
        })
        .catch((e) => {
          console.error(e);
        });
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className={styles.form}>
      <Form.Group className={styles.group}>
        <Form.Control
          id="message"
          name="message"
          type="text"
          value={formik.values.message}
          onChange={formik.handleChange}
          className={styles.input}
          placeholder={t("channels.typeMessage")}
        />
      </Form.Group>

      <Button type="submit" className={styles.button}>
        {t("channels.send")}
      </Button>
    </Form>
  );
};

export default NewMessage;
