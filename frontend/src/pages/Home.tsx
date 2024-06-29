
import Sidebar from "../components/Sidebar"
import AuthOverlay from "../components/AuthOverlay"
import MainLayout from "../layouts/MainLayout"
import ProfileSettings from "../components/ProfileSettings"

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
      </div>
    </MainLayout>
  )
}

export default Home