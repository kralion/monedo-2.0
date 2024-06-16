import { SavingGoalModal } from "@/components/popups/save-goals";
import { Metas } from "@/components/shared/metas";
import useAuth from "@/context/AuthContext";
import { ISaving } from "@/interfaces/saving";
import { supabase } from "@/utils/supabase";
import { Check } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H3, Input, ScrollView, Select, Text, YStack } from "tamagui";

export default function Wallet() {
  const [showSavingGoalModal, setShowSavingGoalModal] = useState(false);
  const [metas, setMetas] = useState<any>([]);

  async function getMetas() {
    const { data } = await supabase.from("metas").select("*");
    setMetas(data);
  }
  useEffect(() => {
    getMetas();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISaving>();

  const [isLoading, setIsLoading] = useState(false);
  const [presupuestos, setPresupuestos] = useState<any>([]);
  const { userData } = useAuth();
  const toast = useToastController();
  const getPresupuestos = async () => {
    const { data } = await supabase
      .from("presupuestos")
      .select("*")
      .order("fecha_registro", { ascending: true })
      .limit(3);
    setPresupuestos(data);
  };

  async function onSubmit(data: ISaving) {
    data.id = userData?.id;
    setIsLoading(true);
    const ahorroActual = 200;
    const { error } = await supabase
      .from("metas")
      .insert({
        ...data,
        usuario_id: userData?.id,
        ahorro_actual: ahorroActual,
      })
      .single();
    if (error) {
      toast.show("Error al registrar meta de ahorro");
    }
    setShowSavingGoalModal(true);
    getMetas();
    setIsLoading(false);
    reset();
  }
  useEffect(() => {
    getPresupuestos();
  }, []);

  return (
    <ScrollView background="white">
      <SafeAreaView>
        <YStack gap="$2">
          <H3>Metas de ahorro</H3>
          <Text>
            Gestiona y visualiza tus metas de ahorro en la aplicación móvil de
            gestión de gastos.
          </Text>
        </YStack>
        <YStack space={5} mt={5}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                size="lg"
                keyboardType="numeric"
                value={value}
                onChangeText={(value) => onChange(value)}
                placeholder="1500"
                borderRadius={7}
              />
            )}
            name="meta_ahorro"
            rules={{
              required: { value: true, message: "Ingrese el monto" },
              pattern: {
                value: /^\d+(\.\d*)?$/,
                message: "Solo se permiten números válidos",
              },
            }}
          />

          <Controller
            name="presupuesto_id"
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
                      presupuestos.map((item, i) => {
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
                    [presupuestos]
                  )}
                </Select.Group>
              </Select.Viewport>
            )}
            rules={{ required: true }}
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
        <SavingGoalModal
          openModal={showSavingGoalModal}
          setOpenModal={setShowSavingGoalModal}
        />
        <Text className="font-bold text-left mb-5 text-2xl">
          Historial de Metas
        </Text>
        <FlatList
          data={metas}
          keyExtractor={(metas) => String(metas.id)}
          renderItem={({ item: metas }) => <Metas metas={metas} />}
        />
      </SafeAreaView>
    </ScrollView>
  );
}
