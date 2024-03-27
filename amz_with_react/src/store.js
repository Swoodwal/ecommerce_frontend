import { configureStore, createSlice } from "@reduxjs/toolkit";

//generate different parts of reducer
const userSlice = createSlice(
    {
        name:  'user',  //slice name,identity
        initialState: {
            userId: null,
        },
        reducers:{
            setUser: (state, action) => {
                state.userId=action.payload;
                console.log('action payload: ',action.payload);
            },
            logout: (state) => {
                state.userId=null;
            }
        }
    }
);

export const {setUser, logout} = userSlice.actions;

export const store = configureStore(
    {
        //arguments: action and previous state
        //return a new state
        reducer:{
            user:userSlice.reducer
        }
    }
);