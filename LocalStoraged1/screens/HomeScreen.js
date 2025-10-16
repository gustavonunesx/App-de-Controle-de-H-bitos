import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Storage } from '../utils/storage';
import HabitCard from '../components/HabitCard';
import { globalStyles } from '../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const savedHabits = await Storage.getHabits();
    setHabits(savedHabits);
  };

  const toggleHabitCompletion = async (habitId, date = new Date().toISOString().split('T')[0]) => {
    const completions = await Storage.getCompletions();
    const todayCompletions = completions.find(c => c.date === date);
    const existingCompletion = todayCompletions?.habits.find(h => h.habitId === habitId);

    const completion = {
      habitId,
      date,
      completed: !existingCompletion?.completed,
      completedAt: new Date().toISOString(),
      photo: existingCompletion?.photo
    };

    await Storage.saveCompletion(completion);
    loadHabits();
  };

  const deleteHabit = (habitId) => {
    Alert.alert(
      'Excluir Hábito',
      'Tem certeza que deseja excluir este hábito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await Storage.deleteHabit(habitId);
            loadHabits();
          }
        }
      ]
    );
  };

  const filteredHabits = habits.filter(habit => {
    if (filter === 'active') return !habit.completed;
    if (filter === 'completed') return habit.completed;
    return true;
  });

  const getTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const completions = habits.flatMap(habit => 
      habit.completions?.filter(c => c.date === today && c.completed) || []
    );
    return completions.length;
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Hábitos</Text>
        <Text style={styles.subtitle}>
          Progresso de hoje: {getTodayProgress()}/{habits.length}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.activeFilter]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.activeFilterText]}>
            Ativos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
            Concluídos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggle={() => toggleHabitCompletion(item.id)}
            onEdit={() => navigation.navigate('EditHabit', { habit: item })}
            onDelete={() => deleteHabit(item.id)}
            onAddPhoto={() => Alert.alert('Foto', 'Funcionalidade de foto em desenvolvimento')}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum hábito cadastrado ainda!
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={globalStyles.fab}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Text style={globalStyles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});