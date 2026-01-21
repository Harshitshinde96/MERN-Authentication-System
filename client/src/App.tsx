import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import Toaster

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      {/* 2. Your Page Content */}
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default App;
