import React, { createContext, useState } from 'react';

export const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState("student"); // Update as needed
//   const [role, setRole] = useState("faculty"); // Update as needed
//   const [role, setRole] = useState("acadAdmin"); // Update as needed
//   const [role, setRole] = useState("nonAcadAdmin"); // Update as needed

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}