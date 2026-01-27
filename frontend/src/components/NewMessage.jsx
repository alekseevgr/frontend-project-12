import { useFormik } from "formik";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import routes from "../utils/routes";
import axios from "axios";
import { addMessage } from "../slices/messagesSlice";

//{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]
const NewMessage = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const currentName = useSelector((state) => state.auth.username);
  const currentId = useSelector((state) => state.channels.currentChannelId);

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
        .then((response) => {
          dispatch(addMessage(response.data))

          console.log(response.data);
          resetForm();
        })
        .catch((e) => {
          console.error(e);
        });
      //  .then((response) => {
      //   console.log(response.data); // => { id: '1', body: 'new message', channelId: '1', username: 'admin }
      // });
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="new-message">
      <Form.Group className="new-message__group">
        
        <Form.Control
          id="message"
          name="message"
          type="text"
          value={formik.values.message}
          onChange={formik.handleChange}
          className="new-message__input"
          placeholder="Type a message..."
        />
      </Form.Group>

      <Button type="submit" className="new-message__button">
        Send
      </Button>
    </Form>
  );
};

export default NewMessage;
