import AddExpenseSuccesModal from "@/components/popups/add-expense-sucess";
import useAuth from "@/context/AuthContext";
import { useExpenseContext } from "@/context/ExpenseContext";
import { IGasto } from "@/interfaces";
import { Check } from "@tamagui/lucide-icons";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  { name: "Apple" },
  { name: "Pear" },
  { name: "Blackberry" },
  { name: "Peach" },
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
        <SafeAreaView>
          <H3>Registrar Gasto</H3>
          <YStack gap="$4">
            <YStack>
              <Label>Categoría</Label>
              <Paragraph>Como se categoriza el gasto</Paragraph>
            </YStack>
            <Controller
              name="categoria"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select.Viewport
                  animation="quick"
                  animateOnly={["transform", "opacity"]}
                  enterStyle={{ o: 0, y: -10 }}
                  exitStyle={{ o: 0, y: 10 }}
                  minWidth={200}
                >
                  <Select.Group>
                    <Select.Label>Fruits</Select.Label>
                    {useMemo(
                      () =>
                        items.map((item, i) => {
                          return (
                            <Select.Item
                              index={i}
                              key={item.name}
                              value={item.name.toLowerCase()}
                            >
                              <Select.ItemText>{item.name}</Select.ItemText>
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
              )}
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  size="lg"
                  keyboardType="numeric"
                  value={value.toString()}
                  onChangeText={(value) => onChange(value)}
                  placeholder="65.00"
                  borderRadius={7}
                />
              )}
              name="monto"
              rules={{
                required: { value: true, message: "Ingrese el monto" },
                pattern: {
                  value: /^\d+(\.\d*)?$/,
                  message: "Solo se permiten números válidos",
                },
              }}
            />

            <Controller
              name="divisa"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup value={value} name="currency">
                  <XStack gap="$2">
                    <XStack width={300} alignItems="center" gap="$4">
                      <RadioGroup.Item value="pen" id="pen">
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>

                      <Label htmlFor="pen">Soles</Label>
                    </XStack>
                  </XStack>
                </RadioGroup>
              )}
            />
            <Separator />
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
            <Controller
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
                      fecha en la que fue creado inicialmente, en este caso cada{" "}
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
            />
          </YStack>
          <Button
            onPress={handleSubmit(onSubmit)}
            size="$5"
            bg="$green8Light"
            color="$white1"
          >
            Registrar
          </Button>
          {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
