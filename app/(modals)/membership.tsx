import { useAuth } from "@/context";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { View } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";

export default function Membership() {
  const { userData, session } = useAuth();
  const dateFormatted = session?.user.created_at
    ? new Date(session?.user.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const timeformatted = session?.user.created_at
    ? new Date(session?.user.created_at).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  return (
    <ScrollView background="white" className="p-5 space-y-5 ">
      <XStack gap="$2">
        <View
          style={{
            width: 50,
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 6,
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
            }}
            source={require("../../assets/icon.png")}
          />
        </View>
        <YStack gap="$1">
          <Text className="text-xl font-bold">
            {userData?.rol === "premium" ? "Plan Pro" : "Plan Básico"}
          </Text>

          <Text className="text-sm text-textmuted">
            Adquisición : {dateFormatted}
          </Text>
          <Text className="text-sm ">
            Facturacion :
            <Text className="text-sm font-semibold">
              {userData?.rol === "premium" ? "20/12" : "15/12"}
            </Text>
          </Text>
        </YStack>
      </XStack>
      <YStack className="border border-teal-500" borderRadius={10}>
        <XStack
          className="bg-teal-300/50 p-4"
          borderTopStartRadius="$2"
          borderTopEndRadius="$2"
          gap="$2"
          alignItems="center"
        >
          <AntDesign name="infocirlceo" size={24} color="teal" />
          <Text className="text-sm font-semibold  text-teal-700">
            Informacion del Plan
          </Text>
        </XStack>
        <YStack className="p-4" space={3}>
          <Text className="text-sm mb-3 text-mute">
            Esta información es de caracter informativo y no puede ser editada o
            modificada. Se cauteloso con la información que compartas.
          </Text>

          <Text className="text-sm font-semibold  ">
            Fecha Adquirida : {dateFormatted} - {timeformatted}
          </Text>
          <XStack space={2}>
            <Text className="text-sm text-slate-500">Código :</Text>
            <Text className="text-sm  ">
              {userData?.rol === "premium" ? "pR3M1uM" : "bA1sIcO"}
            </Text>
          </XStack>
          <XStack space={2}>
            <Text className="text-sm text-slate-500">Propietario :</Text>
            <Text className="text-sm  ">
              {userData.nombres} {userData.apellidos}
            </Text>
          </XStack>
          <XStack space={2} alignItems="center">
            <Text className="text-sm text-slate-500">Facturación Actual :</Text>
            <Text bg="$green10Light" br="$5" p="$2">
              {userData?.rol === "premium"
                ? "20.00 SOLES / mes"
                : "00.00 SOLES / mes"}
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
