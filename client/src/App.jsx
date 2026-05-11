import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./screens/Signup";

const router = createBrowserRouter([
  {
    // Trang chủ mặc định sẽ tự động chuyển hướng về trang Login
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
    
    path: "*",
    element: <Login />, 
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};