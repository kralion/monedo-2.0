import { SavingGoalModal } from "@/components/popups/save-goals";
import { Budget } from "@/components/wallet/budget";
import { useAuth, useBudgetContext } from "@/context";
import { IBudget } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { useToastController } from "@tamagui/toast";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  H2,
  H4,
  Input,
  Label,
  ScrollView,
  Spinner,
  Text,
  YStack,
} from "tamagui";
interface Item extends IBudget {
  duration: string;
}

export default function Wallet() {
  const [showSavingGoalModal, setShowSavingGoalModal] = useState(false);
  const { budgets, addBudget, getRecentBudgets } = useBudgetContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Item>();

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
      getRecentBudgets(userData.id);
    }
  }, [userData, getRecentBudgets]);

  const items = [
    { label: "Mensual", value: "monthly" },
    { label: "Semanal", value: "weekly" },
    { label: "Trimestral", value: "quarterly" },
  ];
  const [budgetFormAvailable, setBudgetFormAvailable] = useState(true);
  const [walletText, setWalletText] = useState(
    `Crea un presupuesto para ${new Date()
      .toLocaleDateString("es-ES", {
        month: "long",
      })
      .toUpperCase()}`
  );

  return (
    <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <ScrollView background="white">
        <YStack gap="$3">
          <YStack gap="$2">
            <H2>Presupuestos</H2>
            <Text>{walletText}</Text>
          </YStack>
          {budgetFormAvailable && (
            <>
              <YStack gap="$4" mt={5}>
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
                {isLoading ? (
                  <Spinner size="small" color="$white1" />
                ) : (
                  "Registrar"
                )}
              </Button>

              <SavingGoalModal
                openModal={showSavingGoalModal}
                setOpenModal={setShowSavingGoalModal}
              />
            </>
          )}
          <YStack mt="$5">
            <H4>Historial de Presupuestos</H4>
            <FlashList
              data={budgets}
              estimatedItemSize={100}
              renderItem={({ item: budget }) => {
                return <Budget budget={budget} />;
              }}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
