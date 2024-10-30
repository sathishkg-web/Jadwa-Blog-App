// src/navigation/SidebarNavigation.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import { Dimensions } from 'react-native';
import BlogCreateScreen from '../screens/BlogCreateScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';
import FallBackScreen from '../screens/FallBackScreen';

const { width } = Dimensions.get('window');
const isTablet = width > 768 && width < 1024;
const isTv = width >= 1024;

const SidebarNavigation = ({ navigation }) => {
  const menuItems = [
    { name: 'Home', icon: 'home', component: HomeScreen },
    { name: 'Create Blog', icon: 'book', component: BlogCreateScreen },
    { name: 'Setting', icon: 'settings', component: FallBackScreen },
    { name: 'Read Blog', icon: 'book', component: BlogDetailScreen },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.component)}
          >
            <Ionicons name={item.icon} size={24} color="#333" />
            {isTv?
            (<Text style={styles.menuText}>{item.name}</Text>): null
            }
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.mainContent}>
        <HomeScreen /> {/* This will be the main content area */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: isTv ? '20%' : '10%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fb',
  },
  mainContentText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default SidebarNavigation;
