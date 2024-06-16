import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  H2,
  Input,
  ScrollView,
  Separator,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { Text as T2 } from "react-native";

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
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  // const toast = useToast();
  async function signInWithEmail(data: FormData) {
    setLoading(true);
    Alert.alert("Sign In...");
    // const { error } = await supabase.auth.signInWithPassword({
    //   email: data.email,
    //   password: data.password,
    // });
    // if (error) {
    //   toast.show({
    //     render: () => (
    //       <Alert variant="solid" rounded={10} px={5} status="error">
    //         <HStack space={2} alignItems="center">
    //           <Alert.Icon mt="1" />
    //           <Text className="text-white">Credenciales inválidas</Text>
    //         </HStack>
    //       </Alert>
    //     ),
    //     description: "",
    //     duration: 2000,
    //     placement: "top",
    //     variant: "solid",
    //   });
    // } else {
    //   router.push("/(tabs)/");
    // }
    // setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <YStack gap="$10">
            <YStack gap="$1">
              <H2>Inicio de Sesión</H2>
              <Text>Disfruta las bondades de Expense Tracker</Text>
            </YStack>
            <YStack gap="$4">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
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
                )}
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
                defaultValue=""
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    py={3}
                    placeholder="Contraseña"
                    secureTextEntry
                    size="$5"
                    onChangeText={onChange}
                    passwordRules={
                      "required: upper; required: lower; required: digit; minlength: 8;"
                    }
                  />
                )}
                name="password"
                rules={{ required: true }}
              />

              <Button
                onPress={handleSubmit((data) => {
                  signInWithEmail(data);
                })}
                size="$5"
                bg="$green8Light"
                color="$white1"
              >
                Ingresar
              </Button>

              <XStack gap="$2" alignItems="center">
                <Separator flex={1} />
                <Text>o</Text>
                <Separator flex={1} />
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
