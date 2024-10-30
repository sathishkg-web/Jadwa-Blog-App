import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import moment from 'moment';

const BlogDetailScreen = () => {
  const route = useRoute();
  const { blogId } = route.params || {};  // Ensure blogId is handled safely
  const [blogData, setBlogData] = useState(null);
  const [author, setAuthor] = useState('Anonymous User'); // Default author name

  useEffect(() => {
    if (blogId) {
      const fetchBlogData = async () => {
        try {
          const docRef = doc(db, 'blogs', blogId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const blog = docSnap.data();
            setBlogData(blog);

            // Fetch the author's data using the user_id
            const userRef = doc(db, 'users', blog.user_id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setAuthor(userData.username || 'Anonymous User'); // Set author’s name if it exists
            } else {
              console.log('No user document found for this blog.');
            }
          } else {
            console.log('No blog document found!');
          }
        } catch (error) {
          console.error('Error fetching blog details:', error);
        }
      };

      fetchBlogData();
    }
  }, [blogId]);

  // Render fallback screen if blogId is missing
  if (!blogId) {
    return (
      <FallbackContainer>
        <EmptyIcon source={require('../assets/images/technology.png')} />
        <FallbackText>No recent reads</FallbackText>
      </FallbackContainer>
    );
  }

  if (!blogData) return <Text>Loading...</Text>;

  return (
    <Container>
      {/* Cover Image */}
      <CoverImage source={{ uri: blogData.coverImage }} />

      {/* Header with Profile, Author Name, and Date */}
      <HeaderRow>
        <ProfileImage source={require('../assets/images/profile-icon.png')} />
        <StatsContainer>
          <Text style={{ fontWeight: 'bold' }}>{author}</Text>
          <Text>Author</Text>
        </StatsContainer>
        <DateText>{moment(blogData.createdAt.toDate()).format('DD MMM YYYY')}</DateText>
      </HeaderRow>

      {/* Blog Content */}
      <ScrollView>
        <ContentContainer>
          <Title>{blogData.title}</Title>
          <Description>{blogData.description}</Description>
          <BodyText>{blogData?.content}</BodyText>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
};

export default BlogDetailScreen;

// Styles
const Container = styled.View`
  flex: 1;
  background-color: #f8f9fb;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 200px;
  resize-mode: cover;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const StatsContainer = styled.View`
  align-items: center;
`;

const DateText = styled.Text`
  color: #777;
`;

const ContentContainer = styled.View`
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 16px;
  color: #555;
  margin-bottom: 16px;
`;

const BodyText = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #333;
`;

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
