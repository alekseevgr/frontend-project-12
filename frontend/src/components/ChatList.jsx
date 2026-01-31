import { useSelector, useDispatch } from "react-redux";
import { setActiveChannel } from "../slices/channelsSlice";
import { Button, Modal } from "react-bootstrap";

const ChatList = ({ channels }) => {
  const dispatch = useDispatch();
  const activeChannel = useSelector((state) => state.channels.activeChannelId);
  // const [modal, setModal] = useState(false);
  // const hide = () => setModal(talse)


  // [{ id: '1', name: 'general', removable: false }, ...]

  return (
    <>
      <ul className="list-group">
        {channels.map(({ id, name }) => {
          const isActive = id === activeChannel;
          const itemClass = `list-group-item list-group-item-action${isActive ? " active" : ""}`;
          return (
            <>
            <li
              key={id}
              className={itemClass}
              role="button"
              onClick={() => dispatch(setActiveChannel(id))}
            >
              #{name}
            </li>

            {/* <Button></Button>
             <Modal show onHide={hide} onAdd={onSubmit} /> */}

            </>
          );
        })}
      </ul>
    </>
  );
};

export default ChatList;
