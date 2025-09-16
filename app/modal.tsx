import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
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
        <View style={[styles.inputWrapper, isDark && styles.inputWrapperDark]}>
          <MaterialIcons name="edit" size={22} color={isDark ? '#e0e0e0' : '#222'} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Add a new task"
            placeholderTextColor={isDark ? '#aaa' : '#888'}
            value={input}
            onChangeText={setInput}
          />
        </View>
        <TouchableOpacity
          style={[styles.addBtn, isDark && styles.addBtnDark, !input.trim() && styles.addBtnDisabled]}
          onPress={handleAddTask}
          disabled={!input.trim()}
          activeOpacity={input.trim() ? 0.7 : 1}
        >
          <MaterialIcons name="add-circle" size={32} color={input.trim() ? (isDark ? '#4e8cff' : '#0a7ea4') : '#b3c7e6'} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputRow}>
        <TouchableOpacity style={[styles.dateBtn, isDark && styles.dateBtnDark]} onPress={() => setShowDatePicker(true)}>
          <MaterialIcons name="event" size={20} color={isDark ? '#e0e0e0' : '#222'} />
          <Text style={styles.dateText}>Due: {dayjs(dueDate).format('DD MMM YYYY')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('URGENT')} style={[styles.catBtn, category === 'URGENT' && styles.catBtnActive]}>
          <MaterialIcons name="priority-high" size={20} color={category === 'URGENT' ? '#fff' : '#d32f2f'} />
          <Text style={[styles.catText, category === 'URGENT' && styles.catTextActive]}>Urgent</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('GENERAL')} style={[styles.catBtn, category === 'GENERAL' && styles.catBtnActive]}>
          <MaterialIcons name="label" size={20} color={category === 'GENERAL' ? '#fff' : '#388e3c'} />
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
      <View style={styles.listContainer}>
        <FlatList
          data={sortedTasks}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.todoRow, isDark && styles.todoRowDark, completed.includes(index) && styles.todoRowCompleted]}>
              <TouchableOpacity style={styles.completeBtn} onPress={() => handleToggleComplete(index)}>
                <MaterialIcons name={completed.includes(index) ? 'check-circle' : 'radio-button-unchecked'} size={24} color={completed.includes(index) ? '#4e8cff' : '#bbb'} />
              </TouchableOpacity>
              <View style={styles.todoInfo}>
                <Text style={[styles.todoText, isDark && styles.todoTextDark, completed.includes(index) && styles.completedText]}>
                  {item.text}
                  {completed.includes(index) && <Text style={styles.completedLabel}> (Completed)</Text>}
                </Text>
                <View style={styles.todoMeta}>
                  <MaterialIcons name="event" size={16} color="#888" />
                  <Text style={styles.dueDate}>Due: {dayjs(item.dueDate).format('DD MMM YYYY')}</Text>
                  <MaterialIcons name={item.category === 'Urgent' ? 'priority-high' : 'label'} size={16} color={item.category === 'Urgent' ? '#d32f2f' : '#388e3c'} />
                  <Text style={item.category === 'Urgent' ? styles.urgent : styles.general}>{item.category}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeTask(index)}>
                <MaterialIcons name="delete" size={24} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={[styles.empty, isDark && styles.emptyDark]}>No tasks yet.</Text>}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#f5f8fd', // Soft blue background
  },
  containerDark: {
    backgroundColor: '#181c24', // Deep dark blue
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 28,
    color: '#0a7ea4', // Main accent blue
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  titleDark: {
    color: '#4e8cff', // Accent blue for dark mode
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf2fb', // Light blue
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b3c7e6',
    paddingHorizontal: 12,
    flex: 1,
  },
  inputWrapperDark: {
    backgroundColor: '#232a36',
    borderColor: '#3a4a62',
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    color: '#222',
    fontSize: 17,
    fontFamily: 'System',
  },
  inputDark: {
    color: '#e0e0e0',
  },
  addBtn: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Button background is white
    borderRadius: 50,
    padding: 6,
    borderWidth: 2,
    borderColor: '#0a7ea4', // Blue border for visibility
    shadowColor: '#0a7ea4',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  addBtnDark: {
    backgroundColor: '#fff', // White background for dark mode too
    borderColor: '#4e8cff', // Blue border for dark mode
  },
  addBtnDisabled: {
    opacity: 0.5,
    borderColor: '#b3c7e6', // Faded border for disabled
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf2fb',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  dateBtnDark: {
    backgroundColor: '#232a36',
  },
  dateText: {
    marginLeft: 8,
    color: '#0a7ea4',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf2fb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#b3c7e6',
  },
  catBtnActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  catText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'System',
  },
  catTextActive: {
    color: '#fff',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaf2fb',
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#0a7ea4',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  todoRowDark: {
    backgroundColor: '#232a36',
    borderBottomColor: '#3a4a62',
  },
  todoRowCompleted: {
    opacity: 0.6,
    backgroundColor: '#eaf2fb',
  },
  completeBtn: {
    marginRight: 8,
  },
  todoInfo: {
    flex: 1,
  },
  todoText: {
    fontSize: 18,
    color: '#222',
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  todoTextDark: {
    color: '#e0e0e0',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontFamily: 'System',
  },
  completedLabel: {
    color: '#4e8cff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  removeBtn: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#ffeaea',
  },
  remove: {
    display: 'none', // Hide old remove button
  },
  removeDark: {
    display: 'none',
  },
  empty: {
    color: '#4e8cff',
    fontStyle: 'italic',
    marginTop: 28,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'System',
  },
  emptyDark: {
    color: '#b3c7e6',
  },
  dueDate: {
    fontSize: 13,
    color: '#0a7ea4',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  urgent: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'System',
  },
  general: {
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'System',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
});
