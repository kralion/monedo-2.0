import CameraIcon from "@/assets/svgs/camera.svg";
import { useAuth } from "@/context";
import { supabase } from "@/utils/supabase";
import { useToastController } from "@tamagui/toast";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  Avatar,
  Button,
  H4,
  Input,
  Label,
  ScrollView,
  Stack,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { Edit3 } from "@tamagui/lucide-icons";
interface FormData {
  nombres: string;
  apellidos: string;
  foto: string;
  rol: string;
}

export default function PersonalInfo() {
  const { userData, session } = useAuth();
  const toast = useToastController();
  const headerHeight = useHeaderHeight();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombres: userData?.nombres,
      apellidos: userData?.apellidos,
      rol: userData?.rol,
      foto: "https://img.icons8.com/?size=40&id=23454&format=png",
    },
  });

  async function onSubmit(data: FormData) {
    const { error } = await supabase
      .from("usuarios")
      .update({
        nombres: data.nombres,
        apellidos: data.apellidos,
      })
      .eq("id", userData.id);

    if (error) {
      toast.show("Error al Actualizar Datos");
      return;
    }

    toast.show("Datos actualizados");
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setValue("foto", result.assets[0].uri);
    }
  };

  React.useEffect(() => {
    (async () => {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        alert("Aceptar los permisos para acceder a la galería");
      }
    })();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={{ paddingTop: headerHeight }}>
        <YStack paddingHorizontal="$5" paddingTop="$5" paddingBottom="$10">
          <YStack alignItems="center">
            <Stack position="relative" width={100} height={100}>
              <Avatar circular bg="teal.600" alignSelf="center" size="$12">
                <Avatar.Image accessibilityLabel="avatar" src={userData.foto} />
                <Avatar.Fallback backgroundColor={"#F5F5F5"} />
              </Avatar>
              <Button
                onPress={pickImageAsync}
                position="absolute"
                top="$1"
                circular
                left="$12"
                color="$white1"
                borderWidth="$1"
                borderColor="white"
                bg="$gray10"
                padding={4}
                icon={<Edit3 size="$1.5" />}
              />
              <Button
                disabled
                size="$2"
                borderRadius="$10"
                mt="$3"
                bg={userData.rol === "premium" ? "$green8Light" : "$orange10"}
                color="$white1"
              >
                {`Cuenta ${userData.rol}`}
              </Button>
            </Stack>
          </YStack>
          <H4 fontWeight="bold" mt="$15">
            Informacion Básica
          </H4>
          <YStack gap="$2">
            <YStack>
              <Label>Nombres</Label>
              <Controller
                control={control}
                name="nombres"
                render={({ ...field }) => (
                  <Input
                    size="lg"
                    value={userData.nombres}
                    {...field}
                    borderRadius={7}
                  />
                )}
                rules={{
                  required: { value: true, message: "Ingrese el nombre" },
                  pattern: {
                    value: /^\d+(\.\d*)?$/,
                    message: "Solo se permiten números válidos",
                  },
                }}
              />
            </YStack>
            <YStack>
              <Label>Apellidos</Label>
              <Controller
                control={control}
                name="apellidos"
                render={({ ...field }) => (
                  <Input
                    size="lg"
                    value={userData.apellidos}
                    {...field}
                    borderRadius={7}
                  />
                )}
                rules={{
                  required: { value: true, message: "Ingrese los apellidos" },
                  pattern: {
                    value: /^\d+(\.\d*)?$/,
                    message: "Solo se permiten números válidos",
                  },
                }}
              />
            </YStack>
          </YStack>
          <Button
            size="$5"
            mt="$10"
            bg="$green8Light"
            color="$white1"
            onPress={handleSubmit(onSubmit)}
          >
            Actualizar Datos
          </Button>
        </YStack>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
