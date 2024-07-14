import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import data from "../database/data";

/** redux actions */
import * as Action from '../redux/question_reducer'

/** Custom hook to fetch question data from the backend and set it in the Redux store */
export const useFetchQuestion = () => {
    // Dispatch: A function used to send actions to the Redux store to update the state.
    const dispatch = useDispatch();  // Get the dispatch function to send actions to the Redux store
    
    // State to manage loading status, API data, and server errors
    const [getData, setGetData] = useState({ 
        isLoading: false,  // Track if data is being fetched
        apiData: [],       // Store the fetched question data
        serverError: null  // Store any errors that occur during data fetch
    });

    useEffect(() => {
        // Set loading state to true when the hook runs
        setGetData(prev => ({...prev, isLoading: true})); // prev is the previous state of the data that is being updated.

        /** Async function to fetch question data from a simulated backend */
        (async () => {
            try {
                let question = await data;  // Simulate fetching data from an API

                if (question.length > 0) {
                    // If data is available, update the state with the data and stop loading
                    setGetData(prev => ({...prev, isLoading: false}));
                    setGetData(prev => ({...prev, apiData: question}));

                    /** Dispatch the action to update the Redux store with the question data */
                    dispatch(Action.startExamAction(question))
                } else {
                    // Throw an error if no questions are available
                    throw new Error("No Questions Available");
                }
            } catch (error) {
                // Handle any errors during data fetch and update state
                setGetData(prev => ({...prev, isLoading: false}));
                setGetData(prev => ({...prev, serverError: error}));
            }
        })();
    }, [dispatch]);  // The hook runs when the dispatch function changes (typically only on mount)

    // Return the current state and the state updater function
    return [getData, setGetData];
}