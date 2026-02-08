import { useFormik } from "formik";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

import routes from "../../utils/routes";
import axios from "axios";
import styles from "./MessageList.module.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useRollbar } from "@rollbar/react";

import filter from "leo-profanity";

//{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]
const NewMessage = () => {
  const token = useSelector((state) => state.auth.token);
  const currentName = useSelector((state) => state.auth.username);
  const currentId = useSelector((state) => state.channels.activeChannelId);

  const { t } = useTranslation();
  const rollbar = useRollbar();

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values, { resetForm }) => {
      const raw = values.message.trim();
      if (!raw) return;

      const cleaned = filter.clean(raw);

      if (cleaned !== raw) {
        toast.info(t("toast.profanityCleaned"));
      }

      const newMessage = {
        body: cleaned,
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
          rollbar.error("Send message failed", e, {
            data: {
              channelId: newMessage.channelId,
              username: newMessage.username,
            },
            status: e?.response?.status,
          });
          toast.error(!e.response ? t("errors.network") : t("errors.unknown"));
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
