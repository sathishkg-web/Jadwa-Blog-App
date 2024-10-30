// src/components/ProfileButton.js
import React from 'react';
import styled from 'styled-components/native';

const ProfileButton = React.forwardRef(({ onPress }, ref) => (
  <ButtonContainer ref={ref} onPress={onPress}>
    <ProfileImage source={require('../assets/images/profile-icon.png')} />
  </ButtonContainer>
));

export default ProfileButton;

const ButtonContainer = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
`;

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 18px;
`;
