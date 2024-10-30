// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {  StatusBar } from 'react-native';
import BottomTabs from './navigations/BottomTabs';
import LoginScreen from './screens/LoginScreen';
import {
  ClerkProvider,
  ClerkLoaded,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from '@clerk/clerk-expo';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config/firebaseConfig';

export default function App() {
  return (
    <ClerkProvider publishableKey="pk_test_dGVuZGVyLWxsYW1hLTQwLmNsZXJrLmFjY291bnRzLmRldiQ">
      <ClerkLoaded>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar
              backgroundColor="white" // Set the status bar background color
              barStyle="dark-content" // Change the text color of the status bar
              translucent={false}
              style="auto"
            />
            <SignedIn>
              <SafeAreaView style={{ flex: 1 }}>
                <BottomTabs />
              </SafeAreaView>
            </SignedIn>
            <SignedOut>
              <SafeAreaView style={{ flex: 1 }}>
                <LoginScreen />
              </SafeAreaView>
            </SignedOut>
          </NavigationContainer>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
