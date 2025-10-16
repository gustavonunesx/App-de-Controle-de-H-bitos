import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { Storage } from '../utils/storage';

export default function HabitCard({ habit, onToggle, onEdit, onDelete, onAddPhoto }) {
  const [progress, setProgress] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    loadProgress();
  }, [habit]);

  const loadProgress = async () => {
    const completions = await Storage.getCompletionsForHabit(habit.id);
    const completedCount = completions.filter(c => c.completed).length;
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weekCompletions = completions.filter(c => {
      const completionDate = new Date(c.date);
      return completionDate >= startOfWeek && c.completed;
    });
    
    setProgress(weekCompletions.length);
    calculateStreak(completions);
  };

  const calculateStreak = (completions) => {
    let streak = 0;
    const sortedCompletions = completions
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const today = new Date();
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completionDate = new Date(sortedCompletions[i].date);
      const diffTime = today - completionDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    setCurrentStreak(streak);
  };

  const handleAddPhoto = () => {
    Alert.alert(
      'Registro com Foto',
      'Deseja tirar uma foto para registrar este hábito?',
      [
        { 
          text: 'Tirar Foto', 
          onPress: () => {
            // ✅ CORREÇÃO: Chama a função diretamente sem parâmetros
            onAddPhoto();
          }
        },
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        }
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Text style={styles.actionText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Text style={styles.actionText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          Esta semana: {progress}/{habit.targetDays}
        </Text>
        <Text style={styles.streakText}>
          Sequência: {currentStreak} dias
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.photoButton}
          onPress={handleAddPhoto}
        >
          <Text style={styles.photoButtonText}>📷 Foto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={onToggle}
        >
          <Text style={styles.completeButtonText}>✅ Concluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 18,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  streakText: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  completeButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});