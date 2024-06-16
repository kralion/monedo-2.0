import { ChevronDown, X } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
import { Button, Dialog, H3, ScrollView, Text, YStack } from "tamagui";

import { Accordion, Paragraph, Square } from "tamagui";

type TNotification = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function TermsPolicyModal({ openModal, setOpenModal }: TNotification) {
  const sections = [
    {
      id: 1,
      title: "Datos Personales",
      content:
        "En el marco de nuestra política de privacidad, llevamos a cabo una gestión meticulosa de tus datos personales. Nos comprometemos a resguardar su confidencialidad y seguridad en todo momento. Implementamos tecnologías y medidas de seguridad avanzadas para garantizar la integridad y protección de la información que nos confías.",
    },
    {
      id: 2,
      title: "Privacidad y Seguridad",
      content:
        "La privacidad de nuestros usuarios es una prioridad fundamental. Para asegurar un entorno seguro, hemos implementado protocolos de seguridad robustos. Nuestro compromiso es mantener un alto estándar de protección y confidencialidad en cada interacción que tengas con nuestra plataforma. Valoramos la confianza que depositas en nosotros y trabajamos incansablemente para preservarla.",
    },
    {
      id: 3,
      title: "Uso de Cookies",
      content:
        "Queremos informarte sobre nuestro uso de cookies. Estas pequeñas piezas de información nos permiten mejorar tu experiencia en nuestra plataforma. Puedes gestionar tus preferencias de cookies en cualquier momento desde la configuración de tu cuenta. A través de este mecanismo, personalizamos tu experiencia para proporcionarte un servicio más adaptado a tus necesidades y preferencias individuales.",
    },
    {
      id: 4,
      title: "Consentimiento Informado",
      content:
        "Consentimiento Informado: Al utilizar nuestros servicios, otorgas tu consentimiento informado para el procesamiento de datos de acuerdo con nuestras políticas de privacidad. Este consentimiento es esencial para proporcionarte nuestros servicios de manera eficaz y personalizada. Queremos asegurarnos de que estés plenamente informado sobre cómo utilizamos y protegemos tus datos personales.",
    },
    {
      id: 5,
      title: "Transparencia",
      content:
        "Nos comprometemos a operar con transparencia y responsabilidad en todas nuestras prácticas relacionadas con la privacidad y la seguridad de los datos. Buscamos crear un entorno en el que nuestros usuarios confíen plenamente en la forma en que manejamos su información. Estamos aquí para responder a tus preguntas y brindarte la información que necesitas para sentirte seguro y protegido al utilizar nuestros servicios.",
    },
  ];
  return (
    <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <Dialog modal open={openModal}>
        <Dialog.Trigger asChild>
          <Text
            color="$green8Light"
            pressStyle={{ textDecorationLine: "underline" }}
          >
            Terminos y Condiciones
          </Text>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="slow"
            opacity={0.7}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            width="90%"
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quicker",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{
              x: 0,
              y: -20,
              opacity: 0,
              scale: 0.9,
            }}
            exitStyle={{
              x: 0,
              y: 10,
              opacity: 0,
              scale: 0.95,
            }}
            gap="$4"
          >
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
                onPress={() => setOpenModal(false)}
              />
            </Dialog.Close>
            <YStack gap="$4">
              <H3 className="font-semibold text-xl">Términos y Condiciones</H3>
              <YStack gap="$4">
                <Text className="text-gray-500">
                  Bienvenido a la plataforma de la aplicación móvil de{" "}
                  <Text className="font-semibold text-black">
                    Expense Tracker SaaS
                  </Text>
                  . El objetivo de esta aplicación es facilitar el acceso a los
                  servicios de Expense Tracker y a la información relacionada
                  con los mismos, así como la realización de operaciones
                  relacionadas con la aplicación. El uso de esta aplicación se
                  rige por los términos y condiciones que se describen a
                  continuación, clasificados por secciones.
                </Text>
              </YStack>
            </YStack>

            <Accordion overflow="hidden" width="$20" type="multiple">
              <FlatList
                renderItem={({ item }) => (
                  <Accordion.Item value={item.id.toString()}>
                    <Accordion.Trigger
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      {({ open }: { open: boolean }) => (
                        <>
                          <Paragraph>{item.title}</Paragraph>

                          <Square
                            animation="quick"
                            rotate={open ? "180deg" : "0deg"}
                          >
                            <ChevronDown size="$1" />
                          </Square>
                        </>
                      )}
                    </Accordion.Trigger>

                    <Accordion.HeightAnimator animation="medium">
                      <Accordion.Content
                        animation="medium"
                        exitStyle={{ opacity: 0 }}
                      >
                        <Paragraph>{item.content}</Paragraph>
                      </Accordion.Content>
                    </Accordion.HeightAnimator>
                  </Accordion.Item>
                )}
                keyExtractor={(item) => item.id.toString()}
                data={sections}
              />
            </Accordion>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </ScrollView>
  );
}
