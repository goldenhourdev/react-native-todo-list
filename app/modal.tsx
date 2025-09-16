import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useTasks } from './tasks-context';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { addTask, removeTask, tasks } = useTasks();
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<'URGENT' | 'GENERAL'>('GENERAL');
  const [completed, setCompleted] = useState<number[]>([]);

  const handleAddTask = () => {
    if (input.trim()) {
      addTask({ text: input.trim(), dueDate, category: category === 'URGENT' ? 'Urgent' : 'General' });
      setInput('');
      setDueDate(new Date());
      setCategory('GENERAL');
    }
  };

  const handleToggleComplete = (index: number) => {
    setCompleted((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Sort tasks by due date ascending
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

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
        <Button title="Add" onPress={handleAddTask} color={isDark ? '#4e8cff' : undefined} />
      </View>
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.dateBtn, isDark && styles.dateBtnDark]}>Due: {dayjs(dueDate).format('DD MMM YYYY')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('URGENT')} style={[styles.catBtn, category === 'URGENT' && styles.catBtnActive]}>
          <Text style={[styles.catText, category === 'URGENT' && styles.catTextActive]}>Urgent</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('GENERAL')} style={[styles.catBtn, category === 'GENERAL' && styles.catBtnActive]}>
          <Text style={[styles.catText, category === 'GENERAL' && styles.catTextActive]}>General</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_event: unknown, date?: Date) => {
            setShowDatePicker(false);
            if (date) setDueDate(date);
          }}
        />
      )}
      <FlatList
        data={sortedTasks}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.todoRow, isDark && styles.todoRowDark]}>
            <TouchableOpacity onPress={() => handleToggleComplete(index)}>
              <Text style={[styles.todoText, isDark && styles.todoTextDark, completed.includes(index) && styles.completedText]}>
                {item.text}
                {completed.includes(index) && <Text style={styles.completedLabel}> (Completed)</Text>}
              </Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.dueDate}>Due: {dayjs(item.dueDate).format('DD MMM YYYY')}</Text>
              <Text style={item.category === 'Urgent' ? styles.urgent : styles.general}>{item.category}</Text>
            </View>
            <TouchableOpacity onPress={() => removeTask(index)}>
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
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  completedLabel: {
    color: '#4e8cff',
    fontSize: 14,
    fontWeight: 'bold',
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
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryBtn: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#f7f7f7',
  },
  categoryBtnDark: {
    borderColor: '#444',
    backgroundColor: '#222',
  },
  selectedCategory: {
    borderColor: '#4e8cff',
    backgroundColor: '#e6f0ff',
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#222',
  },
  categoryTextDark: {
    color: '#e0e0e0',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateBtn: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
    color: '#222',
  },
  dateBtnDark: {
    backgroundColor: '#333',
    color: '#e0e0e0',
  },
  catBtn: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    marginRight: 5,
  },
  catBtnActive: {
    backgroundColor: '#4e8cff',
  },
  catText: {
    color: '#222',
    fontWeight: 'bold',
  },
  catTextActive: {
    color: '#fff',
  },
  dueDate: {
    fontSize: 12,
    color: '#888',
  },
  urgent: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 13,
  },
  general: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
