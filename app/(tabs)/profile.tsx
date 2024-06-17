import useAuth from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import { Bell, LogOut, User, Wallet } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, H3, YStack } from "tamagui";

export default function App() {
  const { userData } = useAuth();
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/(auth)/sign-in");
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
            <Avatar.Fallback backgroundColor={"#F5F5F5"} />
          </Avatar>

          <YStack gap="$1">
            <H3>{`${userData.nombres} ${userData.apellidos}`}</H3>
            <Button
              borderRadius={10}
              bg={userData.rol === "premium" ? "$green8Light" : "$orange10"}
              color="$white1"
            >
              {`Usuario ${userData.rol}`}
            </Button>
          </YStack>
        </YStack>
      </View>
      <YStack mt="$10" alignItems="flex-start">
        <Button
          onPress={() => router.push("/(modals)/personal-info")}
          chromeless
          justifyContent="flex-start"
          width="100%"
          size="$5"
          icon={User}
        >
          Mis Datos
        </Button>
        <Button
          onPress={() => router.push("/(modals)/budget")}
          chromeless
          justifyContent="flex-start"
          width="100%"
          size="$5"
          icon={Wallet}
        >
          Presupuestos
        </Button>
        <Button
          onPress={() => router.push("/(modals)/notifications")}
          chromeless
          justifyContent="flex-start"
          width="100%"
          size="$5"
          icon={Bell}
        >
          Notificaciones
        </Button>
        <Button
          onPress={() => signOut()}
          justifyContent="flex-start"
          width="100%"
          chromeless
          size="$5"
          icon={LogOut}
        >
          Salir
        </Button>
      </YStack>
      <Image
        source={{
          uri: require("../../assets/images/asset-profile.png"),
        }}
        style={{
          width: 350,
          height: 350,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      />
    </SafeAreaView>
  );
}
