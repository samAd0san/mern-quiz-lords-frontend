// define how questions and answers are managed.

import { createSlice } from "@reduxjs/toolkit"

export const questionReducer = createSlice({
    name: 'question', // Slice name
    initialState: {
        queue: [], // Array to hold the questions
        answers: [], // Array to hold the answers
        trace: 0 // Index to trace the current question
    },
    reducers: {
        // This is an Action to start the exam by setting the question queue
        startExamAction: (state, action) => { // state is the current state, action is the payload
            return {
                ...state, // Copy the existing state
                queue: action.payload // Update the questions queue with the payload data
            }
        }
    }
});

/*
    Action: An event or instruction that describes what happened in the app.
    Reducer: A function that updates the app’s state based on actions.
*/
export const {startExamAction} = questionReducer.actions // Export the action*

export default questionReducer.reducer // Export the reducer