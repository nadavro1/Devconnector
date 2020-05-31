import {GET_POSTS,POSTS_ERROR, UPDATE_LIKES, DELETE_POST,ADD_POST,GET_POST,ADD_COMMENT,DELETE_COMMENT} from '../actions/types';

const initialState= {
    posts:[],
    post:null,
    loading:true,
    error:{}
}

export default function(state = initialState,action){
    const {type,payload}=action;
    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts:payload,
                post:null,
                loading:false
            }
        case GET_POST:
            return{
                ...state,
                post:payload,
                loading:false
            }
        case UPDATE_LIKES:
            return{
                ...state,
                loading:false,
                posts: state.posts.map(post => (
                    post._id === payload.id ? {...post, likes:payload.likes}:post
                ))
            }
        case ADD_POST:
            return{
                ...state,
                loading:false,
                posts:[payload,...state.posts]
            }
        case DELETE_POST:
            return{
                ...state,
                loading:false,
                posts: state.posts.filter(post => (
                    post._id !== payload.id 
                ))
            }
        case ADD_COMMENT:
            return{
                ...state,
                loading:false,
                post:{...state.post,comments:payload.comments}
            }
        case DELETE_COMMENT:
            return{
                ...state,
                loading:false,
                post:{...state.post,comments:state.post.comments.filter(comment=>(
                    comment._id !== payload
                ))}
            }
        case POSTS_ERROR:
            return{
                ...state,
                error:payload,
                loading:false
            }
        default:
            return state;
    }
}