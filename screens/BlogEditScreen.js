// src/screens/BlogEditScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, ActivityIndicator, Dimensions, ToastAndroid, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { db, storage } from '../config/firebaseConfig.js';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import styled from 'styled-components/native';
import { useAuth } from '@clerk/clerk-expo';

const BlogEditScreen = ({ route, navigation }) => {
  const { blogId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [existingCoverImage, setExistingCoverImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { userId } = useAuth();
  const screenWidth = Dimensions.get('window').width;

  const categories = [
    { label: 'Technology', value: 'Technology' },
    { label: 'Health', value: 'Health' },
    { label: 'Market', value: 'Market' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Finance', value: 'Finance' },
  ];

  // Fetch the existing blog data on mount
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blogRef = doc(db, 'blogs', blogId);
        const blogSnapshot = await getDoc(blogRef);
        if (blogSnapshot.exists()) {
          const blogData = blogSnapshot.data();
          setTitle(blogData.title);
          setDescription(blogData.description);
          setContent(blogData.content);
          setCategory(blogData.category);
          setExistingCoverImage(blogData.coverImage); // Keep track of current cover image
        }
      } catch (error) {
        console.error('Failed to load blog data:', error);
      }
    };

    fetchBlogData();
  }, [blogId]);

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
    if (!coverImage) return existingCoverImage; // If no new image, use the existing one

    try {
      setUploading(true);
      // Delete the existing image from storage if a new one is uploaded
      if (existingCoverImage) {
        const existingImageRef = ref(storage, existingCoverImage);
        await deleteObject(existingImageRef);
      }

      const response = await fetch(coverImage.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `coverImages/${new Date().getTime()}`);
      const snapshot = await uploadBytes(storageRef, blob);
      setUploading(false);

      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploading(false);
      return existingCoverImage;
    }
  };

  const updateBlog = async () => {
    const uploadedImageUrl = await uploadImageToFirebase();

    if (!uploadedImageUrl) {
      alert('Image upload failed. Please try again.');
      return;
    }

    try {
      const blogRef = doc(db, 'blogs', blogId);
      await updateDoc(blogRef, {
        title,
        description,
        content,
        category,
        coverImage: uploadedImageUrl,
      });

      if (Platform.OS === 'android') {
        ToastAndroid.show('Blog updated successfully!', ToastAndroid.SHORT);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Failed to update blog:", error);
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
            source={{ uri: existingCoverImage }}
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

      <PublishButton onPress={updateBlog}>
        <PublishButtonText>Update Blog</PublishButtonText>
      </PublishButton>
    </View>
  );
};

export default BlogEditScreen;

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
