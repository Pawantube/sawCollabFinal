// export const isSameSenderMargin = (messages, m, i, userId) => {
//   // console.log(i === messages.length - 1);

//   if (
//     i < messages.length - 1 &&
//     messages[i + 1].sender._id === m.sender._id &&
//     messages[i].sender._id !== userId
//   )
//     return 33;
//   else if (
//     (i < messages.length - 1 &&
//       messages[i + 1].sender._id !== m.sender._id &&
//       messages[i].sender._id !== userId) ||
//     (i === messages.length - 1 && messages[i].sender._id !== userId)
//   )
//     return 0;
//   else return "auto";
// };

// export const isSameSender = (messages, m, i, userId) => {
//   return (
//     i < messages.length - 1 &&
//     (messages[i + 1].sender._id !== m.sender._id ||
//       messages[i + 1].sender._id === undefined) &&
//     messages[i].sender._id !== userId
//   );
// };

// export const isLastMessage = (messages, i, userId) => {
//   return (
//     i === messages.length - 1 &&
//     messages[messages.length - 1].sender._id !== userId &&
//     messages[messages.length - 1].sender._id
//   );
// };

// export const isSameUser = (messages, m, i) => {
//   return i > 0 && messages[i - 1].sender._id === m.sender._id;
// };

// export const getSender = (loggedUser, users) => {
//   return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
// };

// export const getSenderFull = (loggedUser, users) => {
//   return users[0]._id === loggedUser._id ? users[1] : users[0];
// };
// 🎉 Welcome to the Chat Logic Funhouse! 🎉
// These little helpers ensure our chat looks sleek, smart, and totally in sync.
// They're the unsung heroes of smooth conversations!

import { isObjectAndHasId } from './utils'; // Assuming a utility to check object and _id exists

// Constants for clearer magic numbers
const AVATAR_MARGIN_PX = 33; // Standard margin to reserve space for an avatar
const NO_MARGIN = 0;

/**
 * 📏 isSameSenderMargin: The Spacing Maestro! 📏
 * Determines the left margin for a message bubble. This is crucial for
 * making chat bubbles "group" nicely and leave space for avatars only when needed.
 *
 * Imagine: If two messages from the SAME 'other' person are consecutive,
 * we don't need to show their avatar twice! So, we add a margin for the first one
 * (where the avatar would be) and zero margin for subsequent messages.
 * If it's *your* message, it just aligns to the right.
 *
 * @param {Array<Object>} messages - The array of all messages in the chat.
 * @param {Object} m - The current message object we're evaluating.
 * @param {number} i - The index of the current message in the messages array.
 * @param {string} userId - The ID of the currently logged-in user.
 * @returns {number|string} The margin value (e.g., 33, 0, or "auto" for your messages).
 */
export const isSameSenderMargin = (messages, m, i, userId) => {
  // Defensive check: Ensure we have valid message data before peeking!
  if (!messages || !Array.isArray(messages) || messages.length === 0 || !m || !isObjectAndHasId(m.sender)) {
    console.warn("isSameSenderMargin: Invalid messages array or current message object.", { messages, m });
    return "auto"; // Default to auto-align to prevent layout issues
  }

  const nextMessage = messages[i + 1];
  const isMyMessage = m.sender._id === userId;
  const isLastMessageInSequenceByOthers = (
    !isMyMessage && // It's not my message
    (!nextMessage || // This is the very last message in the chat
     !isObjectAndHasId(nextMessage.sender) || // Or the next message sender is invalid (rare)
     nextMessage.sender._id !== m.sender._id) // Or the next message is by a different sender
  );

  const isConsecutiveOtherSenderMessage = (
    i < messages.length - 1 && // Not the very last message
    isObjectAndHasId(nextMessage.sender) && // Next message sender is valid
    nextMessage.sender._id === m.sender._id && // Next message is by the same sender
    !isMyMessage // And it's not my message (it's someone else's sequence)
  );

  if (isConsecutiveOtherSenderMessage) {
    // Aha! Another message from the same person. No need for another avatar here,
    // so we leave space for the "ghost" avatar to keep alignment clean.
    return AVATAR_MARGIN_PX;
  } else if (isLastMessageInSequenceByOthers) {
    // This is the last message from this "other" sender in a sequence (or the whole chat).
    // We want their avatar to show up properly next to it, so no extra margin needed.
    return NO_MARGIN;
  } else {
    // If it's *my* message, or something unexpected, let CSS handle the right alignment.
    return "auto";
  }
};

/**
 * 👤 isSameSender: The Avatar Whisperer! 🤫
 * Decides whether to display the sender's avatar next to a message.
 * We only want to show the avatar for the *first* message in a sequence
 * from a particular user (who isn't you!).
 *
 * @param {Array<Object>} messages - The array of all messages.
 * @param {Object} m - The current message object.
 * @param {number} i - The index of the current message.
 * @param {string} userId - The ID of the logged-in user.
 * @returns {boolean} True if the avatar should be shown.
 */
export const isSameSender = (messages, m, i, userId) => {
  // Basic validation to prevent peeking at undefined properties
  if (!messages || !Array.isArray(messages) || messages.length === 0 || !m || !isObjectAndHasId(m.sender)) {
    return false;
  }

  const nextMessage = messages[i + 1];
  const isMyMessage = m.sender._id === userId;

  // We show the avatar if:
  // 1. It's NOT my message.
  // 2. AND (it's the very last message in the chat OR the next message is from a DIFFERENT sender).
  // This cleverly ensures the avatar is displayed for the final message in a sender's block.
  const shouldShowAvatar = (
    !isMyMessage &&
    (i === messages.length - 1 || // It's the last message overall
     !nextMessage || // Or there is no next message (should be covered by i === messages.length - 1)
     !isObjectAndHasId(nextMessage.sender) || // Or the next message sender data is fishy
     nextMessage.sender._id !== m.sender._id) // Or the next message is from a different person
  );

  return shouldShowAvatar;
};


/**
 * 🏁 isLastMessage: The Grand Finale Detector! 🏁
 * Checks if the current message is literally the *very last* message in the entire chat
 * AND it was sent by someone other than the logged-in user.
 * Useful for positioning things like "read receipts" or the last avatar.
 *
 * @param {Array<Object>} messages - The array of all messages.
 * @param {number} i - The index of the current message.
 * @param {string} userId - The ID of the logged-in user.
 * @returns {boolean} True if it's the last message by someone else.
 */
export const isLastMessage = (messages, i, userId) => {
  // Safety dance: Is there even a last message to check?
  if (!messages || messages.length === 0) return false;

  const lastMsg = messages[messages.length - 1];
  // More safety: Does the last message actually have a sender ID?
  if (!lastMsg || !isObjectAndHasId(lastMsg.sender)) return false;

  return (
    i === messages.length - 1 && // Is it truly the last one?
    lastMsg.sender._id !== userId // And is it NOT from me?
  );
};

/**
 * 🤝 isSameUser: The Buddy Detector! 🤝
 * Checks if the current message was sent by the *same person* as the immediately
 * preceding message. This is great for stacking messages without showing
 * the sender's name/avatar repeatedly, making conversations flow better.
 *
 * @param {Array<Object>} messages - The array of all messages.
 * @param {Object} m - The current message object.
 * @param {number} i - The index of the current message.
 * @returns {boolean} True if the current message sender is the same as the previous.
 */
export const isSameUser = (messages, m, i) => {
  // Can't be the same user if there's no previous message!
  if (i === 0 || !messages || !Array.isArray(messages) || messages.length === 0) return false;

  const prevMessage = messages[i - 1];
  // Double-check if previous message and current message have valid sender IDs
  if (!prevMessage || !isObjectAndHasId(prevMessage.sender) || !m || !isObjectAndHasId(m.sender)) {
    return false;
  }

  return prevMessage.sender._id === m.sender._id;
};


/**
 * 👯 getSender: The Wingman/Wingwoman Finder! 👯‍♀️
 * In a 1-on-1 chat, this function quickly figures out who the *other* person is
 * (the one who isn't you!) and returns their name.
 * Super handy for displaying the chat's header.
 *
 * @param {Object} loggedUser - The object of the currently logged-in user.
 * @param {Array<Object>} users - An array containing the two user objects in the 1-on-1 chat.
 * @returns {string} The name of the other participant.
 */
export const getSender = (loggedUser, users) => {
  // Robustness check: Ensure we have valid users and loggedUser to compare!
  if (!loggedUser || !isObjectAndHasId(loggedUser) || !users || users.length < 2 || !isObjectAndHasId(users[0]) || !isObjectAndHasId(users[1])) {
    console.warn("getSender: Missing or invalid loggedUser or users array.", { loggedUser, users });
    return "Unknown User"; // A graceful fallback
  }

  // If the first user in the array is *me*, then the second user is the sender.
  // Otherwise, the first user is the sender. Simple logic, but critical!
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

/**
 * 🧑‍💻 getSenderFull: The Full Profile Fetcher! 🧑‍💻
 * Similar to `getSender`, but instead of just their name, this returns the
 * *entire user object* of the other participant in a 1-on-1 chat.
 * Useful for displaying their avatar, email, or any other profile info.
 *
 * @param {Object} loggedUser - The object of the currently logged-in user.
 * @param {Array<Object>} users - An array containing the two user objects in the 1-on-1 chat.
 * @returns {Object} The full user object of the other participant.
 */
export const getSenderFull = (loggedUser, users) => {
  // Robustness check: Same as above, gotta be safe!
  if (!loggedUser || !isObjectAndHasId(loggedUser) || !users || users.length < 2 || !isObjectAndHasId(users[0]) || !isObjectAndHasId(users[1])) {
    console.warn("getSenderFull: Missing or invalid loggedUser or users array.", { loggedUser, users });
    return {}; // Return an empty object for graceful handling
  }

  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// --- A little utility for extra safety! ---
// You'll need to define this in a `utils.js` or similar file and import it.
// This function adds an extra layer of defense against incomplete data.
// It helps in ensuring `sender` objects actually have an `_id` property.
// Example content for `./utils.js`:
/*
  export const isObjectAndHasId = (obj) => {
    return obj && typeof obj === 'object' && typeof obj._id === 'string' && obj._id.length > 0;
  };
*/