import Sidebar from "../components/Sidebar";
import AuthOverlay from "../components/AuthOverlay";
import MainLayout from "../layouts/MainLayout";
import ProfileSettings from "../components/ProfileSettings";
import ProtectedRoutes from "../components/ProtectedRoutes";
import { Flex } from "@mantine/core";
import RoomList from "../components/RoomList";
import AddChatroom from "../components/AddChatroom";
import JoinRoomOrChatwindow from "../components/JoinRoomOrChatWindow";

function Home() {
  return (
    <MainLayout>
      <div
        style={{
          position: "absolute",
        }}
      >
        <AuthOverlay />
        <ProfileSettings />
        <Sidebar />
        <ProtectedRoutes>
          <AddChatroom />
          <Flex direction={{ base: "column", md: "row" }}>
            <RoomList />
            <JoinRoomOrChatwindow />
          </Flex>
        </ProtectedRoutes>
      </div>
    </MainLayout>
  );
}

export default Home;
