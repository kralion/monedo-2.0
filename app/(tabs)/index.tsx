import LockIcon from "@/assets/svgs/avatar.svg";
import NoDataAsset from "@/assets/svgs/no-data.svg";
import Card from "@/components/dashboard/card";
import BuyPremiumModal from "@/components/popups/buy-premium";
import { Expense } from "@/components/shared";
import useAuth from "@/context/AuthContext";
import { useExpenseContext } from "@/context/ExpenseContext";
import { supabase } from "@/utils/supabase";

import * as React from "react";
import { Animated, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H3, H4, ScrollView, Text, XStack, YStack } from "tamagui";

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
  }, [userData, getExpensesByUser]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <>
      {showAll ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <ScrollView className=" rounded-t-3xl ">
            <SafeAreaView>
              <YStack gap="$5" className="bg-background rounded-t-3xl ">
                <XStack
                  px={4}
                  mt={4}
                  className="items-center"
                  justifyContent="space-between"
                >
                  <H3>Historial de Gastos</H3>

                  <Button
                    onPress={() => {
                      setShowAll(false);
                    }}
                    chromeless
                  >
                    Ver Menos
                  </Button>
                </XStack>
                <FlatList
                  data={expenses}
                  keyExtractor={(expense) => String(expense.id)}
                  renderItem={({ item: expense }) => (
                    <Expense expense={expense} />
                  )}
                />
              </YStack>
            </SafeAreaView>
          </ScrollView>
        </Animated.View>
      ) : (
        <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View>
            <XStack justifyContent="space-between" mx={4}>
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
              <View>
                <LockIcon
                  onPress={() => {
                    setShowBuyPremiumModal(true);
                  }}
                  width={36}
                  height={36}
                />
              </View>
            </XStack>

            <View style={{ height: 200, zIndex: 10 }} />
            <Card />
          </View>
          <ScrollView className=" rounded-t-3xl  ">
            <YStack gap="$2">
              <XStack
                px={4}
                marginTop={110}
                className="items-center"
                justifyContent="space-between"
              >
                <H4>Historial de Gastos</H4>

                <Button
                  onPress={() => {
                    setShowAll(true);
                  }}
                  chromeless
                >
                  Ver Todo
                </Button>
              </XStack>
              {expenses && expenses.length === 0 && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 10,
                  }}
                >
                  <NoDataAsset width={200} height={200} />
                  <Text className="text-zinc-400 mt-5 text-center text-sm px-10">
                    Parece que no tienes gastos registrados, haz click en el
                    icono + para agregar uno.
                  </Text>
                </View>
              )}

              <FlatList
                data={expenses}
                keyExtractor={(expense) => String(expense.id)}
                renderItem={({ item: expense }) => (
                  <Expense expense={expense} />
                )}
              />
            </YStack>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}
