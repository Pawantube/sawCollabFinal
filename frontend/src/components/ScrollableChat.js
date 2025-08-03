// // // // // // import { Avatar } from "@chakra-ui/avatar";
// // // // // // import { Tooltip } from "@chakra-ui/tooltip";
// // // // // // import ScrollableFeed from "react-scrollable-feed";
// // // // // // import {
// // // // // //   isLastMessage,
// // // // // //   isSameSender,
// // // // // //   isSameSenderMargin,
// // // // // //   isSameUser,
// // // // // // } from "../config/ChatLogics";
// // // // // // import { ChatState } from "../Context/ChatProvider";
// // // // // // import ReminderButton from "./reminders/ReminderButton"; // Make sure this path is correct

// // // // // // const ScrollableChat = ({ messages }) => {
// // // // // //   const { user } = ChatState();

// // // // // //   return (
// // // // // //     <ScrollableFeed>
// // // // // //       {messages &&
// // // // // //         messages.map((m, i) => (
// // // // // //           <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
// // // // // //             {(isSameSender(messages, m, i, user._id) ||
// // // // // //               isLastMessage(messages, i, user._id)) && (
// // // // // //               <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
// // // // // //                 <Avatar
// // // // // //                   mt="7px"
// // // // // //                   mr={1}
// // // // // //                   size="sm"
// // // // // //                   cursor="pointer"
// // // // // //                   name={m.sender.name}
// // // // // //                   src={m.sender.pic}
// // // // // //                 />
// // // // // //               </Tooltip>
// // // // // //             )}

// // // // // //             {/* Message Bubble with Reminder Icon */}
// // // // // //             <div
// // // // // //               style={{
// // // // // //                 position: "relative",
// // // // // //                 display: "flex",
// // // // // //                 alignItems: "center",
				
// // // // // //               }}
// // // // // //             >
// // // // // //               <span
// // // // // //                 style={{
// // // // // //                   backgroundColor: `${
// // // // // //                     m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
// // // // // //                   }`,
// // // // // //                   marginLeft: isSameSenderMargin(messages, m, i, user._id),
// // // // // //                   marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
// // // // // //                   borderRadius: "20px",
// // // // // //                   padding: "5px 15px",
// // // // // //                   maxWidth: "75%",
// // // // // //                   position: "relative",
// // // // // //                 }}
// // // // // //               >
// // // // // //                 {m.content}

// // // // // //                 {/* 🔔 Reminder Button */}
// // // // // //                 <div style={{ position: "absolute", top: "4px", right: "6px" }}>
// // // // // //                   <ReminderButton message={m.content} />
// // // // // //                 </div>
// // // // // //               </span>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         ))}
// // // // // //     </ScrollableFeed>
// // // // // //   );
// // // // // // };

// // // // // // export default ScrollableChat;
// // // // // import { Avatar } from "@chakra-ui/avatar";
// // // // // import { Tooltip } from "@chakra-ui/tooltip";
// // // // // import ScrollableFeed from "react-scrollable-feed";
// // // // // import {
// // // // //   isLastMessage,
// // // // //   isSameSender,
// // // // //   isSameSenderMargin,
// // // // //   isSameUser,
// // // // // } from "../config/ChatLogics";
// // // // // import { ChatState } from "../Context/ChatProvider";
// // // // // import ReminderButton from "./reminders/ReminderButton"; // Ensure this path is correct

// // // // // const ScrollableChat = ({ messages }) => {
// // // // //   const { user } = ChatState();

// // // // //   return (
// // // // //     <ScrollableFeed>
// // // // //       {messages &&
// // // // //         messages.map((m, i) => (
// // // // //           <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
// // // // //             {(isSameSender(messages, m, i, user._id) ||
// // // // //               isLastMessage(messages, i, user._id)) && (
// // // // //               <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
// // // // //                 <Avatar
// // // // //                   mt="7px"
// // // // //                   mr={1}
// // // // //                   size="sm"
// // // // //                   cursor="pointer"
// // // // //                   name={m.sender.name}
// // // // //                   src={m.sender.pic}
// // // // //                 />
// // // // //               </Tooltip>
// // // // //             )}

// // // // //             {/* Message bubble and reminder button */}
// // // // //             <div
// // // // //               style={{
// // // // //                 position: "relative",
// // // // //                 display: "flex",
// // // // //                 alignItems: "center",
// // // // //                 width: "100%", // helps maintain layout
// // // // //               }}
// // // // //             >
// // // // //               <div
// // // // //                 style={{
// // // // //                   backgroundColor: `${
// // // // //                     m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
// // // // //                   }`,
// // // // //                   marginLeft: isSameSenderMargin(messages, m, i, user._id),
// // // // //                   marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
// // // // //                   borderRadius: "20px",
// // // // //                   padding: "5px 35px 5px 15px", // extra right padding for reminder icon
// // // // //                   maxWidth: "75%",
// // // // //                   position: "relative",
// // // // //                   wordBreak: "break-word",
// // // // //                 }}
// // // // //               >
// // // // //                 {m.content}

// // // // //                 {/* 🔔 Reminder Button */}
// // // // //                 <div
// // // // //                   style={{
// // // // //                     position: "absolute",
// // // // //                     top: "4px",
// // // // //                     right: "8px",
// // // // //                     zIndex: 1,
// // // // //                   }}
// // // // //                 >
// // // // //                   <ReminderButton message={m.content} />
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}
// // // // //     </ScrollableFeed>
// // // // //   );
// // // // // };

// // // // // export default ScrollableChat;
// // // // //

// // // // // 
// // // // import { Avatar } from "@chakra-ui/avatar";
// // // // import { Tooltip } from "@chakra-ui/tooltip";
// // // // import ScrollableFeed from "react-scrollable-feed";
// // // // import {
// // // //   isLastMessage,
// // // //   isSameSender,
// // // //   isSameSenderMargin,
// // // //   isSameUser,
// // // // } from "../config/ChatLogics";
// // // // import { ChatState } from "../Context/ChatProvider";
// // // // import ReminderButton from "./reminders/ReminderButton"; // Ensure path is correct

// // // // const ScrollableChat = ({ messages }) => {
// // // //   const { user } = ChatState();

// // // //   return (
// // // //     <ScrollableFeed>
// // // //       {messages &&
// // // //         messages.map((m, i) => (
// // // //           <div
// // // //             key={m._id}
// // // //             style={{
// // // //               display: "flex",
// // // //               alignItems: "flex-start",
// // // //               marginBottom: "5px",
// // // //               overflowWrap: "anywhere",
// // // //               wordBreak: "break-word",
// // // //               maxWidth: "100%",
// // // //             }}
// // // //           >
// // // //             {(isSameSender(messages, m, i, user._id) ||
// // // //               isLastMessage(messages, i, user._id)) && (
// // // //               <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
// // // //                 <Avatar
// // // //                   mt="7px"
// // // //                   mr={1}
// // // //                   size="sm"
// // // //                   cursor="pointer"
// // // //                   name={m.sender.name}
// // // //                   src={m.sender.pic}
// // // //                 />
// // // //               </Tooltip>
// // // //             )}

// // // //             <div
// // // //               style={{
// // // //                 position: "relative",
// // // //                 display: "flex",
// // // //                 alignItems: "center",
// // // //                 maxWidth: "100%",
// // // //               }}
// // // //             >
// // // //               <span
// // // //                 style={{
// // // //                   backgroundColor: `${
// // // //                     m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
// // // //                   }`,
// // // //                   marginLeft: isSameSenderMargin(messages, m, i, user._id),
// // // //                   marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
// // // //                   borderRadius: "20px",
// // // //                   padding: "5px 15px",
// // // //                   maxWidth: "100%",
// // // //                   position: "relative",
// // // //                   overflowWrap: "anywhere",
// // // //                   wordBreak: "break-word",
// // // //                   whiteSpace: "pre-wrap",
// // // //                 }}
// // // //               >
// // // //                 {m.content}

// // // //                 {/* 🔔 Reminder Button */}
// // // //                 <div
// // // //                   style={{
// // // //                     position: "absolute",
// // // //                     top: "4px",
// // // //                     right: "6px",
// // // //                   }}
// // // //                 >
// // // //                   <ReminderButton message={m.content} />
// // // //                 </div>
// // // //               </span>
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //     </ScrollableFeed>
// // // //   );
// // // // };

// // // // export default ScrollableChat;



// // // import { Avatar } from "@chakra-ui/avatar";
// // // import { Tooltip } from "@chakra-ui/tooltip";
// // // import ScrollableFeed from "react-scrollable-feed";
// // // import {
// // //   isLastMessage,
// // //   isSameSender,
// // //   isSameSenderMargin,
// // //   isSameUser,
// // // } from "../config/ChatLogics";
// // // import { ChatState } from "../Context/ChatProvider";
// // // import ReminderButton from "./reminders/ReminderButton"; // Ensure path is correct

// // // const ScrollableChat = ({ messages }) => {
// // //   const { user } = ChatState();

// // //   return (
// // //     <ScrollableFeed>
// // //       {messages &&
// // //         messages.map((m, i) => {
// // //           const isOwnMessage = m.sender._id === user._id;

// // //           return (
// // //             <div
// // //               key={m._id}
// // //               style={{
// // //                 display: "flex",
// // //                 justifyContent: isOwnMessage ? "flex-end" : "flex-start",
// // //                 marginBottom: "5px",
// // //                 overflowWrap: "anywhere",
// // //               }}
// // //             >
// // //               {!isOwnMessage &&
// // //                 (isSameSender(messages, m, i, user._id) ||
// // //                   isLastMessage(messages, i, user._id)) && (
// // //                   <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
// // //                     <Avatar
// // //                       mt="7px"
// // //                       mr={1}
// // //                       size="sm"
// // //                       cursor="pointer"
// // //                       name={m.sender.name}
// // //                       src={m.sender.pic}
// // //                     />
// // //                   </Tooltip>
// // //               )}

// // //               <div
// // //                 style={{
// // //                   position: "relative",
// // //                   maxWidth: "75%",
// // //                   display: "flex",
// // //                   flexDirection: "column",
// // //                   alignItems: isOwnMessage ? "flex-end" : "flex-start",
// // //                 }}
// // //               >
// // //                 <span
// // //                   style={{
// // //                     backgroundColor: isOwnMessage ? "#BEE3F8" : "#B9F5D0",
// // //                     borderRadius: "20px",
// // //                     padding: "5px 15px",
// // //                     marginLeft: isSameSenderMargin(messages, m, i, user._id),
// // //                     marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
// // //                     position: "relative",
// // //                     overflowWrap: "anywhere",
// // //                     wordBreak: "break-word",
// // //                     whiteSpace: "pre-wrap",
// // //                   }}
// // //                 >
// // //                   {m.content}

// // //                   {/* 🔔 Reminder Button */}
// // //                   <div
// // //                     style={{
// // //                       position: "absolute",
// // //                       top: "4px",
// // //                       right: "6px",
// // //                     }}
// // //                   >
// // //                     <ReminderButton message={m.content} />
// // //                   </div>
// // //                 </span>
// // //               </div>
// // //             </div>
// // //           );
// // //         })}
// // //     </ScrollableFeed>
// // //   );
// // // };

// // // export default ScrollableChat;
// // import { Avatar } from "@chakra-ui/avatar";
// // import { Tooltip } from "@chakra-ui/tooltip";
// // import ScrollableFeed from "react-scrollable-feed";
// // import {
// //   isLastMessage,
// //   isSameSender,
// //   isSameSenderMargin,
// //   isSameUser,
// // } from "../config/ChatLogics";
// // import { ChatState } from "../Context/ChatProvider";
// // import ReminderButton from "./reminders/ReminderButton";

// // const ScrollableChat = ({ messages }) => {
// //   const { user } = ChatState();

// //   return (
// //     <ScrollableFeed>
// //       {messages &&
// //         messages.map((m, i) => {
// //           const isOwnMessage = m.sender._id === user._id;

// //           return (
// //             <div
// //               key={m._id}
// //               style={{
// //                 display: "flex",
// //                 justifyContent: isOwnMessage ? "flex-end" : "flex-start",
// //                 marginBottom: "6px",
// //               }}
// //             >
// //               {!isOwnMessage &&
// //                 (isSameSender(messages, m, i, user._id) ||
// //                   isLastMessage(messages, i, user._id)) && (
// //                   <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
// //                     <Avatar
// //                       mt="7px"
// //                       mr={1}
// //                       size="sm"
// //                       cursor="pointer"
// //                       name={m.sender.name}
// //                       src={m.sender.pic}
// //                     />
// //                   </Tooltip>
// //               )}

// //               {/* Bubble Container */}
// //               <div
// //                 style={{
// //                   position: "relative",
// //                   maxWidth: "75%",
// //                   display: "flex",
// //                   flexDirection: "column",
// //                   alignItems: isOwnMessage ? "flex-end" : "flex-start",
// //                 }}
// //               >
// //                 {/* Message Bubble with Hoverable Bell */}
// //                 <div
// //                   className="message-bubble"
// //                   style={{
// //                     backgroundColor: isOwnMessage ? "#BEE3F8" : "#B9F5D0",
// //                     borderRadius: "20px",
// //                     padding: "8px 15px",
// //                     marginLeft: isSameSenderMargin(messages, m, i, user._id),
// //                     marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
// //                     position: "relative",
// //                     overflowWrap: "anywhere",
// //                     wordBreak: "break-word",
// //                     whiteSpace: "pre-wrap",
// //                   }}
// //                 >
// //                   {m.content}

// //                   {/* Bell Icon on Hover */}
// //                   <div
// //                     className="reminder-icon"
// //                     style={{
// //                       position: "absolute",
// //                       top: "6px",
// //                       right: "8px",
// //                       display: "none",
// //                     }}
// //                   >
// //                     <ReminderButton message={m.content} />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       <style>
// //         {`
// //           .message-bubble:hover .reminder-icon {
// //             display: block;
// //           }
// //         `}
// //       </style>
// //     </ScrollableFeed>
// //   );
// // };

// // export default ScrollableChat;
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
// import "./ScrollableChat.css"; // ✅ CSS file for hover styling

// const ScrollableChat = ({ messages }) => {
//   const { user } = ChatState();

//   return (
//     <ScrollableFeed>
//       {messages &&
//         messages.map((m, i) => {
//           const isOwnMessage = m.sender._id === user._id;

//           return (
//             <div
//               key={m._id}
//               style={{
//                 display: "flex",
//                 justifyContent: isOwnMessage ? "flex-end" : "flex-start",
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

//               <div
//                 className="message-container"
//                 style={{
//                   maxWidth: "75%",
//                   position: "relative",
//                 }}
//               >
//                 <span
//                   className="message-bubble"
//                   style={{
//                     backgroundColor: isOwnMessage ? "#BEE3F8" : "#B9F5D0",
//                     borderRadius: "20px",
//                     padding: "8px 15px",
//                     marginLeft: isSameSenderMargin(messages, m, i, user._id),
//                     marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
//                     display: "inline-block",
//                     whiteSpace: "pre-wrap",
//                     wordBreak: "break-word",
//                   }}
//                 >
//                   {m.content}

//                   <div className="reminder-icon">
//                     <ReminderButton message={m.content} />
//                   </div>
//                 </span>
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
