import AddExpenseSuccesModal from "@/components/popups/add-expense-sucess";
import useAuth from "@/context/AuthContext";
import { useExpenseContext } from "@/context/ExpenseContext";
import { IGasto } from "@/interfaces";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Adapt, H2, Sheet } from "tamagui";
import {
  Button,
  H3,
  Input,
  Label,
  Paragraph,
  RadioGroup,
  ScrollView,
  Select,
  Separator,
  Switch,
  Text,
  TextArea,
  XStack,
  YStack,
} from "tamagui";

const items = [
  { name: "Alimentacion" },
  { name: "Bebidas" },
  { name: "Alquiler" },
  { name: "Transporte" },
  { name: "Servicios" },
  { name: "Otros" },
];
export default function AddExpense() {
  const { userData } = useAuth();
  const { addExpense } = useExpenseContext();
  const [openModal, setOpenModal] = React.useState(false);
  const [expensePrice, setExpensePrice] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IGasto>();

  async function onSubmit(data: IGasto) {
    setIsLoading(true);
    addExpense({
      ...data,
      usuario_id: userData.id,
    });
    setExpensePrice(data.monto.toString());
    reset();

    setValue("categoria", "");
    setIsLoading(false);
    setOpenModal(true);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <AddExpenseSuccesModal
          expensePrice={expensePrice}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
        <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <YStack gap="$6">
            <YStack gap="$1">
              <H2>Nuevo Gasto</H2>
              <Text>Ingresa los detalles del gasto que hiciste</Text>
            </YStack>
            <YStack gap="$4">
              <Controller
                name="categoria"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <YStack>
                    <Label>Categoría</Label>
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
                                      key={item.name}
                                      value={item.name.toLowerCase()}
                                    >
                                      <Select.ItemText>
                                        {item.name}
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
              <YStack>
                <Label>Divisa</Label>

                <Controller
                  name="divisa"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup value={value} name="currency">
                      <XStack gap="$6">
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="pen" id="pen">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="pen">Soles</Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="usd" id="usd">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="pen">Dólares</Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="eur" id="eur">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="eur">Euros</Label>
                        </XStack>
                      </XStack>
                    </RadioGroup>
                  )}
                />
              </YStack>
              <Controller
                control={control}
                name="descripcion"
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    placeholder="Descripcion ..."
                    value={value}
                    onChangeText={(value) => onChange(value)}
                  />
                )}
                defaultValue=""
              />
              {/* <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <YStack space={3}>
                    <XStack
                      gap="$4"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text> Es un gasto recurrente ?</Text>
                      <XStack width={200} alignItems="center" gap="$4">
                        <Label
                          paddingRight="$0"
                          minWidth={90}
                          justifyContent="flex-end"
                          htmlFor="recurrent"
                        >
                          Accept
                        </Label>
                        <Separator minHeight={20} vertical />
                        <Switch id="recurrent">
                          <Switch.Thumb animation="quicker" />
                        </Switch>
                      </XStack>
                    </XStack>
                    {value && (
                      <Text className="text-textmuted text-xs">
                        La recurrencia del gasto se hará efectivo cada mes en la
                        fecha en la que fue creado inicialmente, en este caso
                        cada{" "}
                        <Text className="font-bold text-black">
                          {new Date().toLocaleDateString("es-PE", {
                            day: "numeric",
                          })}
                        </Text>{" "}
                        de cada mes
                      </Text>
                    )}
                  </YStack>
                )}
                name="periodicidad"
                defaultValue={false}
              /> */}
              <Button
                onPress={handleSubmit(onSubmit)}
                size="$5"
                bg="$green8Light"
                color="$white1"
                mt="$6"
              >
                Registrar
              </Button>
            </YStack>
          </YStack>
          {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
