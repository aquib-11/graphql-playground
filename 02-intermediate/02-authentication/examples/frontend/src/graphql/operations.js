import { gql } from '@apollo/client'

// Fragments 

const USER_FIELDS = gql`
  fragment UserFields on User {
    id name email role createdAt
  }
`

const POST_FIELDS = gql`
  fragment PostFields on Post {
    id title content createdAt updatedAt
    author { id name }
  }
`

// Auth mutations 

export const REGISTER = gql`
  ${USER_FIELDS}
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user { ...UserFields }
    }
  }
`

export const LOGIN = gql`
  ${USER_FIELDS}
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { ...UserFields }
    }
  }
`

//  Protected queries 

export const ME = gql`
  ${USER_FIELDS}
  query Me {
    me { ...UserFields }
  }
`

export const GET_POSTS = gql`
  ${POST_FIELDS}
  query GetPosts {
    posts { ...PostFields }
  }
`

export const GET_USERS = gql`
  ${USER_FIELDS}
  query GetUsers {
    users { ...UserFields }
  }
`

// Protected mutations 

export const CREATE_POST = gql`
  ${POST_FIELDS}
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) { ...PostFields }
  }
`

export const UPDATE_POST = gql`
  ${POST_FIELDS}
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) { ...PostFields }
  }
`

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`
