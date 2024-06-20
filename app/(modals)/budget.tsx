import { SavingGoalModal } from "@/components/popups/save-goals";
import { useAuth, useBudgetContext } from "@/context";
import { IBudget } from "@/interfaces";
import { IPresupuesto } from "@/interfaces/presupuesto";
import { supabase } from "@/utils/supabase";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { FlashList } from "@shopify/flash-list";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { router } from "expo-router";
import { Budget as SingleBudget } from "@/components/wallet/budget";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";
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
const items = [
  { label: "Mensual", value: "monthly" },
  { label: "Semanal", value: "weekly" },
  { label: "Trimestral", value: "quarterly" },
];

export default function Budget() {
  const [showSavingGoalModal, setShowSavingGoalModal] = React.useState(false);
  const { budgets, getRecentBudgets } = useBudgetContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Item>();
  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;
  };

  const [isLoading, setIsLoading] = React.useState(false);
  const { userData } = useAuth();

  const onChangeFechaRegistro = (event: DateTimePickerEvent) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;
    const selectedDate = new Date(timestamp ?? 0);
    setValue("fecha_registro", selectedDate);
  };
  const onChangeFechaFinal = (event: DateTimePickerEvent) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;
    const selectedDate = new Date(timestamp ?? 0);
    setValue("fecha_final", selectedDate);
  };

  const toast = useToastController();
  async function onSubmit(data: Item) {
    setIsLoading(true);
    const { error } = await supabase
      .from("presupuestos")
      .insert({
        ...data,
        usuario_id: userData?.id,
      })
      .single();
    console.log(error);
    if (error) {
      toast.show("Error al guardar el presupuesto");
      return;
    }
    setIsLoading(false);
    setShowSavingGoalModal(true);
    reset();
  }

  React.useEffect(() => {
    getRecentBudgets(userData?.id);
  }, [userData]);
  return (
    <ScrollView>
      <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <SavingGoalModal
          openModal={showSavingGoalModal}
          setOpenModal={setShowSavingGoalModal}
        />
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
                        {React.useMemo(
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
          size="$5"
          bg="$green8Light"
          color="$white1"
          onPress={handleSubmit(onSubmit)}
        >
          {isLoading ? <Spinner size="small" color="$white1" /> : "Registrar"}
        </Button>
        <YStack gap="$2" mt={10}>
          <Text className="font-bold text-xl">Historial de Presupuestos</Text>
          <FlashList
            data={budgets}
            estimatedItemSize={20}
            renderItem={({ item }) => {
              return <SingleBudget budget={item} />;
            }}
          />
        </YStack>
      </SafeAreaView>
    </ScrollView>
  );
}
