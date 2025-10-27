import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const UsersStateContext = createContext();
const UsersDispatchContext = createContext();

const initialState = {
  users: [],
  loading: false,
  error: null,
};

function usersReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_USER":
      // thêm vào cuối danh sách
      return { ...state, users: [...state.users, action.payload] };
    case "SET_USERS":
      return { ...state, users: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function UsersProvider({ children }) {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // fetchUsers có thể được gọi tự động ở đây
  useEffect(() => {
    async function fetchUsers() {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await axios.get("http://localhost:3000/users");
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message || "Fetch error" });
      }
    }
    fetchUsers();
  }, []);

  return (
    <UsersStateContext.Provider value={state}>
      <UsersDispatchContext.Provider value={dispatch}>
        {children}
      </UsersDispatchContext.Provider>
    </UsersStateContext.Provider>
  );
}

export function useUsersState() {
  return useContext(UsersStateContext);
}
export function useUsersDispatch() {
  return useContext(UsersDispatchContext);
}