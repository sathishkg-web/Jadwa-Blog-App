import React, { useState } from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import { TouchableOpacity, Modal, View, Button, Platform, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';

const BlogCard = ({ blog, columnCount, userId }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  // Check if the current user is the author
  const isAuthor = blog.user_id === userId;

  const handleLongPress = () => {
    if (isAuthor) {
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate('Edit Blog', { blogId: blog.id });
  };

  const handleDelete = async () => {
    setModalVisible(false);
  
    try {
      // Reference to the blog document
      const blogRef = doc(db, 'blogs', blog.id);
  
      // Delete blog document from Firestore
      await deleteDoc(blogRef);
  
      // If the blog has a cover image, delete it from Firebase Storage
      if (blog.coverImage) {
        const imageRef = ref(storage, blog.coverImage);
        await deleteObject(imageRef);
      }
  
      // Show a toast notification for successful deletion (Android only)
      if (Platform.OS === 'android') {
        ToastAndroid.show('Blog deleted successfully!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
      // Optional: Show error message (Android only)
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to delete blog. Please try again.', ToastAndroid.SHORT);
      }
    }
  };

  return (
    <CardContainer columnCount={columnCount}>
      <TouchableOpacity
        style={{ width: '100%' }}
        onPress={() => navigation.navigate('Read', { blogId: blog.id })}
        onLongPress={handleLongPress}
      >
        <BlogImage
          source={blog.img}
          onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
        />
        <BlogCardTitle>{blog.title}</BlogCardTitle>
        <BlogDesc numberOfLines={3}>{blog.description}</BlogDesc>
        <BlogDate>{moment(blog.createdAt.toDate()).format('DD MMM YYYY')}</BlogDate>
      </TouchableOpacity>

      {/* Modal for Long Press Options */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <ModalContainer>
          <ButtonContainer>
            <ModalButton onPress={handleEdit}>
              <ButtonText>Edit Blog</ButtonText>
            </ModalButton>
            <ModalButton onPress={handleDelete}>
              <ButtonText>Delete Blog</ButtonText>
            </ModalButton>
            <ModalButton onPress={closeModal}>
              <ButtonText>Cancel</ButtonText>
            </ModalButton>
          </ButtonContainer>
        </ModalContainer>
      </Modal>
    </CardContainer>
  );
};

export default BlogCard;

const CardContainer = styled.View`
  width: ${({ columnCount }) => `${100 / columnCount - 2.5}%`};
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 4px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 3;
`;

const BlogImage = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #ccc;
`;

const BlogCardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const BlogDate = styled.Text`
  font-size: 12px;
  color: #a1a1a1;
  margin-bottom: 8px;
`;

const BlogDesc = styled.Text`
  font-size: 14px;
  color: #4a4a4a;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ButtonContainer = styled.View`
  background-color: #fff;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  align-items: center;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: #6c63ff;
  padding: 12px 24px;
  margin-vertical: 6px;
  width: 80%;
  align-items: center;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
