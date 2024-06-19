import { TermsPolicyModal } from "@/components/popups/terms&policy";
import { supabase } from "@/utils/supabase";
import { FontAwesome5 } from "@expo/vector-icons";
import { Check, Info, Mail } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "tamagui";
import { useTheme } from "tamagui";
import {
  Button,
  Checkbox,
  H2,
  Input,
  Label,
  Paragraph,
  Separator,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";

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
  const [loading, setLoading] = React.useState(false);
  const [termsAndConditions, setTermsAndConditions] = React.useState(false);
  const [showTCModal, setShowTCModal] = React.useState(false);
  const router = useRouter();
  const toast = useToastController();
  const { theme } = useTheme();
  const isDarkMode = theme?.name === "dark";

  const StyledXStack = styled(XStack, {
    backgroundColor: isDarkMode ? "$gray8" : "$gray4",
    borderRadius: "$4",
    alignItems: "center",
    px: "$2",
  });

  const inputIconColor = isDarkMode ? "$gray5" : "$gray9";
  const placeholderTextColor = isDarkMode ? "$gray5" : "$gray9";
  async function sendWelcomeNotification(userId: string) {
    const notification = {
      titulo: "Bienvenido !!!",
      descripcion:
        "Registrado exitosamente en la app, ahora puedes comenzar a usarla con el plan gratuito.",
      fecha: new Date().toISOString(),
      usuario_id: userId,
      tipo: "INFO",
    };

    await supabase.from("notificaciones").insert(notification);
  }

  async function signUpWithEmail(data: FormData) {
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: "https://monedo.vercel.app",
      },
    });

    if (error) {
      toast.show("Error de Registro", {
        message: error.message,
        duration: 3000,
        type: "error",
      });
    } else {
      toast.show("Registro exitoso", {
        duration: 3000,
        type: "success",
      });
      if (authData.user) {
        await sendWelcomeNotification(authData.user.id);
      }
      setLoading(false);
      reset();
      router.push("/(auth)/sign-in");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <YStack gap="$4" className="flex items-start">
          <YStack gap="$1">
            <H2>Crea una cuenta</H2>
            <XStack gap="$1.5" alignItems="center">
              <Text>Ya tienes una cuenta?</Text>

              <Text
                onPress={() => router.back()}
                color="$green8Light"
                pressStyle={{ textDecorationLine: "underline" }}
              >
                Inicia Sesión
              </Text>
            </XStack>
          </YStack>
          <YStack justifyContent="center" gap="$4">
            <XStack gap="$4">
              <Button bg="$black5" flex={1}>
                <FontAwesome5 size={24} color="white" name="apple" />
              </Button>
              <Button bg="$blue10" flex={1}>
                <FontAwesome5 size={24} color="white" name="facebook" />
              </Button>
              <Button bg="$white1" flex={1} borderWidth={0.2}>
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
              <Separator flex={1} borderColor="$gray5" />
              <Text>o</Text>
              <Separator flex={1} borderColor="$gray5" />
            </XStack>

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
                    message: "Sólo letras",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <YStack>
                    <Input
                      size="$5"
                      width={"48%"}
                      borderRadius={7}
                      py={3}
                      placeholder="Nombres"
                      value={value}
                      onChangeText={(value) => onChange(value)}
                    />
                    {errors.nombres && (
                      <XStack gap="$1" alignItems="center">
                        <Text fontSize="$3" color="$red9Light">
                          <Info />
                          {errors.nombres.message}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
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
                    message: "Solo letras",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <YStack>
                    <Input
                      size="$5"
                      borderRadius={7}
                      width={"47%"}
                      py={3}
                      placeholder="Apellidos"
                      value={value}
                      onChangeText={(value) => onChange(value)}
                    />
                    {errors.apellidos && (
                      <XStack gap="$1" alignItems="center">
                        <Text fontSize="$3" color="$red9Light">
                          <Info />
                          {errors.apellidos.message}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
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
              render={({ field }) => (
                <YStack>
                  <StyledXStack>
                    <Mail color={inputIconColor} />
                    <Input
                      size="$5"
                      autoCapitalize="none"
                      borderRadius={0}
                      py={3}
                      placeholder="Email"
                      placeholderTextColor={placeholderTextColor}
                      flex={1}
                      {...field}
                      backgroundColor="transparent"
                    />
                  </StyledXStack>
                  {errors.email && (
                    <XStack gap="$1" alignItems="center">
                      <Text fontSize="$3" color="$red9Light">
                        <Info />
                        {errors.email.message}
                      </Text>
                    </XStack>
                  )}
                </YStack>
              )}
            />
            <YStack>
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
                    message: "Mínimo 8 caracteres",
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
                  />
                )}
              />
              {errors.password && (
                <XStack gap="$1" alignItems="center">
                  <Text fontSize="$3" color="$red9Light">
                    <Info />
                    {errors.password.message}
                  </Text>
                </XStack>
              )}
            </YStack>
          </YStack>
          <YStack gap="$4">
            <XStack gap="$2" mt="$2" alignItems="center">
              <Checkbox
                borderColor={termsAndConditions ? "$" : "$red9Light"}
                className="border"
                onCheckedChange={() =>
                  setTermsAndConditions(!termsAndConditions)
                }
                checked={termsAndConditions}
              >
                <Checkbox.Indicator>
                  <Check />
                </Checkbox.Indicator>
              </Checkbox>
              <Label color={termsAndConditions ? "" : "$red9Light"}>
                Acepto los Términos y Condiciones
              </Label>
            </XStack>
            <Button
              onPress={handleSubmit(signUpWithEmail)}
              size="$5"
              bg="$green8Light"
              color="$white1"
            >
              {loading ? (
                <Spinner size="small" color="$white1" />
              ) : (
                "Registrarse"
              )}
            </Button>

            <Paragraph size="$2">
              Al continuar aceptas los{" "}
              <Text
                color="$green8Light"
                style={{
                  textDecorationLine: "underline",
                }}
                pressStyle={{
                  opacity: 0.5,
                }}
                onPress={() => setShowTCModal(true)}
              >
                Términos y Condiciones{" "}
              </Text>
              , en estos se describen como usamos tus datos y como protegemos tu
              privacidad.
            </Paragraph>
          </YStack>
          <XStack mt="$12" alignItems="center" justifyContent="center">
            <Text fontSize="$2">Copyright © 2024 </Text>
            <Text
              fontSize="$2"
              color="$green8Light"
              pressStyle={{ textDecorationLine: "underline" }}
            >
              <Link href="https://x.com/brayanpaucar_">Brayan</Link>
            </Text>

            <Text fontSize="$2"> & </Text>
            <Text
              fontSize="$2"
              color="$green8Light"
              pressStyle={{ textDecorationLine: "underline" }}
            >
              <Link href="https://x.com/MiguelParis11">Miguel</Link>
            </Text>
          </XStack>
        </YStack>
        <TermsPolicyModal
          openModal={showTCModal}
          setOpenModal={setShowTCModal}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
