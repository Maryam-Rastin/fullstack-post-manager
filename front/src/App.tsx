import { ToastContainer } from "react-toastify";
import Post from "./components/post/Index";
import PostProvider from "./context/post";

function App() {
  return (
    <>
      <ToastContainer aria-label="Notifications" />
      <PostProvider>
        <Post />
      </PostProvider>
    </>
  );
}

export default App;