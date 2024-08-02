import { postServerData } from '../helper/helper'
import * as Action from '../redux/result_reducer';

export const PushAnswer = (result) => async(dispatch) => {
    try {
        await dispatch(Action.pushResultAction(result)) // Push the result to the result array
    } catch (error) {
        console.log(error);
    }
}

// This function is used to update the result array when the user navigates to the next question.
export const updateResult = (index) => async(dispatch) => {
    try {
        dispatch(Action.updateResultAction(index)); // updates the result array at a specific index with the provided answer.
    } catch (error) {
        console.log(error);
    }
}

// Insert the result into the database
export const usePublishResult = (resultData) => {
    const { result, username } = resultData;
    (async () => {
        try {
            if(result !== [] && !username) throw new Error("Couldn't get Result");
            await postServerData(`${process.env.BACKEND_URI}/api/result`, resultData, data => data)
        } catch (error) {
            console.log(error)
        }
    })();
}