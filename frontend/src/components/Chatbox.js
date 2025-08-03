import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
   <Box
  display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
  gap={3}
  alignItems="center"
  flexDir="column"
  p={3}
  w={{ base: "100%", md: "68%" }}
  h="100%"
  borderRadius="10px"
  background="rgba(255, 255, 255, 0.1)"
  backdropFilter="blur(12px)"
 
//   border="1px solid rgba(255, 255, 255, 0.2)"
>
  <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
</Box>

  );
};

export default Chatbox;
