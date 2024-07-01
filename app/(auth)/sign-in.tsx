import { useOAuth } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";
import { useToastController } from "@tamagui/toast";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  Image,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H2, Text, XStack, YStack, useTheme } from "tamagui";

type FormData = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { theme } = useTheme();
  const isDarkMode = theme?.name === "dark";
  const { startOAuthFlow: startGoogleFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleFlow } = useOAuth({
    strategy: "oauth_apple",
  });
  const { startOAuthFlow: startFacebookFlow } = useOAuth({
    strategy: "oauth_facebook",
  });
  const { startOAuthFlow: startTiktokFlow } = useOAuth({
    strategy: "oauth_tiktok",
  });
  const router = useRouter();
  const toast = useToastController();
  const handleSocialSignIn = async (startOAuthFlow: any) => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        if (setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/(tabs)/");
        } else {
          console.log("setActive is undefined");
          // Handle the case where setActive is undefined
        }
      } else {
        // Handle sign up or other cases
        console.log("No session created");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={{
          paddingHorizontal: 16,
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <YStack gap="$10" width="100%">
          <YStack gap="$1" alignItems="center">
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
                marginBottom: 36,
              }}
              source={require("../../assets/logo.png")}
            />
            <H2> Inicia Sesión</H2>
            <Text textAlign="center">
              Para empezar a usar y disfrutar de Monedo
            </Text>
          </YStack>
          <YStack gap="$4">
            {Platform.OS === "ios" && (
              <Button
                bg="$black5"
                size="$5"
                color="$white1"
                onPress={() => handleSocialSignIn(startAppleFlow)}
              >
                <FontAwesome5 size={24} color="white" name="apple" />
                Continuar con Apple
              </Button>
            )}
            <Button
              bg="$white1"
              size="$5"
              color={isDarkMode ? "$white1" : "$black5"}
              onPress={() => handleSocialSignIn(startTiktokFlow)}
            >
              <Image
                style={{ width: 24, height: 24 }}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/3046/3046121.png",
                }}
                alt="tiktok"
              />
              Continuar con TikTok
            </Button>
            <Button
              bg="$blue10"
              size="$5"
              color="$white1"
              onPress={() => handleSocialSignIn(startFacebookFlow)}
            >
              <FontAwesome5 size={24} color="white" name="facebook" />
              Continuar con Facebook
            </Button>
            <Button
              bg="$white1"
              color={isDarkMode ? "$white1" : "$black5"}
              size="$5"
              borderWidth={0.2}
              onPress={() => handleSocialSignIn(startGoogleFlow)}
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

          <XStack gap="$2" alignItems="center" justifyContent="center">
            <Text className="text-textmuted text-center">
              ¿No tienes una cuenta?
            </Text>
            <Text
              onPress={() => router.push("/(auth)/sign-up")}
              color="$green9Light"
              pressStyle={{ textDecorationLine: "underline" }}
            >
              Regístrate
            </Text>
          </XStack>
        </YStack>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
