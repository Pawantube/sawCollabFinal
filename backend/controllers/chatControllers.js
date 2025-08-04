const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// @description Create or fetch One-to-One Chat
// @route POST /api/chat/
// @access Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body; // The ID of the user to chat with

  // Input validation: Ensure userId is provided
  if (!userId) {
    console.warn("accessChat: UserId param not sent with request.");
    res.status(400);
    throw new Error("User ID is required to access or create a chat.");
  }

  // Ensure req.user._id is available (from protect middleware)
  if (!req.user || !req.user._id) {
    console.error("accessChat: User not authenticated or user ID missing from request.");
    res.status(401); // Unauthorized
    throw new Error("Authentication required to access chats.");
  }

  try {
    // Attempt to find an existing one-to-one chat between the two users
    var isChat = await Chat.find({
      isGroupChat: false, // Ensure it's a one-to-one chat
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } }, // User A is in chat
        { users: { $elemMatch: { $eq: userId } } },       // User B is in chat
      ],
    })
      .populate("users", "-password") // Populate user details, exclude password
      .populate("latestMessage");     // Populate the latest message

    // Further populate the sender of the latest message
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      // If chat exists, send the first (and only) found chat
      res.status(200).json(isChat[0]);
    } else {
      // If no chat exists, create a new one-to-one chat
      const chatData = {
        chatName: "sender", // Default name, can be client-side derived
        isGroupChat: false,
        users: [req.user._id, userId], // Include both users
      };

      const createdChat = await Chat.create(chatData);

      // Fetch the newly created chat with populated user details
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    }
  } catch (error) {
    console.error("accessChat: Error accessing or creating chat:", error.message);
    res.status(500); // Internal Server Error for database issues
    throw new Error("Failed to access or create chat. Please try again.");
  }
});

// @description Fetch all chats for a user
// @route GET /api/chat/
// @access Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Find all chats where the logged-in user is a participant
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")      // Populate chat users
      .populate("groupAdmin", "-password") // Populate group admin
      .populate("latestMessage")           // Populate latest message
      .sort({ updatedAt: -1 })             // Sort by latest update (most recent first)
      .lean(); // Use .lean() for performance since we're just reading

    // Further populate the sender of the latest message for all chats
    const results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("fetchChats: Error fetching chats:", error.message);
    res.status(500); // Internal Server Error
    throw new Error("Failed to fetch chats. Please try again later.");
  }
});

// @description Create New Group Chat
// @route POST /api/chat/group
// @access Protected
const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  // Input validation
  if (!users || !name) {
    res.status(400);
    throw new Error("Please fill all the required fields: users and chat name.");
  }

  let parsedUsers;
  try {
    parsedUsers = JSON.parse(users); // Users array is sent as a JSON string
  } catch (parseError) {
    console.error("createGroupChat: Failed to parse users JSON:", parseError.message);
    res.status(400);
    throw new Error("Invalid users data format. Please provide a valid JSON array of user IDs.");
  }

  // Group chat must have at least 2 other users (excluding the current user)
  if (!Array.isArray(parsedUsers) || parsedUsers.length < 2) {
    res.status(400);
    throw new Error("More than 2 users (including yourself) are required to form a group chat.");
  }

  // Add the current logged-in user (who is creating the group) to the users list
  // Ensure req.user._id is not added multiple times if already in parsedUsers
  if (!parsedUsers.includes(req.user._id.toString())) { // Convert to string for comparison
    parsedUsers.push(req.user._id);
  } else {
    // If the user's ID is already there, make sure it's the Mongoose ObjectId type for consistency
    const index = parsedUsers.findIndex(id => id === req.user._id.toString());
    parsedUsers[index] = req.user._id;
  }

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user._id, // Set the current user as the group admin
    });

    // Fetch the newly created group chat with populated user and admin details
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat); // 201 Created status
  } catch (error) {
    console.error("createGroupChat: Error creating group chat:", error.message);
    res.status(500);
    throw new Error("Failed to create group chat. Please try again later.");
  }
});

// @description Rename Group Chat
// @route PUT /api/chat/rename
// @access Protected (only group admin)
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  // Input validation
  if (!chatId || !chatName) {
    res.status(400);
    throw new Error("Chat ID and new chat name are required for renaming.");
  }

  // Find the chat and check if the current user is an admin
  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }

  // Authorization check: Only the group admin can rename the chat
  if (!chat.isGroupChat || chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(403); // Forbidden
    throw new Error("You are not authorized to rename this chat. Only the group admin can.");
  }

  try {
    // Update the chat name
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName }, // Update the chatName field
      { new: true } // Return the updated document
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("renameGroup: Error renaming group chat:", error.message);
    res.status(500);
    throw new Error("Failed to rename group chat. Please try again.");
  }
});

// @description Remove user from Group Chat
// @route PUT /api/chat/groupremove
// @access Protected (only group admin, or user removing self)
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body; // userId is the user to be removed

  // Input validation
  if (!chatId || !userId) {
    res.status(400);
    throw new Error("Chat ID and User ID are required to remove a user from the group.");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }

  // Ensure it's a group chat
  if (!chat.isGroupChat) {
    res.status(400);
    throw new Error("This is not a group chat.");
  }

  // Authorization check:
  // 1. Only group admin can remove other users.
  // 2. A user can remove themselves.
  const isAdmin = chat.groupAdmin.toString() === req.user._id.toString();
  const isRemovingSelf = userId === req.user._id.toString();

  if (!isAdmin && !isRemovingSelf) {
    res.status(403); // Forbidden
    throw new Error("You are not authorized to remove this user from the group. Only the admin can remove others.");
  }

  // Edge case: Prevent admin from removing themselves if they are the only admin and there are other users
  // You might want to implement a transfer of admin rights first or prevent removal if they are the last member
  if (isAdmin && isRemovingSelf && chat.users.length > 1) {
    // If the admin is the only admin and tries to leave,
    // you might want logic to assign a new admin or prompt to do so.
    // For now, let's allow it, assuming the group can become admin-less or dissolve.
    // A more robust app might require explicit admin transfer.
    console.warn(`Admin ${req.user._id} is leaving group ${chatId}. Group might become admin-less.`);
  }

  // Check if the user to be removed is actually in the group
  if (!chat.users.includes(userId)) {
    res.status(400);
    throw new Error("User is not a member of this group.");
  }

  // Check if the user trying to be removed is the group admin
  // An admin cannot remove the group admin unless they are the admin themselves (leaving the group)
  if (userId === chat.groupAdmin.toString() && !isAdmin) {
      res.status(403);
      throw new Error("Only the group admin can remove themselves, or another admin can transfer admin rights.");
  }


  try {
    // Remove the user from the group's users array
    const removedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } }, // Pull the user ID from the 'users' array
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    // Handle case where no chat was found after update (unlikely due to earlier check)
    if (!removedChat) {
      res.status(404);
      throw new Error("Chat not found after removal attempt.");
    }

    // If the removed user was the group admin, you might want to reassign admin or set to null
    // For now, we'll keep the admin field as is, meaning the `groupAdmin` field
    // might point to a user no longer in the `users` array, which is a design choice.
    // A more robust solution would update `groupAdmin` if the admin is removed.
    if (userId === chat.groupAdmin.toString() && removedChat.users.length > 0) {
        // Find a new admin, or set groupAdmin to null.
        // Example: If a group should always have an admin,
        // you'd need to pick a new one or prevent the removal.
        // For simplicity, we'll just log a warning for now.
        console.warn(`Group admin ${userId} was removed from chat ${chatId}. Consider reassigning admin.`);
    }
    // If the chat becomes empty after removal, you might want to delete it
    if (removedChat.users.length === 0) {
      await Chat.findByIdAndDelete(chatId);
      return res.status(200).json({ message: "Group chat dissolved as it became empty." });
    }

    res.status(200).json(removedChat);
  } catch (error) {
    console.error("removeFromGroup: Error removing user from group:", error.message);
    res.status(500);
    throw new Error("Failed to remove user from group. Please try again.");
  }
});

// @description Add user to Group Chat
// @route PUT /api/chat/groupadd
// @access Protected (only group admin)
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body; // userId is the user to be added

  // Input validation
  if (!chatId || !userId) {
    res.status(400);
    throw new Error("Chat ID and User ID are required to add a user to the group.");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }

  // Ensure it's a group chat
  if (!chat.isGroupChat) {
    res.status(400);
    throw new Error("This is not a group chat.");
  }

  // Authorization check: Only group admin can add new users
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(403); // Forbidden
    throw new Error("You are not authorized to add users to this group. Only the group admin can.");
  }

  // Check if the user is already a member of the group
  if (chat.users.includes(userId)) {
    res.status(400);
    throw new Error("User is already a member of this group.");
  }

  try {
    // Add the user to the group's users array
    const addedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } }, // Push the user ID to the 'users' array
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!addedChat) {
      res.status(404);
      throw new Error("Chat not found after adding user attempt.");
    }

    res.status(200).json(addedChat);
  } catch (error) {
    console.error("addToGroup: Error adding user to group:", error.message);
    res.status(500);
    throw new Error("Failed to add user to group. Please try again.");
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};