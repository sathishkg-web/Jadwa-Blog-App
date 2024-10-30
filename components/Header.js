// src/components/Header.js
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import ProfileButton from './ProfileButton';
import SearchBar from './SearchBar';
import styled from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select';

const Header = ({
  isTablet,
  isTv,
  searchText,
  setSearchText,
  selectedCategory,
  setSelectedCategory,
  iconRef,
  toggleDropdown,
}) => (
  <HeaderContainer>
    <LogoImage source={require('../assets/images/logo.png')} />
    {(isTablet || isTv) && (
        <PickerContainer>
    <RNPickerSelect
      onValueChange={setSelectedCategory}
      items={[
        { label: 'All', value: 'All' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Planning', value: 'Planning' },
        { label: 'Strategy', value: 'Strategy' },
        { label: 'Market', value: 'Market' },
      ]}
      value={selectedCategory}
      placeholder={{ label: 'Category', value: null }}
      useNativeAndroidPickerStyle={false}
      style={{
        inputIOS: { color: '#333', paddingVertical: 3.5, paddingHorizontal: 40, fontSize: 16, paddingLeft: 8, },
        inputAndroid: { color: '#333', paddingVertical: 3.5, paddingHorizontal: 40, fontSize: 16, paddingLeft: 8, },
        viewContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        iconContainer: {
          top: 8, // aligns the icon vertically in the middle
          right: 2,
          marginLeft: 40
        },
      }}
      Icon={() => <Ionicons name="chevron-down" size={18} color="#333" />}
    />
  </PickerContainer>
    )}
    <SearchBar searchText={searchText} setSearchText={setSearchText} />
    <ProfileButton ref={iconRef} onPress={toggleDropdown} />
  </HeaderContainer>
);

export default Header;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const LogoImage = styled.Image`
  width: 75px;
  height: 21px;
  resize-mode: contain;
`;

const CategoryPicker = styled(RNPickerSelect)``;

const PickerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 0 8px; /* Adds padding inside the container */
`;
