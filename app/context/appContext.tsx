/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

const AppContext = createContext<any>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>({});
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ["/login", "/signup"];
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    if (isPublicRoute) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/me`, {
          credentials: 'same-origin'
        });
        
        if (response.status === 401) {
          // Gracefully handle unauthorized (not logged in)
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data) {
          setUser(data);
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [pathname]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
