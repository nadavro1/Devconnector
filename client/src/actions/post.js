import {GET_POSTS,POSTS_ERROR,UPDATE_LIKES,DELETE_POST,ADD_POST,GET_POST, ADD_COMMENT, DELETE_COMMENT} from './types'
import {setAlert} from './alert'
import axios from 'axios'

//get posts
export const getPosts= ()=>async (dispatch)=>{
    try {
      const res = await axios.get('/api/posts');
      
      dispatch({
          type:GET_POSTS,
          payload:res.data
      })
    } catch (error) {
        dispatch({
            type:POSTS_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })   
    }

}
//like a post
export const addLike= (id)=>async (dispatch)=>{
    try {
      const res = await axios.put(`/api/posts/like/${id}`);
      
      dispatch({
          type:UPDATE_LIKES,
          payload:{id,likes:res.data.likes}
      })
    } catch (error) {
        dispatch({
            type:POSTS_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })   
    }

}

//unlike a post
export const removeLike= (id)=>async (dispatch)=>{
    try {
      const res = await axios.put(`/api/posts/unlike/${id}`);
      
      dispatch({
          type:UPDATE_LIKES,
          payload:{id,likes:res.data.likes}
      })
    } catch (error) {
        dispatch({
            type:POSTS_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })   
    }

}

//delete a post
export const deletePost= (id)=>async (dispatch)=>{
    try {
      await axios.delete(`/api/posts/${id}`);
      
      dispatch({
          type:DELETE_POST,
          payload: id
      })
      dispatch(getPosts());
      dispatch(setAlert('Your post has been deleted', 'success'));
    } catch (error) {
        dispatch({
            type:POSTS_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })   
    }

}

//add  post
export const addPost= (formData)=>async (dispatch)=>{
    try {
        const config={
            header:{
                'Content-Type':'application/json'
            }
        }
     
      const res= await axios.post(`/api/posts/`,formData,config);

      dispatch({
          type:ADD_POST,
          payload: res.data
      })
      dispatch(getPosts());
      dispatch(setAlert('Your post has been added', 'success'));
    } catch (error) {
        dispatch({
            type:POSTS_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })   
    }

}
//get post
export const getPost= (id)=>async (dispatch)=>{
    try {
      const res = await axios.get(`/api/posts/${id}`);
      
      dispatch({
          type:GET_POST,
          payload:res.data
      })
    } catch (error) {
        dispatch({
            type:POSTS_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })   
    }

}

//add comment
export const addComment= (postId,formData)=>async (dispatch)=>{
    try {
        const config={
            header:{
                'Content-Type':'application/json'
            }
        }
      const res= await axios.post(`/api/posts/comment/${postId}`,formData,config);

      dispatch({
          type:ADD_COMMENT,
          payload: res.data
      })
      dispatch(setAlert('Your comment has been added', 'success'));
    } catch (error) {
        dispatch({
            type:POSTS_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })   
    }

}

//delete comment
export const deleteComment= (postId,commentId)=>async (dispatch)=>{
    try {
        
        await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

      dispatch({
          type:DELETE_COMMENT,
          payload: commentId
      })
      dispatch(setAlert('Your comment has been removed', 'success'));
    } catch (error) {
        dispatch({
            type:POSTS_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })   
    }

}