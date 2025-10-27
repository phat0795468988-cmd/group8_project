import React from "react";
import { UsersProvider } from "./context/UsersProvider";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

export default function App() {
  return (
    <UsersProvider>
      <div style={{ padding: 20 }}>
        <h1>Quản lý Users</h1>
        <AddUser />
        <UserList />
      </div>
    </UsersProvider>
  );
}