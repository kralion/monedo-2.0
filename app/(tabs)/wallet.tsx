import { SavingGoalModal } from "@/components/popups/save-goals";
import { useAuth, useBudgetContext, useGoalsContext } from "@/context";
import { useToastController } from "@tamagui/toast";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Budget } from "@/components/wallet/budget";
import { IBudget } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  H3,
  Input,
  Label,
  ScrollView,
  Spinner,
  Text,
  YStack,
} from "tamagui";

export default function Wallet() {
  const [showSavingGoalModal, setShowSavingGoalModal] = useState(false);
  const { getRecentGoals } = useGoalsContext();
  const { budgets, addBudget } = useBudgetContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IBudget>();

  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useAuth();
  const toast = useToastController();

  async function onSubmit(data: IBudget) {
    setIsLoading(true);
    addBudget({
      ...data,
      usuario_id: userData.id,
    });
    toast.show("Meta registrada correctamente");
    reset();
    setIsLoading(false);
  }

  useEffect(() => {
    if (userData) {
      getRecentGoals();
    }
  }, [userData, getRecentGoals]);

  return (
    <ScrollView background="white">
      <SafeAreaView>
        <YStack gap="$2">
          <H3>Prespuestos</H3>
          <Text>Gestiona y visualiza tus presupuestos mensuales</Text>
        </YStack>
        <YStack gap="$5" mt={5}>
          <YStack>
            <Label>Monto</Label>

            <Controller
              control={control}
              name="monto"
              render={({ ...field }) => (
                <Input
                  size="lg"
                  inputMode="decimal"
                  placeholder="65.00"
                  {...field}
                  borderRadius={7}
                />
              )}
              rules={{
                required: { value: true, message: "Ingrese el monto" },
                pattern: {
                  value: /^\d+(\.\d*)?$/,
                  message: "Solo se permiten números válidos",
                },
              }}
            />
          </YStack>
        </YStack>

        <Button
          onPress={handleSubmit(onSubmit)}
          size="$5"
          bg="$green8Light"
          color="$white1"
        >
          {isLoading ? <Spinner size="small" color="$white1" /> : "Registrar"}
        </Button>
        <SavingGoalModal
          openModal={showSavingGoalModal}
          setOpenModal={setShowSavingGoalModal}
        />
        <Text className="font-bold text-left mb-5 text-2xl">
          Historial de Metas
        </Text>
        <FlashList
          data={budgets}
          estimatedItemSize={16}
          renderItem={({ item: metas }) => <Budget budget={metas} />}
        />
      </SafeAreaView>
    </ScrollView>
  );
}
