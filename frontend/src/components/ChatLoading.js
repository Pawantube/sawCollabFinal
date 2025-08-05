import React from 'react'; // Good practice to explicitly import React
import { Stack, Skeleton, Box, Flex, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
// Import some fun icons from react-icons
// Make sure you have react-icons installed: npm install react-icons
import { FaRegComments, FaSpinner } from 'react-icons/fa';

/**
 * ChatLoading Component
 * Displays an engaging loading animation that mimics a chat interface,
 * providing visual feedback that conversations are being loaded.
 *
 * @param {object} props - Component props.
 * @param {number} [props.count=6] - The number of mock chat message skeletons to display.
 * @param {object} [props...] - Additional props passed directly to the main Stack container.
 */
const ChatLoading = ({ count = 6, ...props }) => {
  // Determine skeleton colors based on current color mode
  const startColor = useColorModeValue("gray.100", "gray.700");
  const endColor = useColorModeValue("gray.300", "gray.600");

  // Common props for all skeletons
  const skeletonProps = {
    startColor: startColor,
    endColor: endColor,
    borderRadius: "md",
    fadeDuration: 1, // How long it takes for the fade effect
    speed: 0.8,      // Speed of the animation
  };

  // Helper function to generate a single chat-like skeleton pattern
  // Alternates between incoming (left) and outgoing (right) messages
  const getChatSkeleton = (isOutgoing = false) => (
    <Flex
      width="100%"
      alignItems="flex-start"
      // Adjust alignment for outgoing messages (right-aligned)
      {...(isOutgoing ? { justifyContent: "flex-end" } : {})}
    >
      {/* Avatar placeholder (left for incoming, right for outgoing) */}
      {!isOutgoing && (
        <Skeleton {...skeletonProps} boxSize="40px" borderRadius="full" mr={3} />
      )}
      
      {/* Message content placeholder with varying line widths */}
      <Box flex="1" {...(isOutgoing ? { ml: "20%" } : { mr: "20%" })}>
        <Skeleton {...skeletonProps} height="16px" width={isOutgoing ? "80%" : "60%"} mb={1} />
        <Skeleton {...skeletonProps} height="16px" width={isOutgoing ? "60%" : "90%"} />
        {/* Occasionally add a third line for more variety */}
        {Math.random() > 0.5 && <Skeleton {...skeletonProps} height="16px" width={isOutgoing ? "40%" : "70%"} mt={1} />}
      </Box>

      {/* Avatar placeholder for outgoing messages */}
      {isOutgoing && (
        <Skeleton {...skeletonProps} boxSize="40px" borderRadius="full" ml={3} />
      )}
    </Flex>
  );

  return (
    <Stack spacing={4} width="100%" px={4} py={6} alignItems="center" {...props}>
      {/* Engaging Opening Message and Icon */}
      <Flex alignItems="center" mb={6} color={useColorModeValue("gray.600", "gray.400")}>
        <FaRegComments size="32px" style={{ marginRight: '10px' }} />
        <Text fontSize="xl" fontWeight="extrabold" letterSpacing="wide">
          Brewing Your Conversations...
        </Text>
      </Flex>

      {/* Dynamically generated chat-like skeletons */}
      {Array.from({ length: count }).map((_, index) => (
        // Alternate between incoming and outgoing message patterns
        <React.Fragment key={index}>
          {getChatSkeleton(index % 2 === 0)}
        </React.Fragment>
      ))}

      {/* Fun Closing Animation / Message */}
      <Flex alignItems="center" mt={6} color={useColorModeValue("purple.500", "purple.300")}
            // Add a simple CSS animation for a "bouncing" effect
            animation="bounce 1.5s infinite ease-in-out"
            css={{
                '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)', opacity: 0.8 },
                    '50%': { transform: 'translateY(-10px)', opacity: 1 }
                }
            }}
      >
        <FaSpinner size="20px" style={{ marginRight: '8px' }} /> {/* A classic spinner icon */}
        <Text fontSize="md" fontStyle="italic">Just a moment...</Text>
      </Flex>
    </Stack>
  );
};

export default ChatLoading;
// import { Stack } from "@chakra-ui/layout";
// import { Skeleton } from "@chakra-ui/skeleton";
// import { useColorModeValue } from "@chakra-ui/react";

// const ChatLoading = ({ count = 12, height = "45px", spacing = "4px", ...props }) => {
//   // Adapt skeleton color for light/dark mode
//   const startColor = useColorModeValue("gray.100", "gray.700");
//   const endColor = useColorModeValue("gray.300", "gray.600");

//   // Generate an array of skeletons based on the count prop
//   const skeletons = Array.from({ length: count }, (_, index) => (
//     <Skeleton
//       key={index}
//       height={height}
//       startColor={startColor}
//       endColor={endColor}
//       borderRadius="md"
//       fadeDuration={1}
//       speed={0.8}
//       {...props} // Allow additional props to be passed to Skeleton
//     />
//   ));

//   return (
//     <Stack spacing={spacing} width="100%" {...props}>
//       {skeletons}
//     </Stack>
//   );
// };

// export default ChatLoading;