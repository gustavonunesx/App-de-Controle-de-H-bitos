import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  // Carregar dados salvos ao iniciar o app
  useEffect(() => {
    const loadData = async () => {
      try {
        const value = await AsyncStorage.getItem("@my_items");
        if (value !== null) {
          setItems(JSON.parse(value));
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar os dados");
      }
    };
    loadData();
  }, []);

  // Adicionar item
  const addItem = async () => {
    if (text.trim() === "") return;
    const newItems = [...items, text.trim()];
    try {
      await AsyncStorage.setItem("@my_items", JSON.stringify(newItems));
      setItems(newItems);
      setText("");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o item");
    }
  };

  // Limpar todos os itens
  const clearItems = async () => {
    try {
      await AsyncStorage.removeItem("@my_items");
      setItems([]);
      setText("");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível limpar os dados");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista Persistente</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite um item..."
        value={text}
        onChangeText={setText}
      />

      <View style={styles.buttons}>
        <Button title="Adicionar" onPress={addItem} />
        <Button title="Limpar" onPress={clearItems} color="red" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
