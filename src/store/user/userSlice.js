import { createSlice } from "@reduxjs/toolkit";

const getUserData = () => {
    if (sessionStorage.getItem('user') !== null) {
        return JSON.parse(sessionStorage.getItem('user') + '');
    }
    return null;
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: getUserData()
    },
    reducers: {
        clearUserData: (state) => {
            sessionStorage.removeItem('user');
            state.userData = null;
        },
        setUserData: (state, action) => {
            let user = { ...action.payload };
            state.userData = user;
            sessionStorage.setItem('user', JSON.stringify(user));
        }
    }
})

// Action creators are generated for each case reducer function
export const { clearUserData, setUserData } = userSlice.actions

export default userSlice.reducer