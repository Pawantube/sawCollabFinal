import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useEffect, useRef, useState } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ReminderButton from "./reminders/ReminderButton";
import Picker from "emoji-picker-react";
import {
  MdOutlineDone,
  MdOutlineRemoveRedEye,
  MdReply,
  MdContentCopy,
  MdDelete,
  MdForward,
  MdStar,
  MdEdit,
  MdPushPin,
} from "react-icons/md";

const ScrollableChat = ({
  messages,
  typingUser,
  onReply,
  onDelete,
  onCopy,
  onReact,
  onForward,
  onPin,
  onStar,
  onEdit,
}) => {
  const { user } = ChatState();
  const [showEmoji, setShowEmoji] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const menuRef = useRef();

  const getTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Close action menu or emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMessage(null);
        setShowEmoji(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwnMessage = m.sender._id === user._id;
          const isSeen = m.seen?.includes(user._id) || isOwnMessage;

          return (
            <div
              key={m._id}
              style={{
                display: "flex",
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                alignItems: "center",
                gap: "6px",
                marginBottom: "6px",
                opacity: m.deleted ? 0.5 : 1,
                position: "relative",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveMessage(activeMessage === m._id ? null : m._id);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                setActiveMessage(activeMessage === m._id ? null : m._id);
              }}
            >
              {!isOwnMessage &&
                (isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}

              <div style={{ position: "relative" }}>
                <span
                  style={{
                    background: isOwnMessage
                      ? "linear-gradient(120deg, #509cf6, #c3e8fd)"
                      : "linear-gradient(120deg, #9bebb5, #f5fafb)",
                    color: isOwnMessage ? "#fff" : "#222",
                    borderRadius: "20px",
                    padding: "8px 14px",
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    fontSize: "15px",
                    maxWidth: "70vw",
                    boxShadow: isOwnMessage
                      ? "0 2px 8px #509cf633"
                      : "0 2px 8px #9bebb522",
                    position: "relative",
                    display: "inline-block",
                    wordWrap: "break-word",
                  }}
                >
                  {m.deleted ? (
                    <i style={{ opacity: 0.4 }}>Message deleted</i>
                  ) : (
                    m.content
                  )}
                  {m.reactions && m.reactions.length > 0 && (
                    <span style={{ marginLeft: 8, fontSize: "17px" }}>
                      {m.reactions.join(" ")}
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#888",
                      textAlign: "right",
                      marginTop: "4px",
                    }}
                  >
                    {getTime(m.createdAt)}
                    {isOwnMessage &&
                      (isSeen ? (
                        <MdOutlineRemoveRedEye
                          style={{
                            marginLeft: 4,
                            fontSize: "12px",
                            verticalAlign: "middle",
                            color: "#7ee660",
                          }}
                          title="Seen"
                        />
                      ) : (
                        <MdOutlineDone
                          style={{
                            marginLeft: 4,
                            fontSize: "12px",
                            verticalAlign: "middle",
                            color: "#bbbbbb",
                          }}
                          title="Delivered"
                        />
                      ))}
                  </div>
                </span>

                {activeMessage === m._id && (
                  <div
                    ref={menuRef}
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "#fff",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      zIndex: 100,
                      width: "max-content",
                      minWidth: "160px",
                      maxWidth: "90vw",
                      marginTop: 6,
                    }}
                  >
                    <button className="bubble-action" onClick={() => console.log("Info")}>
                      <MdOutlineRemoveRedEye /> Message Info
                    </button>
                    <button className="bubble-action" onClick={() => onReply?.(m)}>
                      <MdReply /> Reply
                    </button>
                    <button className="bubble-action" onClick={() => onCopy?.(m.content)}>
                      <MdContentCopy /> Copy
                    </button>
                    <button
                      className="bubble-action"
                      onClick={() =>
                        setShowEmoji(showEmoji === m._id ? null : m._id)
                      }
                    >
                      😀 React
                    </button>
                    <button className="bubble-action" onClick={() => onForward?.(m)}>
                      <MdForward /> Forward
                    </button>
                    <button className="bubble-action" onClick={() => onPin?.(m)}>
                      <MdPushPin /> Pin
                    </button>
                    <button className="bubble-action" onClick={() => onStar?.(m)}>
                      <MdStar /> Star
                    </button>
                    <button className="bubble-action" onClick={() => onEdit?.(m)}>
                      <MdEdit /> Edit
                    </button>
                    {isOwnMessage && (
                      <button className="bubble-action" onClick={() => onDelete?.(m._id)}>
                        <MdDelete /> Delete
                      </button>
                    )}
                  </div>
                )}

                {showEmoji === m._id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      zIndex: 200,
                    }}
                  >
                    <Picker
                      onEmojiClick={(event, emojiObject) => {
                        onReact?.(m._id, emojiObject.emoji);
                        setShowEmoji(null);
                      }}
                    />
                  </div>
                )}

                <div className="reminder-button-hover">
                  <ReminderButton message={m.content} />
                </div>
              </div>
            </div>
          );
        })}

      {typingUser && (
        <div
          style={{
            textAlign: "left",
            paddingLeft: 18,
            opacity: 0.75,
            margin: "10px 0",
            color: "#7c89f7",
          }}
        >
          <span className="typing-dot">...</span>
          <small style={{ marginLeft: 6 }}>{typingUser} is typing...</small>
        </div>
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
