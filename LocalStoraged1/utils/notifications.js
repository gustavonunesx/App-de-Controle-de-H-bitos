import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const scheduleNotification = async (title, body, hour = 20, minute = 0) => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') return;
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
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

export const checkAndScheduleNotifications = async () => {
  // Notificação diária geral
  await scheduleNotification(
    '📋 Controle de Hábitos',
    'Não se esqueça de marcar seus hábitos de hoje!',
    20, 0 // 20:00
  );
};