import { combineReducers, configureStore } from "@reduxjs/toolkit";
import questionReducer from "./question_reducer";
import { resultReduce } from "./result_reducer";

// The store in Redux serves as the central hub for managing the entire state of the application.
const rootReducer = combineReducers({
    questions: questionReducer, // Add the question reducer to the store
    results: resultReduce // Add the result reducer to the store
});

export default configureStore({ reducer: rootReducer});