
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ReminderButton from "./reminders/ReminderButton";
import "./ScrollableChat.css"; // for hover styling

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwnMessage = m.sender._id === user._id;

          return (
            <div
              className="chat-message-wrapper"
              key={m._id}
              style={{
                display: "flex",
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                alignItems: "center",
                gap: "6px",
                marginBottom: "6px",
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

              <div className="chat-bubble-wrapper">
        <span
  className="message-bubble"
 style={{
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
    color: isOwnMessage ? "#f0f9ff" : "#e6fff2",  // ✅ more visible
  borderRadius: "20px",
  padding: "8px 12px",
  marginLeft: isSameSenderMargin(messages, m, i, user._id),
  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
  display: "inline-block",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: "14px",
  maxWidth: "75%",
  position: "relative",
}}

>
  {m.content}

  {/* Very small timestamp below message */}
  <div
    style={{
      fontSize: "9px",
      color: "#666",
      textAlign: "right",
      marginTop: "4px",
    }}
  >
    {new Date(m.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </div>
</span>
				

                {/* Bell icon outside the message bubble */}
                <div className="reminder-button-hover">
                  <ReminderButton message={m.content} />
                </div>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
