import CameraIcon from "@/assets/svgs/camera.svg";
import { useAuth } from "@/context";
import { supabase } from "@/utils/supabase";
import { useToastController } from "@tamagui/toast";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  Avatar,
  Button,
  Input,
  Label,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "tamagui";
interface FormData {
  nombres: string;
  apellidos: string;
  email?: string;
  perfil: string;
}

export default function PersonalInfo() {
  const { userData, session } = useAuth();
  const toast = useToastController();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombres: userData?.nombres,
      apellidos: userData?.apellidos,
      email: session?.user?.email,
      perfil: "https://img.icons8.com/?size=40&id=23454&format=png",
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
      setValue("perfil", result.assets[0].uri);
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
      <ScrollView background="white">
        <YStack margin={5} space={3}>
          <YStack alignItems="center" space={3}>
            <Avatar bg="teal.600" alignSelf="center" size="$10">
              <Avatar.Image
                accessibilityLabel="avatar"
                src={userData.foto}
                style={{
                  borderRadius: 100,
                  width: 100,
                  height: 100,
                }}
              />
              <Avatar.Fallback backgroundColor={"#F5F5F5"} />
            </Avatar>

            <Button
              bg="$green8Light"
              onPress={pickImageAsync}
              icon={<CameraIcon width={30} height={30} />}
            />
          </YStack>
          <XStack>
            {/* <View className="bg-accent w-1 h-8 rounded-full my-3 " /> */}
            <Text
              fontWeight="bold"
              className="text-[#464444] p-3 font-bold text-lg"
            >
              Informacion Básica
            </Text>
          </XStack>
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

            <YStack>
              <Label>Email</Label>

              {/* //TODO: Add regex for the email */}
              <Controller
                control={control}
                name="email"
                render={({ ...field }) => (
                  <Input
                    size="lg"
                    value={userData.apellidos}
                    {...field}
                    borderRadius={7}
                  />
                )}
                rules={{
                  required: { value: true, message: "Ingrese el email" },
                }}
              />
            </YStack>

            <Button
              size="$5"
              bg="$green8Light"
              color="$white1"
              onPress={handleSubmit(onSubmit)}
            >
              Actualizar Datos
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
