// src/components/DropdownMenu.js
import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ClerkProvider, ClerkLoaded, SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';

const DropdownMenu = ({dropdownPosition, closeDropdown }) => {
  const navigation = useNavigation();
  const { isLoaded, signOut } = useAuth();
  
  return(
  <DropdownContainer dropdownPosition={dropdownPosition}>
    <DropdownItem onPress={() =>{ closeDropdown();navigation.navigate('Setting')}}>
      <Ionicons name="settings" size={20} color="#393d3d" />
      <DropdownText>Settings</DropdownText>
    </DropdownItem>
    <DropdownItem onPress={() => signOut()}>
      <MaterialIcons name="logout" size={20} color="#393d3d" />
      <DropdownText>Logout</DropdownText>
    </DropdownItem>
  </DropdownContainer>
  );
}

export default DropdownMenu;

const DropdownContainer = styled.View`
  position: absolute;
  top: ${({ dropdownPosition }) => dropdownPosition.y}px;
  left: ${({ dropdownPosition }) => dropdownPosition.x}px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  z-index: 1;
  width: 145px;
`;

const DropdownItem = styled.TouchableOpacity`
  padding: 10px 15px;
  flex-direction: row;
  align-items: center;
`;

const DropdownText = styled.Text`
  color: black;
  margin-left: 8px;
`;
