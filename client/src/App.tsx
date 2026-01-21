import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import Toaster
import { Suspense } from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
  </div>
);function App() {
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

      {/* 2. Wrap Outlet in Suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </>
  );
}

export default App;