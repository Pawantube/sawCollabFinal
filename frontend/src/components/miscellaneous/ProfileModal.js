// File: ProfileModal.js
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Image,
  useDisclosure,
  IconButton,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgGlass = useColorModeValue(
    "rgba(255, 255, 255, 0.4)",
    "rgba(32, 32, 35, 0.35)"
  );
  const borderGlass = useColorModeValue(
    "1px solid rgba(0, 0, 0, 0.15)",
    "1px solid rgba(255, 255, 255, 0.1)"
  );

  return (
    <>
      {children ? (
        <Box onClick={onOpen} cursor="pointer">
          {children}
        </Box>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent
          backdropFilter="blur(12px)"
          background={bgGlass}
          border={borderGlass}
          borderRadius="2xl"
          boxShadow="lg"
        >
          <ModalHeader
            fontSize="2xl"
            fontFamily="Work sans"
            textAlign="center"
            color={useColorModeValue("gray.800", "whiteAlpha.900")}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" pb={6}>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              mb={4}
              border="4px solid white"
              shadow="md"
            />
            <Text fontSize="lg" fontFamily="Work sans">
              Email: {user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
