import { useSelector, useDispatch } from "react-redux";
import { setActiveChannel } from "../../slices/channelsSlice";
import { useEffect, useRef, useState } from "react";
import AddChannel from "./AddChannel.jsx";
import RemoveChannel from "./RemoveChannel.jsx";
import RenameChannel from "./RenameChannel.jsx";
import styles from "../../styles/Channels.module.css";
import { useTranslation } from "react-i18next";

const ChatList = ({ channels }) => {
  const dispatch = useDispatch();
  const activeChannel = useSelector((state) => state.channels.activeChannelId);

  const [modal, setModal] = useState({ type: null, channelId: null });
  const hideModal = () => setModal({ type: null, channelId: null });

  const openAddModal = () => setModal({ type: "adding", channelId: null });
  const openRenameModal = (id) => setModal({ type: "renaming", channelId: id });
  const openRemoveModal = (id) => setModal({ type: "removing", channelId: id });

  const [openedMenuId, setOpenedMenuId] = useState(null);
  const rootRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpenedMenuId(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className={styles.channelsPanel} ref={rootRef}>
      <ul className={styles.channelsList}>
        {channels.map(({ id, name, removable }) => {
          const isActive = id === activeChannel;

          return (
            <li
              key={id}
              className={`${styles.channelItem} ${isActive ? styles.isActive : ""}`}
              role="button"
              onClick={() => dispatch(setActiveChannel(id))}
            >
              <span className={styles.channelName}># {name}</span>

              <div
                className={styles.channelActions}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.kebabBtn}
                  aria-label={t("channels.menu")}
                  onClick={() =>
                    setOpenedMenuId((prev) => (prev === id ? null : id))
                  }
                >
                  ⋮
                </button>

                {openedMenuId === id && (
                  <div className={styles.kebabMenu} role="menu">
                    <button
                      type="button"
                      className={styles.kebabItem}
                      onClick={() => {
                        setOpenedMenuId(null);
                        openRenameModal(id);
                      }}
                    >
                      {t("channels.edit")}
                    </button>

                    {removable && (
                      <button
                        type="button"
                        className={`${styles.kebabItem} ${styles.danger}`}
                        onClick={() => {
                          setOpenedMenuId(null);
                          openRemoveModal(id);
                        }}
                      >
                        {t("channels.delete")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {modal.type === "adding" && <AddChannel show onHide={hideModal} />}
      {modal.type === "renaming" && (
        <RenameChannel show onHide={hideModal} channelId={modal.channelId} />
      )}
      {modal.type === "removing" && (
        <RemoveChannel show onHide={hideModal} channelId={modal.channelId} />
      )}

      <button
        type="button"
        className={styles.addChannelBtn}
        onClick={openAddModal}
      >
        {t("channels.createChannel")}
      </button>
    </div>
  );
};

export default ChatList;
