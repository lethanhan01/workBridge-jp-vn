import { createBrowserRouter } from "react-router";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";

import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { ChatListPage } from "../pages/ChatListPage";
import { ChatPage } from "../pages/ChatPage";
import { DictionaryPage } from "../pages/DictionaryPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AccountListPage } from "../pages/AccountListPage";
import { AccountDetailPage } from "../pages/AccountDetailPage";
import { NotFoundPage } from "../pages/NotFoundPage";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
    ],
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: ChatListPage },
      { path: "chat/:contactId", Component: ChatPage },
      { path: "dictionary", Component: DictionaryPage },
      { path: "profile", Component: ProfilePage },
      { path: "accounts", Component: AccountListPage },
      { path: "accounts/:accountId", Component: AccountDetailPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
