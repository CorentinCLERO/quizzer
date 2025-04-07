"use client"

import React, { createContext, ReactNode, useContext, useState } from "react";

// 1. Définir le type pour les données utilisateur.
interface User {
  id: number;
  name: string;
  email: string;
  picture?: string;
  role: "ADMIN" | "CREATOR" | "PARTICIPANT";
}

// 2. Définir le type pour le contexte utilisateur.
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// 3. Créer le contexte utilisateur avec une valeur par défaut.
const UserContext = createContext<UserContextType | undefined>(undefined);

// 4. Créer le `UserProvider` pour encapsuler l'application.
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // État pour stocker l'utilisateur.

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 5. Créer un hook personnalisé pour accéder facilement au contexte utilisateur.
export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
