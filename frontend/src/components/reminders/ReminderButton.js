import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, EditIcon } from "@chakra-ui/icons";
import { AddIcon } from "@chakra-ui/icons";
import ReminderModal from "./ReminderModal";

const ReminderButton = ({ message }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSetReminder = () => {
    setSelectedMessage(message);
    onOpen();
  };

  const handleCustomReminder = () => {
    setSelectedMessage(null); // no pre-filled message
    onOpen();
  };

  return (
    <>
      <Menu isLazy>
  <MenuButton
    as={IconButton}
    icon={<BellIcon />}
    size="sm"
    variant="ghost"
    _hover={{ bg: "gray.100" }}
    aria-label="Set Reminder"
  />
  <MenuList zIndex={9999} >
    <MenuItem icon={<EditIcon />} onClick={handleSetReminder}>
      Set Reminder from Message
    </MenuItem>
  </MenuList>
</Menu>

      <ReminderModal
        isOpen={isOpen}
        onClose={onClose}
        message={selectedMessage}
      />
    </>
  );
};

export default ReminderButton;
