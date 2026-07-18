import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

import Home from "./pages/Home.jsx";
import Rooms from "./pages/Rooms.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Payment from "./pages/Payment.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageRoomTypes from "./pages/admin/ManageRoomTypes.jsx";
import ManageRooms from "./pages/admin/ManageRooms.jsx";
import AllBookings from "./pages/admin/AllBookings.jsx";
import AllPayments from "./pages/admin/AllPayments.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "rooms", element: <Rooms /> },
      { path: "rooms/:id", element: <RoomDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "payment/:bookingId",
        element: (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "room-types", element: <ManageRoomTypes /> },
          { path: "rooms", element: <ManageRooms /> },
          { path: "bookings", element: <AllBookings /> },
          { path: "payments", element: <AllPayments /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
