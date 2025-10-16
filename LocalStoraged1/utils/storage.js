import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';
const COMPLETIONS_KEY = '@completions';

export const Storage = {
  // Hábitos
  async saveHabit(habit) {
    try {
      const habits = await this.getHabits();
      const existingIndex = habits.findIndex(h => h.id === habit.id);
      
      if (existingIndex >= 0) {
        habits[existingIndex] = habit;
      } else {
        habits.push(habit);
      }
      
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
      return true;
    } catch (error) {
      console.error('Error saving habit:', error);
      return false;
    }
  },

  async getHabits() {
    try {
      const habits = await AsyncStorage.getItem(HABITS_KEY);
      return habits ? JSON.parse(habits) : [];
    } catch (error) {
      console.error('Error getting habits:', error);
      return [];
    }
  },

  async deleteHabit(habitId) {
    try {
      const habits = await this.getHabits();
      const filteredHabits = habits.filter(h => h.id !== habitId);
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(filteredHabits));
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      return false;
    }
  },

  // Registros de conclusão
  async saveCompletion(completion) {
    try {
      const completions = await this.getCompletions();
      const dateKey = completion.date;
      
      const existingDateIndex = completions.findIndex(c => c.date === dateKey);
      
      if (existingDateIndex >= 0) {
        const habitIndex = completions[existingDateIndex].habits.findIndex(
          h => h.habitId === completion.habitId
        );
        
        if (habitIndex >= 0) {
          completions[existingDateIndex].habits[habitIndex] = completion;
        } else {
          completions[existingDateIndex].habits.push(completion);
        }
      } else {
        completions.push({
          date: dateKey,
          habits: [completion]
        });
      }
      
      await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
      return true;
    } catch (error) {
      console.error('Error saving completion:', error);
      return false;
    }
  },

  async getCompletions() {
    try {
      const completions = await AsyncStorage.getItem(COMPLETIONS_KEY);
      return completions ? JSON.parse(completions) : [];
    } catch (error) {
      console.error('Error getting completions:', error);
      return [];
    }
  },

  async getCompletionsForHabit(habitId) {
    try {
      const completions = await this.getCompletions();
      const habitCompletions = [];
      
      completions.forEach(day => {
        const habitCompletion = day.habits.find(h => h.habitId === habitId);
        if (habitCompletion) {
          habitCompletions.push(habitCompletion);
        }
      });
      
      return habitCompletions;
    } catch (error) {
      console.error('Error getting habit completions:', error);
      return [];
    }
  }
};