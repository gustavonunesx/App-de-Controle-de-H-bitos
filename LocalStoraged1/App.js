import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

// Screens
import HomeScreen from "./screens/HomeScreen";
import AddHabitScreen from "./screens/AddHabitScreen";
import EditHabitScreen from "./screens/EditHabitScreen";
import ProgressScreen from "./screens/ProgressScreen";
import TakePhotoScreen from "./screens/TakePhotoScreen";

// Utils
import { checkAndScheduleNotifications } from "./utils/notifications";

const Stack = createStackNavigator();

// ✅ Detectar se está em desenvolvimento
const isDevelopment = __DEV__;

export default function App() {
  useEffect(() => {
    if (!isDevelopment) {
      checkAndScheduleNotifications();
    } else {
      console.log("🔧 Modo desenvolvimento - Notificações desativadas");
    }
  }, []);

  // ✅ Desativar logs em produção
  if (!isDevelopment) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          // ✅ Opções que melhoram a performance
          animation: !isDevelopment ? "none" : "default",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Meus Hábitos" }}
        />
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ title: "Novo Hábito" }}
        />
        <Stack.Screen
          name="EditHabit"
          component={EditHabitScreen}
          options={{ title: "Editar Hábito" }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{ title: "Meu Progresso" }}
        />
        <Stack.Screen
          name="TakePhoto"
          component={TakePhotoScreen}
          options={{ title: "Tirar Foto" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
