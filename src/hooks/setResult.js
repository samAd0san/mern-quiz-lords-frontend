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