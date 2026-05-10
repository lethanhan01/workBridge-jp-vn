import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { Dashboard } from "./screens/Dashboard"; 
import { Chat } from "./screens/Chat";
import { Dictionary } from "./screens/Dictionary";
import { UserProfile } from "./screens/UserProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/dictionary",
    element: <Dictionary />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />, 
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
