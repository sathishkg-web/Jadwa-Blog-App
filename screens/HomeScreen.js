import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Dimensions, Platform, Image } from 'react-native';
import Header from '../components/Header';
import DropdownMenu from '../components/DropdownMenu';
import BlogCard from '../components/BlogCard';
import styled from 'styled-components/native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; 
import { useAuth, useUser } from '@clerk/clerk-expo';

const simulateTablet = true;
const { width } = Dimensions.get('window');
const isTablet = !simulateTablet || (width > 768 && width < 1024);
const isTv = width >= 1024;

const HomeScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const iconRef = useRef(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const { user } = useUser();
  const { userId } = useAuth();

  const navigation = useNavigation();
  const columnCount = isTv ? 4 : isTablet ? 3 : 2;

  useEffect(() => {
    const fetchBlogs = () => {
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedBlogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          img: { uri: doc.data()?.coverImage },
        }));
        setBlogs(fetchedBlogs);
      });
      
      return unsubscribe;
    };

    const unsubscribe = fetchBlogs();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDropdownVisible && iconRef.current) {
      iconRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({
          x: pageX - 155 + width,
          y: pageY - 10 + height,
        });
      });
    }
  }, [isDropdownVisible]);

  const filteredBlogs = blogs
    .filter((blog) => 
      selectedCategory === 'All' || blog.category === selectedCategory
    )
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <Container>
      <Header
        isTablet={isTablet}
        isTv={isTv}
        searchText={searchText}
        setSearchText={setSearchText}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        iconRef={iconRef}
        toggleDropdown={() => setDropdownVisible(!isDropdownVisible)}
      />
      {isDropdownVisible && (
        <DropdownMenu
          dropdownPosition={dropdownPosition}
          closeDropdown={() => setDropdownVisible(false)}
        />
      )}
      {!isTablet && !isTv ? (
        <PickerContainer>
          <RNPickerSelect
            onValueChange={setSelectedCategory}
            items={[
              { label: 'All Type', value: 'All' },
              { label: 'Finance', value: 'Finance' },
              { label: 'Health', value: 'Health' },
              { label: 'Tech', value: 'Technology' },
              { label: 'Market', value: 'Market' },
            ]}
            value={selectedCategory}
            placeholder={{ label: 'Category', value: null }}
            useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: {
                color: '#333',
                paddingVertical: 3.5,
                paddingHorizontal: 40,
                fontSize: 16,
                paddingLeft: 8,
              },
              inputAndroid: {
                color: '#333',
                paddingVertical: 3.5,
                paddingHorizontal: 40,
                fontSize: 16,
                paddingLeft: 8,
              },
              viewContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                flex: 0.5,
              },
              iconContainer: {
                top: 8,
                right: 2,
                marginLeft: 40,
              },
            }}
            Icon={() => <Ionicons name="chevron-down" size={18} color="#333" />}
          />
        </PickerContainer>
      ) : null}
      <TopRow>
        <Title>Blogs</Title>
        <AddButton onPress={() => navigation.navigate('Create')}>
          <AddButtonText>Add New</AddButtonText>
        </AddButton>
      </TopRow>

      <ScrollView
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
        showsVerticalScrollIndicator={false}
      >
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.id} columnCount={columnCount} blog={blog} userId={userId}/>
        ))}
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fb;
  padding: 16px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #6c63ff;
  padding: 8px 16px;
  border-radius: 8px;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const PickerContainer = styled.View`
  flex-direction: row;
  width: 40%;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 0 8px;
`;
