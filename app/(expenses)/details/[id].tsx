import { useExpenseContext } from "@/context";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useToastController } from "@tamagui/toast";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import {
  AlertDialog,
  Button,
  Separator,
  Slider,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";

export default function ExpenseDetailsModal() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { getExpenseById, expense } = useExpenseContext();
  const params = useLocalSearchParams<{ id: string }>();
  const toast = useToastController();
  const handleDeleteExpense = async (id: string) => {
    await supabase.from("expenses").delete().eq("id", id);
    toast.show("Gasto eliminado");
    router.push("/(tabs)/");
  };

  React.useEffect(() => {
    getExpenseById(params.id ?? "");
  }, [params.id]);

  const monto_gastado = expense?.monto;
  // const monto_presupuestado = expense.cantidad;
  //TODO: Cambiar este valor por el monto presupuestado del mes actual
  const monto_presupuestado = 1000;
  const totalPercentageExpensed = (monto_gastado / monto_presupuestado) * 100;
  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);
  return (
    <YStack borderBottomEndRadius={10} borderBottomStartRadius={10} p={3}>
      {totalPercentageExpensed >= 80 && (
        <Text>
          Parece que ya gastaste un alto de tu presupuesto mensual te
          recomendamos reconsiderar los gastos que realizas
        </Text>
      )}

      <AlertDialog native open={isOpen}>
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
              <AlertDialog.Title>Elimar Gasto</AlertDialog.Title>
              <AlertDialog.Description>
                Este gasto será eliminado de la base de datos y no podrá ser
                recuperado.
              </AlertDialog.Description>

              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button>Cancelar</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action
                  onPress={() => handleDeleteExpense(params.id ?? "")}
                  asChild
                >
                  <Button theme="active">Eliminar</Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>

      <XStack p="$2" justifyContent="space-between">
        <XStack gap="$1">
          <Text fontWeight="bold">#{expense.numeroGasto}</Text>
          <Text bg="$green10Light" br="$5" p="$2">
            {expense.categoria}
          </Text>
        </XStack>
        {/* //! FEATURE : Cambiar este icono dependiendo al tipo de gasto */}
        <Ionicons name="information-circle-outline" size={24} />
      </XStack>
      <YStack p="$2" gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <Text>Monto</Text>
          <Text fontWeight="bold">S/. {expense.monto}</Text>
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <Text>Divisa</Text>
          <Text fontWeight="bold">{expense.divisa}</Text>
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <Text>Categoría</Text>
          <Text fontWeight="bold">{expense.categoria}</Text>
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <Text>Descripción</Text>
          <Text fontWeight="bold">{expense.descripcion}</Text>
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <Text>% Presupuesto</Text>

          <Text fontWeight="bold">{expense.monto}</Text>
        </XStack>

        <XStack justifyContent="flex-end" space={3}>
          <Text bg="$green10Light" br="$5" p="$2">
            {expense.fecha?.toLocaleString()}
          </Text>
          <Text bg="$green10Light" br="$5" p="$2">
            {expense.fecha
              ? new Date(expense.fecha).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
        </XStack>
      </YStack>
      <Separator borderColor="$gray5" />
      <XStack gap="$2" p="$2">
        <Text className="text-black font-bold mb-1  text-[18px]">
          Presupuesto Gastado
        </Text>
        <Text
          bg={totalPercentageExpensed > 80 ? "red10Light" : "$green10Light"}
          br="$5"
          p="$2"
        >
          {totalPercentageExpensed}%
        </Text>
      </XStack>
      <XStack justifyContent="center" p="$2" gap="$2">
        <Slider
          size="$4"
          width={200}
          defaultValue={[totalPercentageExpensed]}
          max={100}
          step={1}
          borderColor={
            totalPercentageExpensed >= 80 ? "red10Light" : "$green10Light"
          }
        >
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} />
        </Slider>
      </XStack>
      <Separator borderColor="$gray5" />

      <XStack justifyContent="center" p="$2" gap="$2">
        <Button
          onPress={() => setIsOpen(!isOpen)}
          size="$5"
          bg="$red8Light"
          color="$white1"
        >
          {isLoading ? <Spinner size="small" color="$white1" /> : "Eliminar"}
        </Button>
      </XStack>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </YStack>
  );
}
