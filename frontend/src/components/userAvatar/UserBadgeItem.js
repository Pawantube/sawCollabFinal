import React from 'react'; // Explicitly import React, good practice
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

/**
 * UserBadgeItem Component
 * Displays a user's name in a badge, with an optional admin tag and a removal icon.
 * The entire badge acts as a clickable element to trigger the handleFunction.
 *
 * @param {object} props - Component props.
 * @param {object} props.user - The user object, expected to have `_id` and `name`.
 * @param {function} props.handleFunction - The function to call when the badge is clicked (e.g., to remove the user).
 * @param {string} [props.admin] - The ID of the admin user. If it matches `user._id`, "(Admin)" is displayed.
 */
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  // 1. Defensive Programming: Check if the essential 'user' prop is provided and valid.
  // If 'user' is null or undefined, attempting to access 'user.name' or 'user._id' would cause a crash.
  if (!user || typeof user !== 'object' || !user.name) {
    console.warn("UserBadgeItem: 'user' prop is missing or invalid. Skipping render.");
    return null; // Do not render if essential user data is missing
  }

  // 2. Defensive Programming: Ensure handleFunction is actually a function.
  // This prevents potential runtime errors if a non-function is passed to onClick.
  // Also, conditionally apply click behavior and the close icon.
  const isClickable = typeof handleFunction === 'function';

  // Determine the accessible label for the badge based on its action
  const ariaLabel = isClickable ? `Remove ${user.name}` : undefined;

  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      // Conditionally apply cursor and onClick based on whether a valid handleFunction is provided
      cursor={isClickable ? "pointer" : "default"}
      onClick={isClickable ? handleFunction : undefined}
      // 3. Accessibility: Add ARIA attributes for screen readers.
      // Since the entire badge is clickable for removal, it should have a button role and a descriptive label.
      role={isClickable ? "button" : undefined}
      aria-label={ariaLabel}
      tabIndex={isClickable ? 0 : undefined} // Make it focusable if it's a button
    >
      {user.name} {/* Display user name */}
      {/* Conditionally display "(Admin)" if the user's ID matches the admin ID */}
      {user._id && admin === user._id && <span> (Admin)</span>}
      
      {/* Only show the CloseIcon if the badge is clickable */}
      {isClickable && (
        <CloseIcon
          pl={1}
          // The CloseIcon itself is decorative here, as the whole badge is clickable.
          // For screen readers, the action is described by the badge's aria-label.
          aria-hidden="true"
        />
      )}
    </Badge>
  );
};

export default UserBadgeItem;
// import { CloseIcon } from "@chakra-ui/icons";
// import { Badge } from "@chakra-ui/layout";

// const UserBadgeItem = ({ user, handleFunction, admin }) => {
//   return (
//     <Badge
//       px={2}
//       py={1}
//       borderRadius="lg"
//       m={1}
//       mb={2}
//       variant="solid"
//       fontSize={12}
//       colorScheme="purple"
//       cursor="pointer"
//       onClick={handleFunction}
//     >
//       {user.name}
//       {admin === user._id && <span> (Admin)</span>}
//       <CloseIcon pl={1} />
//     </Badge>
//   );
// };

// export default UserBadgeItem;
