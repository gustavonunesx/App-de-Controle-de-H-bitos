import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import { Storage } from '../utils/storage';
import { globalStyles } from '../styles/globalStyles';

export default function AddHabitScreen({ navigation }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [targetDays, setTargetDays] = useState('7');
  const [notificationTime, setNotificationTime] = useState('20:00');

  const frequencies = [
    { id: 'daily', label: 'Todos os dias' },
    { id: 'weekly', label: 'Vezes por semana' },
    { id: 'monthly', label: 'Vezes por mês' }
  ];

  const saveHabit = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, digite um nome para o hábito');
      return;
    }

    const habit = {
      id: Date.now().toString(),
      name: name.trim(),
      frequency,
      targetDays: frequency === 'daily' ? 7 : parseInt(targetDays),
      notificationTime,
      createdAt: new Date().toISOString(),
      completed: false,
      completions: []
    };

    const success = await Storage.saveHabit(habit);
    
    if (success) {
      Alert.alert('Sucesso', 'Hábito criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível salvar o hábito');
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Hábito</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Beber água, Exercícios, Meditar"
          maxLength={50}
        />

        <Text style={styles.label}>Frequência</Text>
        <View style={styles.frequencyContainer}>
          {frequencies.map((freq) => (
            <TouchableOpacity
              key={freq.id}
              style={[
                styles.frequencyButton,
                frequency === freq.id && styles.selectedFrequency
              ]}
              onPress={() => setFrequency(freq.id)}
            >
              <Text style={[
                styles.frequencyText,
                frequency === freq.id && styles.selectedFrequencyText
              ]}>
                {freq.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {frequency !== 'daily' && (
          <>
            <Text style={styles.label}>
              Quantas vezes por {frequency === 'weekly' ? 'semana' : 'mês'}?
            </Text>
            <TextInput
              style={styles.input}
              value={targetDays}
              onChangeText={setTargetDays}
              keyboardType="numeric"
              placeholder={frequency === 'weekly' ? 'Ex: 3' : 'Ex: 15'}
              maxLength={2}
            />
          </>
        )}

        <Text style={styles.label}>Horário do Lembrete (opcional)</Text>
        <TextInput
          style={styles.input}
          value={notificationTime}
          onChangeText={setNotificationTime}
          placeholder="HH:MM"
          maxLength={5}
        />

        <TouchableOpacity style={globalStyles.primaryButton} onPress={saveHabit}>
          <Text style={globalStyles.primaryButtonText}>Salvar Hábito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  frequencyButton: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  selectedFrequency: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  frequencyText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedFrequencyText: {
    color: '#fff',
  },
});