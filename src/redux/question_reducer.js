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
            let { question, answers} = action.payload
            return {
                ...state, // Copy the existing state
                queue : question, // Update the questions queue with the payload data
                answers
            }
        },
        moveNextAction: (state) => { // Move to the next question   
            return {
                ...state,
                trace: state.trace + 1
            }
        },
        movePrevAction: (state) => { // Move to the previous question
            return {
                ...state,
                trace: state.trace - 1
            }
        },
        resetAllAction: () => { // Reset the state after the quiz is completed
            return {
                queue: [],
                answers: [],
                trace: 0
            }
        }
    }
});

/*
    Action: An event or instruction that describes what happened in the app.
    Reducer: A function that updates the app’s state based on actions.
    Dispatch: A function used to send actions to the Redux store to update the state.
*/
export const { startExamAction, moveNextAction, movePrevAction, resetAllAction } = questionReducer.actions // Export the action*

export default questionReducer.reducer; // Export the reducer