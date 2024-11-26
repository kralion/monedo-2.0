import { TermsPolicyModal } from "@/components/popups/terms&policy";
import { supabase } from "@/utils/supabase";
import { useSignUp } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";
import { useToastController } from "@tamagui/toast";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  H2,
  Paragraph,
  ScrollView,
  Text,
  XStack,
  YStack,
  useTheme,
} from "tamagui";

export default function SignUpScreen() {
  const { signUp, setActive } = useSignUp();
  const [showTCModal, setShowTCModal] = React.useState(false);
  const router = useRouter();
  const toast = useToastController();
  const { theme } = useTheme();
  const isDarkMode = theme?.name === "dark";
  async function sendWelcomeNotification(userId: string) {
    const notification = {
      titulo: "Bienvenido !!!",
      descripcion:
        "Registrado exitosamente en la app, ahora puedes comenzar a usarla con el plan gratuito.",
      fecha: new Date().toISOString(),
      usuario_id: userId,
      tipo: "INFO",
    };
    await supabase.from("notificaciones").insert(notification);
  }
  const handleSocialSignUp = async (
    strategy: "oauth_google" | "oauth_apple" | "oauth_tiktok"
  ) => {
    if (!signUp) {
      console.log("Sign up no está disponible");
      return;
    }

    try {
      const result = await signUp.create({
        strategy: strategy,
        redirectUrl: "monex://oauth-native-callback",
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        if (result.createdUserId) {
          await supabase.from("usuarios").insert({
            rol: "free",
            clerk_user_id: result.createdUserId,
          });
          await sendWelcomeNotification(result.createdUserId);
        } else {
          console.log("Error al asignar id del usuario");
        }
        toast.show("Registro Exitoso", {
          message: "Redirigiendo al inicio de sesión",
          duration: 3000,
          type: "success",
        });
        router.replace("/sign-in");
      } else {
        // El registro requiere pasos adicionales
        console.log("Error en proceso de registro:", result);
        // Aquí puedes manejar pasos adicionales si son necesarios
      }
    } catch (err: any) {
      console.error("Error en el registro social:", err);
      toast.show("Error de Registro", {
        message: err,
        duration: 3000,
        type: "error",
      });
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <YStack gap="$10" width="100%">
          <YStack gap="$1" alignItems="center">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../assets/logo.png")}
            />
            <H2>Crea una cuenta</H2>
            <XStack gap="$1.5">
              <Text>Ya tienes una cuenta?</Text>

              <Text
                onPress={() => router.back()}
                color="$green9Light"
                pressStyle={{ textDecorationLine: "underline" }}
              >
                Inicia Sesión
              </Text>
            </XStack>
          </YStack>

          <YStack gap="$4" width="100%">
            {Platform.OS === "ios" && (
              <Button
                bg="$black5"
                size="$5"
                color="$white1"
                onPress={() => handleSocialSignUp("oauth_apple")}
              >
                <FontAwesome5 size={24} color="white" name="apple" />
                Continuar con Apple
              </Button>
            )}
            <Button
              bg="$white1"
              size="$5"
              color={isDarkMode ? "$white1" : "$black5"}
              onPress={() => handleSocialSignUp("oauth_tiktok")}
            >
              <Image
                style={{ width: 24, height: 24 }}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/3046/3046121.png",
                }}
                alt="google"
              />
              Continuar con TikTok
            </Button>

            <Button
              bg="$white1"
              color={isDarkMode ? "$white1" : "$black5"}
              size="$5"
              borderWidth={0.2}
              onPress={() => handleSocialSignUp("oauth_google")}
            >
              <Image
                style={{ width: 24, height: 24 }}
                source={{
                  uri: "https://img.icons8.com/?size=96&id=17949&format=png",
                }}
                alt="google"
              />
              Continuar con Google
            </Button>
          </YStack>
          <YStack gap="$6" alignItems="center">
            <Paragraph size="$2" textAlign="center">
              Al continuar aceptas los{" "}
              <Text
                color="$green9Light"
                style={{
                  textDecorationLine: "underline",
                }}
                pressStyle={{
                  opacity: 0.5,
                }}
                onPress={() => setShowTCModal(true)}
              >
                Términos y Condiciones{" "}
              </Text>
              , en estos se describen como usamos tus datos y como protegemos tu
              privacidad.
            </Paragraph>
            <XStack alignItems="center" justifyContent="center">
              <Text fontSize="$2">Copyright © 2024 </Text>
              <Text
                fontSize="$2"
                color="$green9Light"
                pressStyle={{ textDecorationLine: "underline" }}
              >
                <Link href="https://x.com/brayanpaucar_">Brayan</Link>
              </Text>

              <Text fontSize="$2"> & </Text>
              <Text
                fontSize="$2"
                color="$green9Light"
                pressStyle={{ textDecorationLine: "underline" }}
              >
                <Link href="https://x.com/MiguelParis11">Miguel</Link>
              </Text>
            </XStack>
          </YStack>
        </YStack>
        <TermsPolicyModal
          openModal={showTCModal}
          setOpenModal={setShowTCModal}
        />
      </SafeAreaView>
    </ScrollView>
  );
}
