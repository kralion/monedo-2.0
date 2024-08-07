import CameraIcon from "@/assets/svgs/camera.svg";
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
import { useAuth, useUser } from "@clerk/clerk-expo";
interface FormData {
  name: string;
  lastName: string;
  imageUrl: string;
}

export default function PersonalInfo() {
  const { user: userData } = useUser();
  const { has } = useAuth();
  const toast = useToastController();
  const headerHeight = useHeaderHeight();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.firstName,
      lastName: userData?.lastName,
      imageUrl: userData?.imageUrl,
    },
  });

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setValue("imageUrl", result.assets[0].uri);
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
                <Avatar.Image
                  accessibilityLabel="avatar"
                  src={userData?.imageUrl}
                />
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
                bg={
                  has?.({ permission: "premium:plan" })
                    ? "$green9Light"
                    : "$orange10"
                }
                color="$white1"
              >
                {`Cuenta ${
                  has?.({ permission: "premium:plan" }) ? "Premium" : "Básico"
                }`}
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
                name="name"
                render={({ ...field }) => (
                  <Input
                    size="lg"
                    value={userData?.firstName ?? ""}
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
                name="lastName"
                render={({ ...field }) => (
                  <Input
                    size="lg"
                    value={userData?.lastName ?? ""}
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
            bg="$green9Light"
            color="$white1"
            // onPress={handleSubmit(onSubmit)}
          >
            Actualizar Datos
          </Button>
        </YStack>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
