import { SavingGoalModal } from "@/components/popups/save-goals";
import { Budget } from "@/components/wallet/budget";
import { useAuth, useBudgetContext } from "@/context";
import { IBudget } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Adapt,
  Button,
  H2,
  H4,
  Input,
  Label,
  ScrollView,
  Select,
  Sheet,
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

  return (
    <ScrollView background="white">
      <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <YStack gap="$5">
          <YStack gap="$2">
            <H2>Presupuestos</H2>
            <Text>Gestiona y visualiza tus presupuestos mensuales</Text>
          </YStack>
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
            <Controller
              name="duration"
              control={control}
              render={({ field: { onChange, value } }) => (
                <YStack>
                  <Label>Duración</Label>
                  <Select
                    value={value}
                    onValueChange={onChange}
                    disablePreventBodyScroll
                  >
                    <Select.Trigger iconAfter={ChevronDown}>
                      <Select.Value placeholder="Selecciona" />
                    </Select.Trigger>

                    <Adapt when="sm" platform="touch">
                      <Sheet modal dismissOnSnapToBottom>
                        <Sheet.Frame>
                          <Sheet.ScrollView>
                            <Adapt.Contents />
                          </Sheet.ScrollView>
                        </Sheet.Frame>
                        <Sheet.Overlay />
                      </Sheet>
                    </Adapt>

                    <Select.Content zIndex={200000}>
                      <Select.ScrollUpButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                      >
                        <YStack zIndex={10}>
                          <ChevronUp size={20} />
                        </YStack>
                      </Select.ScrollUpButton>

                      <Select.Viewport>
                        <Select.Group>
                          {useMemo(
                            () =>
                              items.map((item, i) => {
                                return (
                                  <Select.Item
                                    index={i}
                                    key={item.value}
                                    value={item.value}
                                  >
                                    <Select.ItemText>
                                      {item.label}
                                    </Select.ItemText>
                                    <Select.ItemIndicator marginLeft="auto">
                                      <Check size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                );
                              }),
                            [items]
                          )}
                        </Select.Group>
                      </Select.Viewport>

                      <Select.ScrollDownButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                      >
                        <YStack zIndex={10}>
                          <ChevronDown size={20} />
                        </YStack>
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select>
                </YStack>
              )}
            />
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
          <YStack mt={5}>
            <H4>Historial de Metas</H4>
            <FlashList
              data={budgets}
              estimatedItemSize={100}
              renderItem={({ item: budget }) => {
                return <Budget budget={budget} />;
              }}
            />
          </YStack>
        </YStack>
      </SafeAreaView>
    </ScrollView>
  );
}
