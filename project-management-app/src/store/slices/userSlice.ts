// src/store/slices/userSlice.ts

import { createSlice } from '@reduxjs/toolkit';

interface UserState {
    uid: string;
    displayName: string;
}

const initialState: UserState = {
    uid: '',
    displayName: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.uid = action.payload.uid;
            state.displayName = action.payload.displayName;
        },
        clearUser: (state) => {
            state.uid = '';
            state.displayName = '';
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
