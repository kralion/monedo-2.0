import NoDataAsset from "@/assets/svgs/no-data.svg";
import Card from "@/components/dashboard/card";
import BuyPremiumModal from "@/components/popups/buy-premium";
import { Expense } from "@/components/shared";
import { useExpenseContext, useAuth } from "@/context";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { Lock, Minimize2 } from "@tamagui/lucide-icons";
import * as React from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  H3,
  H4,
  ScrollView,
  Text,
  XStack,
  YStack,
  View,
} from "tamagui";

export default function Home() {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const { getExpensesByUser, expenses } = useExpenseContext();
  const { userData } = useAuth();
  const [showAll, setShowAll] = React.useState(false);
  const [showBuyPremiumModal, setShowBuyPremiumModal] = React.useState(false);

  if (!userData) {
    return null;
  }
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showAll ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [showAll]);

  async function welcomeNotification() {
    const notification = {
      titulo: "Bienvenido !!!",
      descripcion:
        "Registrado exitosamente en la app, ahora puedes comenzar a usarla con el plan gratuito.",
      fecha: new Date().toISOString(),
      usuario_id: userData.id,
      tipo: "INFO",
    };

    const { data } = await supabase
      .from("notificaciones")
      .select("*")
      .eq("usuario_id", userData.id);

    if (data?.length === 0) {
      await supabase.from("notificaciones").insert(notification);
    }
  }
  React.useEffect(() => {
    if (userData) {
      welcomeNotification();
    }
  }, [userData]);

  React.useEffect(() => {
    if (userData) {
      getExpensesByUser(userData.id);
    }
  }, [userData, getExpensesByUser, expenses]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <>
      {showAll ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <SafeAreaView
            style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 20 }}
          >
            <YStack gap="$5">
              <XStack justifyContent="space-between" alignItems="center">
                <H3>Gastos Recientes</H3>
                <Text
                  onPress={() => {
                    setShowAll(false);
                  }}
                  pressStyle={{
                    opacity: 0.5,
                  }}
                >
                  Ver Menos
                </Text>
              </XStack>
              <ScrollView>
                <FlashList
                  data={expenses}
                  estimatedItemSize={50}
                  renderItem={({ item: expense }) => {
                    return <Expense expense={expense} />;
                  }}
                />
              </ScrollView>
            </YStack>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <>
          <View
            paddingTop="$10"
            bg="$green8Light"
            borderBottomStartRadius={14}
            borderBottomEndRadius={14}
          >
            <XStack
              style={{ paddingHorizontal: 16 }}
              justifyContent="space-between"
              mx={4}
            >
              <YStack>
                <Text>
                  {capitalizeFirstLetter(
                    new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  )}
                </Text>
                <Text fontWeight="bold">Hola, {userData.nombres} 👋</Text>
              </YStack>
              <BuyPremiumModal
                setOpenModal={setShowBuyPremiumModal}
                openModal={showBuyPremiumModal}
              />
              <Button
                onPress={() => {
                  setShowBuyPremiumModal(true);
                }}
                size="$3.5"
                bg="$green5Light"
                pressStyle={{
                  opacity: 0.5,
                }}
                circular
                icon={<Lock size="$1" />}
              />
            </XStack>

            <View style={{ height: 150 }} />

            <Card />
          </View>
          <ScrollView style={{ paddingHorizontal: 5, zIndex: -10 }}>
            <YStack gap="$4" paddingBottom="$5">
              <XStack
                paddingTop="$13"
                paddingHorizontal="$4"
                justifyContent="space-between"
                alignItems="center"
              >
                <H4>Historial de Gastos</H4>

                <Text
                  onPress={() => {
                    setShowAll(true);
                  }}
                  pressStyle={{
                    opacity: 0.5,
                  }}
                >
                  Ver Todo
                </Text>
              </XStack>
              {expenses && expenses.length === 0 && (
                <YStack justifyContent="center" alignItems="center" gap="$3">
                  <NoDataAsset width={200} height={200} />
                  <Text textAlign="center">
                    Parece que no tienes gastos registrados, haz click en el
                    icono + para agregar uno.
                  </Text>
                </YStack>
              )}

              <FlashList
                data={expenses}
                estimatedItemSize={50}
                renderItem={({ item: expense }) => (
                  <Expense expense={expense} />
                )}
              />
            </YStack>
          </ScrollView>
        </>
      )}
    </>
  );
}
