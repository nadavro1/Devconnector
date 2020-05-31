import {
    REGISTER_SUCCESS, 
    REGISTER_FAILED,
    LOGIN_SUCCESS, 
    LOGIN_FAILED,
    LOAD_USER,
    AUTH_ERR,
    LOGOUT,
    ACCOUNT_DELETED
} from '../actions/types';

const initialState={
    token: localStorage.getItem('token'),
    isAuthenticated:null,
    loading:true,
    user:null
};
export default function(state = initialState,action){
    const {type,payload}= action
    switch (type) {
        case LOAD_USER:
            return {
                ...state,
                isAuthenticated:true,
                loading:false,
                user:payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token',payload.token)
            return {
                ...state,
                // token:payload.token,
                ...payload,
                isAuthenticated:true,
                loading:false
            }
        case LOGIN_FAILED:
        case REGISTER_FAILED:
        case AUTH_ERR:
        case LOGOUT:
        case ACCOUNT_DELETED:
            localStorage.removeItem('token')
            return {
                ...state,
                token:null,
                isAuthenticated:false,
                loading:false,
                user:null
            }
        default:
            return state;
    }

}