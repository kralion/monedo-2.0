import { useAuth } from "@/context";
import { supabase } from "@/utils/supabase";
import { Bell, LogOut, User, UserSquare2 } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle } from "tamagui";
import { Square } from "tamagui";
import { Avatar, Button, H3, Text, XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  const { userData } = useAuth();
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <SafeAreaView
      style={{ paddingHorizontal: 16, paddingTop: 16, height: "100%" }}
    >
      <View>
        <YStack alignItems="center">
          <Avatar bg="teal.600" alignSelf="center" size="$10">
            <Avatar.Image
              accessibilityLabel="avatar"
              src={userData.foto}
              style={{
                borderRadius: 100,
                width: 100,
                height: 100,
              }}
            />
            <Avatar.Fallback borderRadius="$12" backgroundColor={"#F5F5F5"} />
          </Avatar>

          <YStack gap="$1">
            <H3>{`${userData.nombres} ${userData.apellidos}`}</H3>
            <Button
              disabled
              size="$3"
              borderRadius="$7"
              bg={userData.rol === "premium" ? "$green8Light" : "$orange10"}
              color="$white1"
            >
              {`Usuario ${userData.rol}`}
            </Button>
          </YStack>
        </YStack>
      </View>
      <YStack mt="$10" ml="$3" gap="$6" alignItems="flex-start">
        <TouchableOpacity
          onPress={() => router.push("/(modals)/personal-info")}
        >
          <XStack gap="$3" alignItems="center">
            <User />
            <Text fontSize="$6">Mis Datos</Text>
          </XStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(modals)/membership")}>
          <XStack gap="$3" alignItems="center">
            <UserSquare2 />
            <Text fontSize="$6">Membresía</Text>
          </XStack>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(modals)/notifications")}
        >
          <XStack gap="$3" alignItems="center">
            <Bell />
            <Text fontSize="$6">Notificaciones</Text>
          </XStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => signOut()}>
          <XStack gap="$3" alignItems="center">
            <LogOut color="$red10Light" />
            <Text color="$red10Light" fontSize="$6">
              Salir
            </Text>
          </XStack>
        </TouchableOpacity>
      </YStack>

      <Square
        position="absolute"
        bottom={70}
        right={-50}
        width={150}
        height={300}
        borderRadius="$10"
        rotate="-20deg"
        backgroundColor="$black1"
        elevation="$4"
      />
      <Square
        position="absolute"
        bottom={30}
        right={-50}
        width={150}
        height={300}
        borderRadius="$10"
        rotate="-30deg"
        backgroundColor="$orange10"
        elevation="$4"
      />
      <Square
        position="absolute"
        bottom={-10}
        right={-50}
        width={150}
        height={300}
        borderRadius="$10"
        rotate="-40deg"
        backgroundColor="$green8Light"
        elevation="$4"
      />
    </SafeAreaView>
  );
}
