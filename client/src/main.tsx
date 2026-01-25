import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.tsx";
import About from "./pages/About.tsx";

// 2. Convert standard imports to lazy imports
const Home = lazy(() => import("./pages/Home.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const EmailVerify = lazy(() => import("./pages/EmailVerify.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "email-verify",
        element: <EmailVerify />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </StrictMode>,
);
