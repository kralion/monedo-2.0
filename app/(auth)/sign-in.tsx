import { useOAuth } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H2, Text, XStack, YStack, useTheme } from "tamagui";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { theme } = useTheme();
  const isDarkMode = theme?.name === "dark";
  const router = useRouter();

  return (
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
              width: 125,
              height: 125,
            }}
            source={require("../../assets/logo.png")}
          />
          <H2> Inicia Sesión</H2>
          <Text textAlign="center">
            Para empezar a usar y disfrutar de Monex
          </Text>
        </YStack>
        <YStack gap="$4">
          <SignInWithOAuthGoogle isDarkMode={isDarkMode} />
          <SignInWithOAuthApple />
          <SignInWithOAuthTiktok isDarkMode={isDarkMode} />
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
  );
}

export const SignInWithOAuthGoogle = ({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(monex)", { scheme: "monedo" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button
      bg="$white1"
      color={isDarkMode ? "$white1" : "$black5"}
      size="$5"
      borderWidth={0.2}
      onPress={onPress}
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
  );
};
export const SignInWithOAuthTiktok = ({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_tiktok" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(monex)", { scheme: "monedo" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button
      bg="$white1"
      size="$5"
      color={isDarkMode ? "$white1" : "$black5"}
      onPress={onPress}
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
  );
};
export const SignInWithOAuthApple = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(monex)", { scheme: "monedo" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    Platform.OS === "ios" && (
      <Button bg="$black5" size="$5" color="$white1" onPress={onPress}>
        <FontAwesome5 size={24} color="white" name="apple" />
        Continuar con Apple
      </Button>
    )
  );
};
