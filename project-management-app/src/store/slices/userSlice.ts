// src/store/slices/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    uid: string;
    email: string | null;
}

const initialState: UserState = {
    uid: '',
    email: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.uid = action.payload.uid;
            state.email = action.payload.email;
        },
        clearUser: (state) => {
            state.uid = '';
            state.email = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
