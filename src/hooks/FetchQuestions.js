import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { getServerData } from "../helper/helper";

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
                const [{ questions, answers }] = await getServerData(`${process.env.REACT_APP_BACKEND_URI}/api/questions`, (data) => data);

                if (questions.length > 0) {
                    // If data is available, update the state with the data and stop loading
                    setGetData(prev => ({...prev, isLoading: false}));
                    setGetData(prev => ({...prev, apiData: questions}));

                    /** Dispatch the action to update the Redux store with the question data */
                    dispatch(Action.startExamAction({ question : questions, answers }))
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

export const MoveNextQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.moveNextAction()); // increment the current question index
    } catch (error) {
        console.log(error);
    }
}

export const MovePrevQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.movePrevAction()); // decrement the current question index
    } catch (error) {
        console.log(error)
    }
}