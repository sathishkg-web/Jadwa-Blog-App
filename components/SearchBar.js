// src/components/SearchBar.js
import React from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ searchText, setSearchText, isTablet, isTv
 }) => (
  <SearchBarContainer>
    <SearchInput
      placeholder={isTablet || isTv ? 'Search...' : 'Search...'}
      placeholderTextColor="#aaa"
      onChangeText={setSearchText}
      value={searchText}
    />
    <Ionicons name="search" size={18} color="#aaa" />
  </SearchBarContainer>
);

export default SearchBar;

const SearchBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  border-radius: 12px;
  padding: 5px;
  margin-horizontal: 12px;
  flex: 0.9;
`;

const SearchInput = styled.TextInput`
  margin-left: 4px;
  flex: 1;
  font-size: 14px;
  color: #333;
`;
