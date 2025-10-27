import axios from "axios";
import { useUsersDispatch } from "../context/UsersProvider";

export function useUsersActions() {
  const dispatch = useUsersDispatch();

  const addUser = async (user) => {
    try {
      // tùy chọn: optimistic update
      // dispatch({ type: "ADD_USER", payload: userTemp });

      const res = await axios.post("http://localhost:3000/users", user);
      dispatch({ type: "ADD_USER", payload: res.data });
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Add user failed:", err);
      return { ok: false, error: err };
    }
  };

  const refreshUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      dispatch({ type: "SET_USERS", payload: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  return { addUser, refreshUsers };
}