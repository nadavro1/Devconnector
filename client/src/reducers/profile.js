import {GET_PROFILE, GET_REPOS, GET_PROFILES, PROFILE_ERR, CLEAR_PROFILE, UPDATE_PROFILE} from '../actions/types';

const initialState={
    loading:true,
    profile:null,
    profiles:{},
    repos:[],
    error:{}

};
export default function(state = initialState,action){
    const {type,payload}= action
    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                loading:false,
                profile:payload
            }
        case GET_PROFILES:
            return {
                ...state,
                // profile:null,
                loading:false,
                profiles:payload
            }
        case GET_REPOS:
            return {
                ...state,
                loading:false,
                repos:payload
            }
        case PROFILE_ERR:
            return{
                ...state,
                loading:false,
                error:payload,
                // profile:null
            }
        case CLEAR_PROFILE:
            return{
                ...state,
                loading:false,
                profile:null,
                repos:[]
            }
        default:
            return state;
    }

}

