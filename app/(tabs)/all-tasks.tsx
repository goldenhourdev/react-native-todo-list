import dayjs from 'dayjs';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTasks } from '../tasks-context';

export default function AllTasksScreen() {
  const { tasks } = useTasks();

  const renderCategory = (category: 'Urgent' | 'General') => {
    const filtered = tasks.filter((t) => t.category === category);
    return (
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{category} Tasks</Text>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>No {category.toLowerCase()} tasks.</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskRow}>
                <Text style={styles.taskText}>{item.text}</Text>
                <Text style={styles.dueDate}>Due: {dayjs(item.dueDate).format('DD MMM YYYY')}</Text>
              </View>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCategory('Urgent')}
      {renderCategory('General')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  categorySection: {
    marginBottom: 30,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 10,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4e8cff',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    fontSize: 18,
    color: '#222',
  },
  dueDate: {
    fontSize: 16,
    color: '#888',
    marginLeft: 10,
  },
  empty: {
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
});
