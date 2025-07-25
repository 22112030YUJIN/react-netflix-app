import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
//여기 Auth라고 쓰면 index.js에도 Auth라고 써야 인식 됌
export const Auth = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /*const login = (username) => {
    localStorage.setItem("user", JSON.stringify({ name: username }));
    setUser({ name: username });
  };*/
  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
