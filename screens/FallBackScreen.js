// src/screens/HomeScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Dimensions, Platform, Image } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FallBackScreen = () => {

  return (
    <FallbackContainer>
        <EmptyIcon source={require('../assets/images/management.png')} />
        <FallbackText>Update in Progress</FallbackText>
      </FallbackContainer>
  );
};

export default FallBackScreen;


// Fallback screen styles
const FallbackContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fb;
`;

const FallbackText = styled.Text`
  font-size: 20.5px;
  color: #6c63ff;
  font-weight: 500;
  margin-top: 16px;
`;

const EmptyIcon = styled.Image`
  width: 80px;
  height: 80px;
  tint-color: #6c63ff;
`;

