import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput('');
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Todo List</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Add a new task"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={input}
          onChangeText={setInput}
        />
        <Button title="Add" onPress={addTodo} color={isDark ? '#4e8cff' : undefined} />
      </View>
      <FlatList
        data={todos}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.todoRow, isDark && styles.todoRowDark]}>
            <Text style={[styles.todoText, isDark && styles.todoTextDark]}>{item}</Text>
            <TouchableOpacity onPress={() => removeTodo(index)}>
              <Text style={[styles.remove, isDark && styles.removeDark]}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.empty, isDark && styles.emptyDark]}>No tasks yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#181818',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  titleDark: {
    color: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: 200,
    marginRight: 10,
    backgroundColor: '#f7f7f7',
    color: '#222',
  },
  inputDark: {
    borderColor: '#444',
    backgroundColor: '#222',
    color: '#e0e0e0',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: 320,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    marginBottom: 8,
  },
  todoRowDark: {
    backgroundColor: '#232323',
    borderBottomColor: '#333',
  },
  todoText: {
    fontSize: 18,
    color: '#222',
  },
  todoTextDark: {
    color: '#e0e0e0',
  },
  remove: {
    color: 'red',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#ffeaea',
  },
  removeDark: {
    backgroundColor: '#3a1a1a',
    color: '#ff6b6b',
  },
  empty: {
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
  emptyDark: {
    color: '#aaa',
  },
});
