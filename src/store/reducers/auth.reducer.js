import {createSlice} from '@reduxjs/toolkit'

export const authSlice=createSlice({
    name:"auth",
    initialState:{
        email:null,
        fullname:null
    },
    reducers:{
        authSuccess:(state,action)=>{
            state.email=action.email;
            state.fullname=action.fullname;
        },
        signout:(state)=>{
            sessionStorage.removeItem('token');
            state.email=null;
            state.fullname=null;
        }
    }
})

export const {authSuccess, signout  } = authSlice.actions

export default authSlice.reducer