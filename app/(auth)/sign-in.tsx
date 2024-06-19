import { supabase } from "@/utils/supabase";
import { Info } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  H2,
  Input,
  Separator,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";

type FormData = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const toast = useToastController();
  async function signInWithEmail(data: FormData) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.show("Credenciales inválidas", {
        status: "error",
        duration: 2000,
        placement: "top",
      });
    } else {
      router.push("/(tabs)/");
    }
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <YStack gap="$10">
          <YStack gap="$1">
            <H2>Inicio de Sesión</H2>
            <Text>Ingresa tus credenciales para continuar</Text>
          </YStack>
          <YStack gap="$4">
            <Controller
              control={control}
              name="email"
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
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack>
                  <Input
                    py={3}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    borderRadius={7}
                    placeholder="Correo electrónico"
                    size="$5"
                  />
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

            <Controller
              control={control}
              name="password"
              rules={{
                required: {
                  value: true,
                  message: "Campo requerido",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack>
                  <Input
                    py={3}
                    placeholder="Contraseña"
                    secureTextEntry
                    size="$5"
                    onChangeText={onChange}
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
              )}
            />

            <Button
              onPress={handleSubmit((data) => {
                signInWithEmail(data);
              })}
              size="$5"
              bg="$green8Light"
              color="$white1"
            >
              {loading ? <Spinner size="small" color="$white1" /> : "Ingresar"}
            </Button>

            <XStack gap="$2" alignItems="center">
              <Separator flex={1} borderColor="$gray5" />
              <Text>o</Text>
              <Separator flex={1} borderColor="$gray5" />
            </XStack>
            <Button size="$5" variant="outlined">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=96&id=17949&format=png",
                }}
                width={25}
                height={25}
              />
              Continuar con Google
            </Button>
            <Button variant="outlined" size="$5">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=96&id=uLWV5A9vXIPu&format=png",
                }}
                width={25}
                height={25}
              />
              Continuar con Facebook
            </Button>
            <Button variant="outlined" size="$5">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=50&id=30840&format=png",
                }}
                width={25}
                height={25}
              />
              Continuar con Apple
            </Button>
          </YStack>

          <XStack gap="$2" alignItems="center" justifyContent="center">
            <Text className="text-textmuted text-center">
              ¿No tienes una cuenta?
            </Text>
            <Text
              onPress={() => router.push("/(auth)/sign-up")}
              color="$green8Light"
              pressStyle={{ textDecorationLine: "underline" }}
            >
              Regístrate
            </Text>
          </XStack>
        </YStack>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
