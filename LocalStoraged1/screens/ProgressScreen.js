import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function ProgressScreen() {
  return (
    <View style={globalStyles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meu Progresso</Text>
        <Text style={styles.subtitle}>
          Funcionalidade em desenvolvimento
        </Text>
        <Text style={styles.description}>
          Em breve você poderá ver gráficos e estatísticas detalhadas do seu progresso!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});