// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  age: number;
  colour: string;
}

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [
    { _id: '1', name: 'John Doe', age: 25, colour: 'Blue' },
    { _id: '2', name: 'Jane Smith', age: 30, colour: 'Red' },
    { _id: '3', name: 'Bob Johnson', age: 35, colour: 'Green' },
  ],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    editUser: (state, action: PayloadAction<{ _id: string; user: User }>) => {
      const { _id, user } = action.payload;
      const index = state.users.findIndex((u) => u._id === _id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...user };
      }
    },
    deleteUser: (state, action: PayloadAction<User>) => {
      state.users = state.users.filter((user) => user._id !== action.payload._id);
    },
  },
});

export const { addUser, editUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
