// import { Avatar } from "@chakra-ui/avatar";
// import { Box, Text } from "@chakra-ui/layout";
// import { ChatState } from "../../Context/ChatProvider";

// const UserListItem = ({ handleFunction }) => {
//   const { user } = ChatState();

//   return (
//     <Box
//       onClick={handleFunction}
//       cursor="pointer"
//       bg="#E8E8E8"
//       _hover={{
//         background: "#38B2AC",
//         color: "white",
//       }}
//       w="100%"
//       d="flex"
//       alignItems="center"
//       color="black"
//       px={3}
//       py={2}
//       mb={2}
//       borderRadius="lg"
//     >
//       <Avatar
//         mr={2}
//         size="sm"
//         cursor="pointer"
//         name={user.name}
//         src={user.pic}
//       />
//       <Box>
//         <Text>{user.name}</Text>
//         <Text fontSize="xs">
//           <b>Email : </b>
//           {user.email}
//         </Text>
//       </Box>
//     </Box>
//   );
// };

// export default UserListItem;
// import { Avatar } from "@chakra-ui/avatar";
// import { Box, Text } from "@chakra-ui/layout";

// // 🧼 NO need to import ChatState here
// // import { ChatState } from "../../Context/ChatProvider";

// const UserListItem = ({ user, handleFunction }) => {
//   return (
//     <Box
//       onClick={handleFunction}
//       cursor="pointer"
//       bg="#E8E8E8"
//       _hover={{
//         background: "#38B2AC",
//         color: "white",
//       }}
//       w="100%"
//       display="flex"
//       alignItems="center"
//       color="black"
//       px={3}
//       py={2}
//       mb={2}
//       borderRadius="lg"
//     >
//       <Avatar
//         mr={2}
//         size="sm"
//         cursor="pointer"
//         name={user.name}
//         src={user.pic}
//       />
//       <Box>
//         <Text>{user.name}</Text>
//         <Text fontSize="xs">
//           <b>Email:</b> {user.email}
//         </Text>
//       </Box>
//     </Box>
//   );
// };

// export default UserListItem;
import React from 'react'; // Explicitly import React
import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

/**
 * UserListItem Component
 * Displays a single user's avatar, name, and email in a list item format.
 * The entire item acts as a clickable element to trigger an action (e.g., selecting the user).
 *
 * @param {object} props - Component props.
 * @param {object} props.user - The user object, expected to have `name`, `email`, and optionally `pic`.
 * @param {function} [props.handleFunction] - The function to call when the list item is clicked.
 *                                           If not provided or not a function, the item will not be clickable.
 */
const UserListItem = ({ user, handleFunction }) => {
  // 1. Defensive Programming: Validate the 'user' prop.
  // Ensure 'user' is an object and has essential 'name' and 'email' properties.
  if (!user || typeof user !== 'object' || !user.name || !user.email) {
    console.warn("UserListItem: 'user' prop is missing or invalid (requires name and email). Skipping render.");
    return null; // Do not render if essential user data is missing
  }

  // 2. Defensive Programming: Check if handleFunction is a valid function.
  // This determines if the item should be interactive.
  const isClickable = typeof handleFunction === 'function';

  // Determine the accessible label for the item based on its action
  const ariaLabel = isClickable ? `Select ${user.name}` : undefined; // Or 'View profile of ${user.name}' depending on exact use case

  return (
    <Box
      // Conditionally apply click handler, cursor, and accessibility attributes
      onClick={isClickable ? handleFunction : undefined}
      cursor={isClickable ? "pointer" : "default"} // Change cursor only if clickable
      role={isClickable ? "button" : undefined} // Semantically a button if clickable
      aria-label={ariaLabel} // Descriptive label for screen readers
      tabIndex={isClickable ? 0 : undefined} // Make it focusable if it's a button
      
      bg="#E8E8E8"
      _hover={isClickable ? { // Apply hover effects only if clickable
        background: "#38B2AC",
        color: "white",
      } : undefined}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        // Cursor on avatar specific, but overall box takes precedence for click
        cursor={isClickable ? "pointer" : "default"}
        name={user.name}
        // 3. Robustness: Provide a fallback for user.pic if it's not present or invalid.
        src={user.pic || ''} // Use empty string to prevent potential Chakra UI warnings/errors with undefined src
        alt={`Avatar of ${user.name}`} // Add descriptive alt text for accessibility
      />
      <Box>
        <Text fontWeight="semibold">{user.name}</Text> {/* Bold the name for better readability */}
        <Text fontSize="xs">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;