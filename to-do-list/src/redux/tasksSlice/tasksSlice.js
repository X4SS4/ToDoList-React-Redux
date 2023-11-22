import { createSlice } from "@reduxjs/toolkit";

export const tasksSlice = createSlice({
    name: "tasks",
    initialState: JSON.parse(localStorage.getItem("tasks")) ?? [],
    reducers: {
        addTask: (state, action) => {
            state.unshift(action.payload);
        },
        deleteTask: (state, action) => {
            const index = state.findIndex((task) => task.id === action.payload.id);
            if (index !== -1) { state.splice(index, 1); }
        },
        editTask: (state, action) => {
            const task = state.find((task) => task.id === action.payload.id);
            if (task) {
                task.title = action.payload.title ?? "No Title";
                task.description = action.payload.description ?? "No Description";
            }
        },
        completeTask: (state, action) => {
            const task = state.find((task) => task.id === action.payload.id);
            if (task) {
                task.isDone = !task.isDone;
            }
        },
    },
});

export const { addTask, deleteTask, editTask, completeTask } = tasksSlice.actions;

export default tasksSlice.reducer;