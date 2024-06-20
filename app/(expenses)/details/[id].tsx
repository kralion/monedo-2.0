import { useExpenseContext } from "@/context";
import { IExpense } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useToastController } from "@tamagui/toast";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import {
  AlertDialog,
  Button,
  H1,
  ScrollView,
  Separator,
  Slider,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";

export default function ExpenseDetails() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const { deleteExpense } = useExpenseContext();
  const [expense, setExpense] = React.useState({} as IExpense);
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useLocalSearchParams<{ id: string }>();
  const toast = useToastController();
  const handleDeleteExpense = async (id: string) => {
    deleteExpense(id);
    toast.show("Gasto eliminado");
    router.push("/(tabs)/");
    setIsOpen(false);
  };

  async function getExpenseById(id: string) {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setExpense(data);
    return data;
  }

  React.useEffect(() => {
    if (params.id) {
      setIsFetching(true);
      getExpenseById(params.id);
      setIsFetching(false);
    }
  }, [params.id]);

  if (!expense) {
    return <Spinner mt="$5" size="large" />;
  }

  const monto_gastado = expense.monto;
  //TODO: Cambiar este valor por el monto presupuestado del mes actual
  const monto_presupuestado = 1000;
  const totalPercentageExpensed =
    (monto_gastado ?? 100 / monto_presupuestado) * 100;
  return (
    <ScrollView>
      {isFetching ? (
        <Spinner mt="$5" size="large" />
      ) : (
        <YStack gap="$3">
          <AlertDialog open={isOpen}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay
                key="overlay"
                animation="quick"
                opacity={0.5}
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
              <AlertDialog.Content
                bordered
                elevate
                key="content"
                animation={[
                  "quick",
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ]}
                enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                x={0}
                scale={1}
                opacity={1}
                y={0}
              >
                <YStack gap="$2">
                  <AlertDialog.Title>Eliminar Gasto</AlertDialog.Title>
                  <AlertDialog.Description>
                    Este gasto será eliminado de la base de datos y no podrá ser
                    recuperado.
                  </AlertDialog.Description>

                  <XStack gap="$3" mt="$7" justifyContent="flex-end">
                    <AlertDialog.Cancel
                      onPress={() => setIsOpen(false)}
                      asChild
                    >
                      <Button chromeless>Cancelar</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <Button
                        onPress={() => handleDeleteExpense(params.id ?? "")}
                        bg="$red10Light"
                        color="$white1"
                      >
                        Eliminar
                      </Button>
                    </AlertDialog.Action>
                  </XStack>
                </YStack>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog>

          <YStack gap="$2" p="$3">
            <Text fontSize="$5" color="$gray10">
              Monto
            </Text>

            <H1>S/. {expense?.monto}</H1>
          </YStack>

          <Text mb="$4" mt="$1" p="$3" fontSize="$5" color="$gray10">
            {expense.descripcion}
          </Text>

          <Separator borderColor="$gray7" />
          <YStack p="$3" gap="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" color="$gray10">
                Fecha
              </Text>
              <Text fontSize="$6">
                {new Date(expense.fecha).toLocaleDateString("es-PE", {
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </XStack>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" color="$gray10">
                Hora
              </Text>
              <Text fontSize="$6">
                {new Date(expense.fecha).toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Text>
            </XStack>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" color="$gray10">
                Categoría
              </Text>
              <Button
                disabled
                size="$2"
                borderRadius="$7"
                bg="$gray10"
                minWidth="$9"
                color="$white1"
              >
                {expense.categoria}
              </Button>
            </XStack>
          </YStack>
          <Slider
            mt="$7"
            mx="$3"
            defaultValue={[totalPercentageExpensed]}
            max={100}
            step={1}
          >
            <Slider.Track>
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb index={0} size="$1" circular elevate />
          </Slider>
          <XStack mx="$3" justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" color="$gray10">
              0
            </Text>
            <Text fontSize="$5" color="$gray10">
              1000
            </Text>
          </XStack>

          <Button
            onPress={() => setIsOpen(true)}
            size="$5"
            m="$3"
            mt="$10"
            bg="$red10Light"
            color="$white1"
          >
            {isLoading ? <Spinner size="small" color="$white1" /> : "Eliminar"}
          </Button>
          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </YStack>
      )}
    </ScrollView>
  );
}
