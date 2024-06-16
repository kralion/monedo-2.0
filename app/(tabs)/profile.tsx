import useAuth from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import { Bell, LogOut, User, Wallet } from "@tamagui/lucide-icons";
import { Link, useRouter } from "expo-router";
import { View } from "react-native";
import { Avatar, Button, H3, Text, XStack, YStack } from "tamagui";

export default function App() {
  const { userData } = useAuth();
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/(auth)/sign-in");
  }

  return (
    <View>
      <View style={{ backgroundColor: "#F5F5F5", height: 40 }}>
        <YStack
          space={3}
          className=" absolute left-28 right-28 top-24"
          alignItems="center"
        >
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
      <XStack>
        <YStack
          gap="$2"
          paddingLeft={5}
          alignItems="flex-start"
          marginTop={200}
        >
          <Button
            onPress={() => router.push("/(modals)/personal-info")}
            chromeless
            size="$4"
            icon={User}
          >
            Mis Datos
          </Button>
          <Button
            onPress={() => router.push("/(modals)/budget")}
            chromeless
            size="$4"
            icon={Wallet}
          >
            Presupuestos
          </Button>
          <Button
            onPress={() => router.push("/(modals)/notifications")}
            chromeless
            size="$4"
            icon={Bell}
          >
            Notificaciones
          </Button>
          <Button onPress={() => signOut()} chromeless size="$4" icon={LogOut}>
            Salir
          </Button>
        </YStack>

        <YStack style={{ position: "relative" }}>
          <View
            style={{
              width: 12,
              position: "absolute",
              top: 44,
              borderRadius: 10,
              shadowColor: "#000000",
              shadowOpacity: 0.5,
              shadowRadius: 10,
              backgroundColor: "slategray",
              marginLeft: 24,
              transform: [{ rotate: "-23deg" }],
              height: 96,
            }}
          />
          <View
            style={{
              width: 12,
              position: "absolute",
              top: 32,
              borderRadius: 10,
              shadowColor: "#000000",
              shadowOpacity: 0.5,
              shadowRadius: 10,
              backgroundColor: "accentcolor",
              marginLeft: 28,
              transform: [{ rotate: "-18deg" }],
              height: 96,
            }}
          />
          <View
            style={{
              width: 12,
              position: "absolute",
              top: 20,
              borderRadius: 10,
              shadowColor: "#000000",
              shadowOpacity: 0.5,
              shadowRadius: 10,
              backgroundColor: "primarycolor",
              marginLeft: 32,
              transform: [{ rotate: "-10deg" }],
              height: 96,
            }}
          />
        </YStack>
      </XStack>

      <XStack
        alignItems="center"
        justifyContent="center"
        className="text-sm text-center absolute -bottom-24 left-20 "
      >
        <Text>Desarrollado por</Text>

        <Link
          href="https://twitter.com/joanpaucar_"
          className="px-1  text-primary active:underline"
        >
          Brayan
        </Link>
        <Text className="text-gray-400">&</Text>
        <Link
          href="https://www.facebook.com/miguelangel.requenaramos.94"
          className="px-1 text-primary active:underline "
        >
          Miguel
        </Link>
      </XStack>
    </View>
  );
}
