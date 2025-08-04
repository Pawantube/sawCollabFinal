import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { useColorModeValue } from "@chakra-ui/react";

const ChatLoading = ({ count = 12, height = "45px", spacing = "4px", ...props }) => {
  // Adapt skeleton color for light/dark mode
  const startColor = useColorModeValue("gray.100", "gray.700");
  const endColor = useColorModeValue("gray.300", "gray.600");

  // Generate an array of skeletons based on the count prop
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Skeleton
      key={index}
      height={height}
      startColor={startColor}
      endColor={endColor}
      borderRadius="md"
      fadeDuration={1}
      speed={0.8}
      {...props} // Allow additional props to be passed to Skeleton
    />
  ));

  return (
    <Stack spacing={spacing} width="100%" {...props}>
      {skeletons}
    </Stack>
  );
};

export default ChatLoading;