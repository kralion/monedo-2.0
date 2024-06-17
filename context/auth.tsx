import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useToastController } from "@tamagui/toast";
import { router } from "expo-router";
import React from "react";

interface AuthContextType {
  session: Session | null;
  userData: any | null;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

type TUserData = {
  nombres: string;
  apellidos: string;
  email: string;
  rol: "free";
  perfil: {
    uri: string;
  };
  id: string;
};
export const AuthContext = React.createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [userData, setUserData] = React.useState<TUserData>();
  const toast = useToastController();
  async function fetchUserData(id: string) {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("session_id", id)
      .single();
    setUserData(data);
  }
  React.useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((error) => {
        toast.show("Error al iniciar sesión", {
          message: error.message,
          duration: 3000,
          type: "error",
        });
      });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await fetchUserData(session.user.id);
      } else {
        router.push("/(auth)/sign-in");
      }
    });
  }, []);

  const value = { session, userData, setUserData };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === null || context === undefined) {
    throw new Error("useAuth debe contenerse dentro de AuthProvider");
  }
  return context;
};
