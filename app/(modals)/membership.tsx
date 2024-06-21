import { useAuth } from "@/context";
import { AntDesign } from "@expo/vector-icons";
import { BadgeInfo } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import {
  ScrollView,
  Separator,
  Stack,
  Text,
  XStack,
  YStack,
  View,
  H4,
  Button,
  H3,
} from "tamagui";

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
    <ScrollView>
      <YStack gap="$4" p="$4">
        <XStack gap="$4" alignItems="center">
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
            }}
            source={require("../../assets/icon.png")}
          />
          <YStack gap="$2">
            <H4>{userData?.rol === "premium" ? "Plan Pro" : "Plan Básico"}</H4>

            <Text color="$gray10Light">
              Adquisición: <Text> {dateFormatted}</Text>
            </Text>
            <Text color="$gray10Light">
              Ciclo Facturación:{" "}
              <Text className="text-sm font-semibold">
                {userData?.rol === "premium" ? "20/12" : "15/12"}
              </Text>
            </Text>
          </YStack>
        </XStack>
        <Separator borderColor="$gray8" />
        <YStack gap="$4" bg="$gray6" p="$4" borderRadius="$4">
          <XStack gap="$2" alignItems="center">
            <BadgeInfo size={24} color="$green8Light" />
            <Text fontSize="$4">Información del Plan</Text>
          </XStack>
          <YStack gap="$4">
            <Text className="text-sm mb-3 text-mute">
              Esta información es de caracter informativo y no puede ser editada
              o modificada. Se cauteloso con la información que compartas.
            </Text>

            <XStack>
              <Text color="$gray10Light">Titular de la cuenta: </Text>
              <Text>
                {userData.nombres} {userData.apellidos}
              </Text>
            </XStack>
          </YStack>
        </YStack>
        <H3>Monto Recargo</H3>
        <Button
          disabled
          size="$5"
          bg={userData.rol === "premium" ? "$green8Light" : "$orange10"}
          color="$white1"
        >
          {userData?.rol === "premium"
            ? "S/. 20.00 PEN / mes"
            : "S/. 00.00 PEN / mes"}
        </Button>
      </YStack>
    </ScrollView>
  );
}
