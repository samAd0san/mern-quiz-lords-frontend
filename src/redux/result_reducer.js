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
        },
        updateResultAction: (state, action) => { // updates the result array at a specific index with the provided answer.
            const { trace, checked } = action.payload; // Get the checked value and the traced index
            state.result[trace] = checked; // Update the result array with the checked value
        },
        resetResultAction: () => { // reset the state after the quiz is completed.
            return {
                userId: null,
                result: []
            }
        }
    }
});

export const { setUserId, pushResultAction, updateResultAction, resetResultAction } = resultReduce.actions;

export default resultReduce.reducer;