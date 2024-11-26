import { ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text, XStack } from "tamagui";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="export-data"
        options={{
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={{ marginLeft: -10 }}
            >
              <XStack alignItems="center">
                <ChevronLeft size="$2" color="$blue10Light" />
                <Text fontSize="$5" color="$blue10Light">
                  Reporte
                </Text>
              </XStack>
            </TouchableOpacity>
          ),
          presentation: "card",
          title: "Exportar",
        }}
      />
      <Stack.Screen name="buy-premium" options={{ headerShown: false }} />

      <Stack.Screen
        name="notifications"
        options={{
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{ marginLeft: -10 }}
              >
                <XStack alignItems="center">
                  <ChevronLeft size="$2" color="$blue10Light" />
                  <Text fontSize="$5" color="$blue10Light">
                    Perfil
                  </Text>
                </XStack>
              </TouchableOpacity>
            );
          },
          presentation: "card",
          title: "Notificaciones",
        }}
      />
      <Stack.Screen
        name="membership"
        options={{
          presentation: "card",
          headerBlurEffect: "regular",
          headerTransparent: true,
          title: "Membresía",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{ marginLeft: -10 }}
              >
                <XStack alignItems="center">
                  <ChevronLeft size="$2" color="$blue10Light" />
                  <Text fontSize="$5" color="$blue10Light">
                    Atrás
                  </Text>
                </XStack>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Stack.Screen
        name="personal-info"
        options={{
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{ marginLeft: -10 }}
              >
                <XStack alignItems="center">
                  <ChevronLeft size="$2" color="$blue10Light" />
                  <Text fontSize="$5" color="$blue10Light">
                    Perfil
                  </Text>
                </XStack>
              </TouchableOpacity>
            );
          },

          headerBlurEffect: "regular",
          headerTransparent: true,
          presentation: "card",
          title: "Datos Personales",
        }}
      />
    </Stack>
  );
}
