
// import { Avatar } from "@chakra-ui/avatar";
// import { Tooltip } from "@chakra-ui/tooltip";
// import ScrollableFeed from "react-scrollable-feed";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../config/ChatLogics";
// import { ChatState } from "../Context/ChatProvider";
// import ReminderButton from "./reminders/ReminderButton";
// import "./ScrollableChat.css"; // for hover styling

// const ScrollableChat = ({ messages }) => {
//   const { user } = ChatState();

//   return (
//     <ScrollableFeed>
//       {messages &&
//         messages.map((m, i) => {
//           const isOwnMessage = m.sender._id === user._id;

//           return (
//             <div
//               className="chat-message-wrapper"
//               key={m._id}
//               style={{
//                 display: "flex",
//                 justifyContent: isOwnMessage ? "flex-end" : "flex-start",
//                 alignItems: "center",
//                 gap: "6px",
//                 marginBottom: "6px",
//               }}
//             >
//               {!isOwnMessage &&
//                 (isSameSender(messages, m, i, user._id) ||
//                   isLastMessage(messages, i, user._id)) && (
//                   <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
//                     <Avatar
//                       mt="7px"
//                       mr={1}
//                       size="sm"
//                       cursor="pointer"
//                       name={m.sender.name}
//                       src={m.sender.pic}
//                     />
//                   </Tooltip>
//               )}

//               <div className="chat-bubble-wrapper">
//         <span
//   className="message-bubble"
//  style={{
//   backgroundColor: "rgba(255, 255, 255, 0.15)",
//   backdropFilter: "blur(12px)",
//   WebkitBackdropFilter: "blur(12px)",
//   border: "1px solid rgba(255, 255, 255, 0.2)",
//     color: isOwnMessage ? "#f0f9ff" : "#e6fff2",  // ✅ more visible
//   borderRadius: "20px",
//   padding: "8px 12px",
//   marginLeft: isSameSenderMargin(messages, m, i, user._id),
//   marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
//   display: "inline-block",
//   whiteSpace: "pre-wrap",
//   wordBreak: "break-word",
//   fontSize: "14px",
//   maxWidth: "75%",
//   position: "relative",
// }}

// >
//   {m.content}

//   {/* Very small timestamp below message */}
//   <div
//     style={{
//       fontSize: "9px",
//       color: "#666",
//       textAlign: "right",
//       marginTop: "4px",
//     }}
//   >
//     {new Date(m.createdAt).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     })}
//   </div>
// </span>
				

//                 {/* Bell icon outside the message bubble */}
//                 <div className="reminder-button-hover">
//                   <ReminderButton message={m.content} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//     </ScrollableFeed>
//   );
// };

// export default ScrollableChat;
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useState } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ReminderButton from "./reminders/ReminderButton";
import Picker from 'emoji-picker-react'; // npm i emoji-picker-react
import { MdOutlineDone, MdOutlineRemoveRedEye, MdReply, MdContentCopy, MdDelete } from "react-icons/md";
import "./ScrollableChat.css"; // ✨ Update this CSS for smooth animations & hover effects!

const getTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ScrollableChat = ({ messages, typingUser, onReply, onDelete, onCopy, onReact }) => {
  const { user } = ChatState();
  const [showEmoji, setShowEmoji] = useState(null); // messageId or null

  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => {
        const isOwnMessage = m.sender._id === user._id;
        // Replace below with your actual logic, or fetch from message object
        const isSeen = m.seen?.includes(user._id) || isOwnMessage;
        const showActions = !m.deleted;

        return (
          <div
            key={m._id}
            className={`chat-message-wrapper fade-in`}
            style={{
              display: "flex",
              justifyContent: isOwnMessage ? "flex-end" : "flex-start",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
              opacity: m.deleted ? 0.5 : 1,
            }}
            onMouseEnter={() => setShowEmoji(m._id)}
            onMouseLeave={() => setShowEmoji(null)}
          >
            {!isOwnMessage && (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
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

            <div className="chat-bubble-wrapper" style={{ position: "relative" }}>
              <span
                className="message-bubble"
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
                  boxShadow: isOwnMessage ? "0 2px 8px #509cf633" : "0 2px 8px #9bebb522",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                {/* Message Text / (support soft deleted message) */}
                {m.deleted
                  ? <i style={{ opacity: 0.4 }}>Message deleted</i>
                  : m.content}
                  
                {/* Emoji Reaction (simple) */}
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
                  {isOwnMessage && (
                    isSeen ? (
                      <MdOutlineRemoveRedEye style={{ marginLeft: 4, fontSize: "12px", verticalAlign: "middle", color: "#7ee660" }} title="Seen" />
                    ) : (
                      <MdOutlineDone style={{ marginLeft: 4, fontSize: "12px", verticalAlign: "middle", color: "#bbbbbb" }} title="Delivered" />
                    )
                  )}
                </div>
              </span>

              {/* Hover actions: Reply, Copy, Delete */}
              {showActions && showEmoji === m._id && (
                <div style={{ position: "absolute", right: isOwnMessage ? "-38px" : "auto", left: !isOwnMessage ? "-38px" : "auto", top: "5px", display: "flex", gap: "7px", zIndex: 1 }}>
                  <button title="Reply" className="bubble-action" onClick={() => onReply && onReply(m)}>
                    <MdReply />
                  </button>
                  <button title="Copy" className="bubble-action" onClick={() => onCopy && onCopy(m.content)}>
                    <MdContentCopy />
                  </button>
                  {isOwnMessage && (
                    <button title="Delete" className="bubble-action" onClick={() => onDelete && onDelete(m._id)}>
                      <MdDelete />
                    </button>
                  )}
                  {/* Emoji picker trigger */}
                  <button title="React" className="bubble-action" onClick={() => setShowEmoji(showEmoji === `${m._id}-emoji` ? null : `${m._id}-emoji`)}>
                    😀
                  </button>
                  {showEmoji === `${m._id}-emoji` && (
                    <div style={{ position: "absolute", top: "25px", right: 0, zIndex: 10 }}>
                      <Picker onEmojiClick={(e, emoji) => {
                        onReact && onReact(m._id, emoji.emoji);
                        setShowEmoji(null);
                      }} />
                    </div>
                  )}
                </div>
              )}

              {/* Reminder bell */}
              <div className="reminder-button-hover">
                <ReminderButton message={m.content} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {typingUser && (
        <div style={{ textAlign: "left", paddingLeft: 18, opacity: 0.75, margin: "10px 0", color: "#7c89f7" }}>
          <span className="typing-dot">...</span>
          <small style={{ marginLeft: 6 }}>{typingUser} is typing...</small>
        </div>
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;