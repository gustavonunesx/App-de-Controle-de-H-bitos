import * as Notifications from "expo-notifications";

// ✅ Configuração básica que funciona no Expo Go
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false, // ✅ Desativado no Expo Go
    shouldSetBadge: false, // ✅ Desativado no Expo Go
  }),
});

export const scheduleNotification = async (
  title,
  body,
  hour = 20,
  minute = 0
) => {
  try {
    // ✅ No Expo Go, apenas mostra um log
    console.log(
      `📱 Notificação simulada: ${title} - ${body} às ${hour}:${minute}`
    );

    // ⚠️ Código comentado - não funciona no Expo Go
    /*
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
      },
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });
    */
  } catch (error) {
    console.log("❌ Notificações não disponíveis no Expo Go");
  }
};

export const checkAndScheduleNotifications = async () => {
  console.log("🔔 Sistema de notificações: Modo Expo Go (simulado)");

  // ✅ Apenas simula o agendamento
  await scheduleNotification(
    "📋 Controle de Hábitos",
    "Não se esqueça de marcar seus hábitos de hoje!",
    20,
    0
  );
};
