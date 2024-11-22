import { useAuth, useUser } from "@clerk/clerk-expo";
import { Bell, LogOut, User, UserSquare2 } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, H3, Square, YStack } from "tamagui";

export default function ProfileScreen() {
  const { user: userData } = useUser();
  const { has, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ paddingHorizontal: 16, paddingTop: 16, height: "100%" }}
    >
      <View>
        <YStack alignItems="center">
          <Avatar bg="teal.600" alignSelf="center" size="$10">
            <Avatar.Image
              accessibilityLabel="avatar"
              src={userData?.imageUrl}
              style={{
                borderRadius: 100,
                width: 100,
                height: 100,
              }}
            />
            <Avatar.Fallback borderRadius="$12" backgroundColor={"#F5F5F5"} />
          </Avatar>

          <YStack gap="$1">
            <H3>{`${userData?.firstName} ${userData?.lastName}`}</H3>
            <Button
              disabled
              size="$3"
              borderRadius="$7"
              bg={
                has?.({ permission: "premium:plan" })
                  ? "$green9Light"
                  : "$orange10"
              }
              color="$white1"
            >
              {`Usuario
                ${
                  has?.({ permission: "premium:plan" }) ? "Premium" : "Básico"
                }`}
            </Button>
          </YStack>
        </YStack>
      </View>
      <YStack mt="$10" alignItems="flex-start">
        <Button
          onPress={() => router.push("/(modals)/personal-info")}
          icon={User}
          size="$6"
        >
          Mis Datos
        </Button>
        <Button
          onPress={() => router.push("/(modals)/membership")}
          icon={UserSquare2}
          size="$6"
        >
          Membresía
        </Button>
        <Button
          onPress={() => router.push("/(modals)/notifications")}
          icon={Bell}
          size="$6"
        >
          Notificaciones
        </Button>
        <Button
          onPress={() => {
            signOut();
            router.replace("/(auth)/sign-in");
          }}
          color="$red10Light"
          icon={LogOut}
          size="$6"
        >
          Salir
        </Button>
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
        backgroundColor="$green9Light"
        elevation="$4"
      />
    </SafeAreaView>
  );
}
