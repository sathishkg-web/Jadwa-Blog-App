// src/navigation/BottomTabs.js
import React, {useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import SidebarNavigation from './sidebarNavigation';
import { Dimensions,  ToastAndroid } from 'react-native';
import BlogCreateScreen from '../screens/BlogCreateScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';
import FallBackScreen from '../screens/FallBackScreen';
import BlogEditScreen from '../screens/BlogEditScreen';
import { doc, getDoc, setDoc, updateDoc,onSnapshot,Timestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import {useAuth, useUser } from '@clerk/clerk-expo';
import HomeNavigation from './HomeNavigation';


const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');
const isTablet = width > 768 && width < 1024;
const isTv = width >= 1024;

const BottomTabs = () => {
  const { user } = useUser();
  // To create user while signup for first time    
useEffect(() => {
  console.log('triggered');
  if (user) {
    storeUserData();
  }
}, [user]);

const storeUserData = async () => {
  if (!user) return;

  try {
    const userDocRef = doc(db, 'Blog_users', user.id);
    console.log('triggered');
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      ToastAndroid.show(`Welcome Back ${data?.username}`, ToastAndroid.SHORT);

    } else {
      // If the document doesn't exist, create it with default values from Clerk
      const newUser = {
        username: user.username || user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
      };

      // Create the document with the new user data
      await setDoc(userDocRef, newUser);
      ToastAndroid.show(`Welcome ${newUser.username}`, ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error('Error fetching user data: ', error);
    console.log('userId ERR:', userId);
  }
};

  if (isTablet || isTv) {
    return <SidebarNavigation />;  // Render the sidebar on tablet/TV
  }

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeNavigation}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={BlogCreateScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="create" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={FallBackScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Read"
        component={BlogDetailScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
