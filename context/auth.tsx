import { supabase } from "@/utils/supabase";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import { useToastController } from "@tamagui/toast";
import { useRouter } from "expo-router";
import React from "react";
import { Spinner } from "tamagui";

interface AuthContextType {
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
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user } = useUser();
  const [userData, setUserData] = React.useState<TUserData | null>(null);
  const router = useRouter();
  const toast = useToastController();

  async function fetchUserData(clerkUserId: string) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq(
          "clerk_user_id",
          // TODO: Change this to the real one
          clerkUserId || "9e683f71-8a18-4a91-a596-c956813405e9"
        )
        .single();

      if (error) throw error;

      if (data) {
        setUserData(data);
      } else {
        console.log("Usuario no encontrado en Supabase");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.show("Error al obtener datos del usuario", {
        message: "Por favor, intenta de nuevo más tarde",
        duration: 3000,
        type: "error",
      });
    }
  }

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/(auth)/sign-in");
    } else if (isLoaded && isSignedIn && user) {
      fetchUserData(user.id);
    }
  }, [isLoaded, isSignedIn, user]);

  const value = { userData, setUserData };

  if (!isLoaded) {
    return <Spinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === null || context === undefined) {
    throw new Error("useAuth debe contenerse dentro de AuthProvider");
  }
  return context;
};
