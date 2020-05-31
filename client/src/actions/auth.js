import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAILED,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOAD_USER,
    AUTH_ERR,
    LOGOUT,
    CLEAR_PROFILE
} from './types';
import {setAlert} from './alert';
import setAuthToken from '../utils/setAuthToken';

export const load_user=()=> async dispatch =>{
    const token = localStorage.getItem('token');
    setAuthToken(token);
    try {
      
            const res= await axios.get('/api/auth');
            dispatch({
                type: LOAD_USER,
                payload:res.data
            })
        
    } catch (error) {
        dispatch({
            type:AUTH_ERR
        })
    }
}

export const login= (email,password) => async dispatch => {
        const userLogin={
            email,
            password
        }
        const config= {
            header:{
                'Content-Type':'application/json'
            }
        }
        // const body= JSON.stringify(newReg);
    try {
        const res=  await axios.post('/api/auth',userLogin,config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(load_user());
        
        
    } catch (error) {
        console.log("error:",error);
        const errors= error.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger',6000)));
        }
        dispatch({
            type:LOGIN_FAILED,
        });
    }
    

    
};


export const register= (name,email,password) => async dispatch => {
        const newReg={
            name,
            email,
            password
        }
        const config= {
            header:{
                'Content-Type':'application/json'
            }
        }
        // const body= JSON.stringify(newReg);
    try {
        const res=  await axios.post('/api/users',newReg,config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });  
        dispatch(load_user());
    } catch (error) {
        const errors= error.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger',6000)));
        }
        dispatch({
            type:REGISTER_FAILED,
        });
    } 
};

export const logout = ()=> dispatch => {
    dispatch({type:LOGOUT});
    dispatch({type:CLEAR_PROFILE});
};




