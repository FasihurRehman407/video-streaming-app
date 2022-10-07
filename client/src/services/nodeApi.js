import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseUrl = "http://127.0.0.1:3001/api/v1";

export const nodeApi = createApi({
  reducerPath: "nodeApi",
  baseQuery: fetchBaseQuery({ baseUrl }),

  // Entities of API
  tagTypes: [
    "User",
    "Videos",
    "Channel",
    "Video",
    "Comments"
  ],

  endpoints: (builder) => ({
    //Optimize:  ************************** Authentication ******************************

    //********** Login query
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
      invalidatesTags: [ 'User' ],
    }),
    //********** Sign up query
    signup: builder.mutation({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
      // invalidatesTags: [ 'User' ],
    }), 
    //*********** get user
    getUser: builder.query({
      query:(id) => ({
        url: `users/find/${id}`,
        method:'GET'
      }),
      providesTags:['User']
    }),
    googleLogin: builder.mutation({
      query: (body) => ({
        url:'/users/google',
        method:'POST',
        body
      }),
      invalidatesTags:['User']
    }),
    //Optimize:  ************************** Videos ******************************
    getAllVideos: builder.query({
      query: (type) => ({
        url: `/videos/${type}`,
        method: "GET",
        
      }),
      invalidatesTags: ["Videos"],
    }),
    getChannelById: builder.query({
      query: (id) =>({
        url: `/users/find/${id}`,
        method: 'GET',
      }),
      providesTags:["Channel"]
    }),
    getVideoById: builder.query({
      query: (id) =>({
        url: `/videos/${id}`,
        method: 'GET',
      }),
      providesTags:["Video"]
    }),
    likeVideo: builder.mutation({
      query: (id) =>({
        url: `/users/like/${id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      }),
      invalidatesTags:["Video"]
    }),
    dislikeVideo: builder.mutation({
      query: (id) =>({
        url: `/users/dislike/${id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      }),
      invalidatesTags:["Video"]
    }),
    subscribeChannel: builder.mutation({
      query: (id) =>({
        url: `/users/sub/${id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      }),
      invalidatesTags:["Video", "User", "Channel"]
    }),
    unsubscribeChannel: builder.mutation({
      query: (id) =>({
        url: `/users/unsub/${id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      }),
      invalidatesTags:["Video", "User", "Channel"]
    }),
  //Optimize:  ************************** Comments ******************************
  getComments: builder.query({
    query: (id) =>({
      url: `/comments/allcomments/${id}`,
      method: "GET",
      headers: {
        authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    }),
    providesTags:["Comments"]
  }),
  addComment: builder.mutation({
    query: (body) =>({
      url: '/comments',
      method: "POST",
      body,
      headers: {
        authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    }),
    invalidatesTags:["Comments"]
  }),



}),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLikeVideoMutation,
  useDislikeVideoMutation,
  useSubscribeChannelMutation,
  useUnsubscribeChannelMutation,
  useGetCommentsQuery,
  useGoogleLoginMutation,
  useGetUserQuery,
  useGetAllVideosQuery,
  useGetChannelByIdQuery,
  useGetVideoByIdQuery,
  useAddCommentMutation,
} = nodeApi;