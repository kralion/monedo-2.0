import { FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast, useToastState } from "@tamagui/toast";
import {
  ScrollView,
  YStack,
  XStack,
  Button,
  Separator,
  Input,
  Checkbox,
  Unspaced,
  Text,
  H2,
  Label,
  Paragraph,
} from "tamagui";
import { Check } from "@tamagui/lucide-icons";

type FormData = {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
};

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showTCModal, setShowTCModal] = React.useState(false);
  // const toast = useToast();

  async function sendWelcomeNotification(userId: string) {
    const notification = {
      titulo: "Bienvenido !!!",
      descripcion:
        "Registrado exitosamente en la app, ahora puedes comenzar a usarla con el plan gratuito.",
      fecha: new Date().toISOString(),
      usuario_id: userId,
      tipo: "INFO",
    };

    // await supa  base.from("notificaciones").insert(notification);
  }

  // async function signUpWithEmail(data: FormData) {
  //   setLoading(true);
  //   const { data: authData, error } = await supabase.auth.signUp({
  //     email: data.email,
  //     password: data.password,
  //     options: {
  //       emailRedirectTo: "https://expensetrackerweb.vercel.app",
  //     },
  //   });

  //   if (error) {
  //     toast.show({
  //       render: () => (
  //         <Alert variant="solid" rounded={10} px={5} status="error">
  //           <XStack space={2} alignItems="center">
  //             <Alert.Icon mt="1" />
  //             <Text className="text-white">Error de Registro</Text>
  //           </XStack>
  //         </Alert>
  //       ),
  //       description: "",
  //       duration: 2000,
  //       placement: "top",
  //       variant: "solid",
  //     });
  //   } else {
  //     toast.show({
  //       render: () => (
  //         <Alert variant="solid" rounded={10} px={5} status="success">
  //           <XStack space={2} alignItems="center">
  //             <Alert.Icon mt="1" />
  //             <Text className="text-white">
  //               Registro exitoso, ahora puedes comenzar a usarla con el plan
  //               gratuito.
  //             </Text>
  //           </XStack>
  //         </Alert>
  //       ),
  //       description: "",
  //       duration: 2000,
  //       placement: "top",
  //       variant: "solid",
  //     });
  //     if (authData.user) {
  //       await sendWelcomeNotification(authData.user.id);
  //     }
  //     setLoading(false);
  //     reset();
  //     router.push("/(auth)/sign-in");
  //   }
  // }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <YStack gap="$4" className="flex items-start">
            <YStack gap="$1">
              <H2>Crea una cuenta</H2>
              <XStack gap="$1.5" alignItems="center">
                <Text>Ya tienes una cuenta?</Text>
                <Button unstyled onPress={() => router.push("/(auth)/sign-in")}>
                  <Text
                    color="$green8Light"
                    pressStyle={{ textDecorationLine: "underline" }}
                  >
                    Inicia Sesión
                  </Text>
                </Button>
              </XStack>
            </YStack>
            <YStack justifyContent="center" gap="$4">
              <XStack gap="$4">
                <Button flex={1}>
                  <FontAwesome5 size={24} color="white" name="apple" />
                </Button>
                <Button flex={1}>
                  <FontAwesome5 size={24} color="white" name="facebook" />
                </Button>
                <Button flex={1} borderWidth={0.2}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={{
                      uri: "https://img.icons8.com/?size=96&id=17949&format=png",
                    }}
                    alt="google"
                  />
                </Button>
              </XStack>
              <XStack gap="$2" alignItems="center">
                <Separator flex={1} />
                <Text>o</Text>
                <Separator flex={1} />
              </XStack>
              {/* <TermsPolicyModal
              openModal={showTCModal}
              setOpenModal={setShowTCModal}
            /> */}
              <XStack gap="$4">
                <Controller
                  name="nombres"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Requerido",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Solo puede contener letras",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="$5"
                      width={"48%"}
                      borderRadius={7}
                      py={3}
                      placeholder="Nombres"
                      value={value}
                      onChangeText={(value) => onChange(value)}
                    />
                  )}
                />

                <Controller
                  name="apellidos"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Requerido",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Solo puede contener letras",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="$5"
                      borderRadius={7}
                      width={"47%"}
                      py={3}
                      placeholder="Apellidos"
                      value={value}
                      onChangeText={(value) => onChange(value)}
                    />
                  )}
                />
              </XStack>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Email es requerido",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Email no es válido",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    size="$5"
                    autoCapitalize="none"
                    borderRadius={7}
                    py={3}
                    placeholder="Email"
                    value={value}
                    onChangeText={(value) => onChange(value)}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Contraseña es requerida",
                  },
                  minLength: {
                    value: 8,
                    message: "Contraseña debe tener al menos 8 caracteres",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    size="$5"
                    borderRadius={7}
                    py={3}
                    placeholder="Contraseña"
                    value={value}
                    onChangeText={(value) => onChange(value)}
                    secureTextEntry
                    passwordRules={
                      "minlength: 8; required: lower; required: upper; required: digit; required: [-];"
                    }
                  />
                )}
              />
            </YStack>
            <YStack gap="$4">
              <XStack mt={4}>
                <Controller
                  control={control}
                  name="termsAndConditions"
                  defaultValue={false}
                  rules={{
                    required: {
                      value: true,
                      message:
                        "Debe aceptar los Términos y Condiciones para continuar",
                    },
                  }}
                  render={({ field }) => (
                    <XStack gap="$2" alignItems="center">
                      <Checkbox
                        className="border"
                        value={field.value.toString()}
                      >
                        <Checkbox.Indicator>
                          <Check />
                        </Checkbox.Indicator>
                      </Checkbox>
                      <Label>Acepto los Términos y Condiciones</Label>
                    </XStack>
                  )}
                />
              </XStack>
              <Button
                // onPress={handleSubmit(signUpWithEmail)}
                size="$5"
                bg="$green8Light"
                color="$white1"
              >
                Regístrate
              </Button>

              <Paragraph size="$2">
                Al continuar aceptas los{" "}
                <Text
                  color="$green8Light"
                  pressStyle={{ textDecorationLine: "underline" }}
                >
                  Términos y Condiciones
                </Text>{" "}
                , estos describen como usamos tus datos y como protegemos tu
                privacidad.
              </Paragraph>
            </YStack>
            <Text textAlign="center" fontSize="$2" mt="$12">
              Copyright © Brayan & Miguel - 2024
            </Text>
          </YStack>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
