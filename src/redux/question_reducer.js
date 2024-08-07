import { createSlice } from "@reduxjs/toolkit";

export const questionReducer = createSlice({
    name: 'question',
    initialState: {
        queue: [],
        answers: [],
        trace: 0
    },
    reducers: {
        startExamAction: (state, action) => {
            const { questions, answers } = action.payload;
            console.log("Setting questions in state:", questions);
            return {
                ...state,
                queue: questions,  // Update to use questions
                answers
            };
        },
        moveNextAction: (state) => {
            console.log(`Attempting to move to next question. Current trace: ${state.trace}`);
            if (state.trace < state.queue.length - 1) {
                return {
                    ...state,
                    trace: state.trace + 1
                };
            }
            console.log(`Cannot move next. Current trace: ${state.trace}`);
            return state;
        },
        movePrevAction: (state) => {
            console.log(`Attempting to move to previous question. Current trace: ${state.trace}`);
            if (state.trace > 0) {
                return {
                    ...state,
                    trace: state.trace - 1
                };
            }
            console.log(`Cannot move previous. Current trace: ${state.trace}`);
            return state;
        },
        resetAllAction: () => ({
            queue: [],
            answers: [],
            trace: 0
        })
    }
});

export const { startExamAction, moveNextAction, movePrevAction, resetAllAction } = questionReducer.actions;
export default questionReducer.reducer;
