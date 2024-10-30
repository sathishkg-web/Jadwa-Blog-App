import React, { useState } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, ActivityIndicator, Dimensions, ToastAndroid, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { db, storage } from '../config/firebaseConfig.js';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, setDoc, doc, Timestamp } from 'firebase/firestore';
import Header from '../components/Header.js';
import styled from 'styled-components/native';
import { useAuth, useUser } from '@clerk/clerk-expo';

const BlogCreateScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const { user } = useUser();
  const { userId } = useAuth();
  console.log(userId);
  const screenWidth = Dimensions.get('window').width;

  const categories = [
    { label: 'Technology', value: 'Technology' },
    { label: 'Health', value: 'Health' },
    { label: 'Market', value: 'Market' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Finance', value: 'Finance' },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0]);
    }
  };

  const uploadImageToFirebase = async () => {
    if (!coverImage) return null;

    try {
      setUploading(true);
      const response = await fetch(coverImage.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `coverImages/${new Date().getTime()}`);
      const snapshot = await uploadBytes(storageRef, blob);
      setUploading(false);

      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploading(false);
      return null;
    }
  };

  const saveBlog = async () => {
    const uploadedImageUrl = await uploadImageToFirebase();

    if (!uploadedImageUrl) {
      alert('Image upload failed. Please try again.');
      return;
    }

    try {
      const blogRef = doc(collection(db, 'blogs'));
      await setDoc(blogRef, {
        title,
        description,
        content,
        category,
        coverImage: uploadedImageUrl,
        createdAt: Timestamp.now(),
        user_id: userId,
      });

      // Clear all input fields after successful save
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('');
      setCoverImage(null);

      // Show Android toast message on successful save
      if (Platform.OS === 'android') {
        ToastAndroid.show('Blog published successfully!', ToastAndroid.SHORT);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Failed to save blog:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, alignItems: 'center' }}>
      {/* Cover Image Placeholder */}
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 16 }}>
        {coverImage ? (
          <Image
            source={{ uri: coverImage.uri }}
            style={{
              width: screenWidth * 0.9,
              height: 150,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              resizeMode: 'cover',
            }}
          />
        ) : (
          <Image
            source={require('../assets/images/placeholder.png')}
            style={{
              width: screenWidth * 0.9,
              height: 150,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              resizeMode: 'cover',
            }}
          />
        )}
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="large" color="#6c63ff" />}

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ width: '100%', marginBottom: 12, borderBottomWidth: 1, padding: 8, fontWeight: 'bold', fontSize: 16 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ width: '100%', marginBottom: 12, borderBottomWidth: 1, padding: 8 }}
      />

      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={categories}
        placeholder={{ label: "Select Category", value: null }}
        value={category}
        style={{
          inputIOS: {
            width: '100%',
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            color: 'black',
            marginBottom: 12,
          },
          inputAndroid: {
            width: '100%',
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            color: 'black',
            marginBottom: 12,
          },
        }}
      />

      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={{ width: '100%', height: 200, borderWidth: 1, padding: 8, textAlignVertical: 'top' }}
        multiline
      />

      <PublishButton onPress={saveBlog}>
        <PublishButtonText>Publish</PublishButtonText>
      </PublishButton>
    </View>
  );
};

export default BlogCreateScreen;

const PublishButton = styled.TouchableOpacity`
  background-color: #6c63ff;
  padding: 8px 16px;
  border-radius: 8px;
  margin: 16px;
`;

const PublishButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
