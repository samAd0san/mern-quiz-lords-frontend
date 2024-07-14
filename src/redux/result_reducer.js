import { createSlice } from "@reduxjs/toolkit";

// Define how the result is managed.
export const resultReduce = createSlice({
    name: 'result',
    initialState: { // Initial state of the result
        userId: null, // User ID
        result: [] // Array to hold the result
    },
    reducers: {
        setUserId: (state, action) => { // Set the user ID
            state.userId = action.payload; // Update the user ID with the payload data
        },
        pushResultAction: (state, action) => {
            state.result.push(action.payload) // Push the result to the result array
        }
    }
});

export const { setUserId, pushResultAction } = resultReduce.actions;

export default resultReduce.reducer;