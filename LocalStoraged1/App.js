import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Screens - CORRIGIDO OS CAMINHOS
import HomeScreen from './screens/HomeScreen';
import AddHabitScreen from './screens/AddHabitScreen';
import EditHabitScreen from './screens/EditHabitScreen';
import ProgressScreen from './screens/ProgressScreen';

// Utils
import { checkAndScheduleNotifications } from './utils/notifications';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    checkAndScheduleNotifications();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Meus Hábitos' }}
        />
        <Stack.Screen 
          name="AddHabit" 
          component={AddHabitScreen}
          options={{ title: 'Novo Hábito' }}
        />
        <Stack.Screen 
          name="EditHabit" 
          component={EditHabitScreen}
          options={{ title: 'Editar Hábito' }}
        />
        <Stack.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{ title: 'Meu Progresso' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}