import { useFormik } from "formik";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

import routes from "../../utils/routes";
import axios from "axios";
import styles from "../../styles/MessageList.module.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useRollbar } from "@rollbar/react";
import { useRef, useEffect } from "react";

import filter from "leo-profanity";

//{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]
const NewMessage = () => {
  const token = useSelector((state) => state.auth.token);
  const currentName = useSelector((state) => state.auth.username);
  const currentId = useSelector((state) => state.channels.activeChannelId);

  const { t } = useTranslation();
  const rollbar = useRollbar();

  const inputRef = useRef(null);
  const MAX_HEIGHT = 120;

  const growOnly = () => {
    const el = inputRef.current;
    if (!el) return;

    const next = Math.min(el.scrollHeight, MAX_HEIGHT);
    if (next > el.offsetHeight) {
      el.style.height = `${next}px`;
    }
  };

  const resetHeight = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "";
  };

  useEffect(() => {
    resetHeight();
  }, []);

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
          resetHeight();
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
          as="textarea"
          rows={1}
          ref={inputRef}
          id="message"
          name="message"
          aria-label={t("channels.newMessage")}
          value={formik.values.message}
          onChange={(e) => {
            formik.handleChange(e);
            growOnly();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formik.handleSubmit();
            }
          }}
          placeholder={t("channels.typeMessage")}
          className={styles.input}
        />
      </Form.Group>

      <Button type="submit" variant="primary" className={styles.button}>
        {t("channels.send")}
      </Button>
    </Form>
  );
};

export default NewMessage;
