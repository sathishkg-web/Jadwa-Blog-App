# Jadwa-Blog-App

# welcome to react native Blog App

# App Name: Jadwa blog App

## Get started

Jadwa is a cross platform React Native app which provides seamless blogging experience with its user friendly interface.

1. Stack Used

* React native
* Firebase as serverless backend
     - storage
     - firebase database
* Clerk Authentication 

2. Actions Performed - CRUD

C - Create Blog and user data
R - Read Blog data, user data
E - Edit Blog
D - Delete blog

3. ERD Design:

   Totally 2 Erd components are used which are  listed below,

     1. User - Fields ( user id(PK), username, Email)

     2. Blogs - Fields (blog_id(PK), blog title, description, category, content, author/user (FK) , publish date, cover photo uri)

4. Clerk authentication - login , logout functionality

5. Components created:
    - Search component
    - picker component 
    - Dropdown modal
    - Profile icons placeholder,
    - card component
    - header component
  
6. Screens 
     - Home screen,
     - Edit Blog screen,
     - create blog screen,
     - read screen
     - Fallback Screen
     - login Screen
