import * as Action from '../redux/result_reducer';

export const PushAnswer = (result) => async(dispatch) => {
    try {
        await dispatch(Action.pushResultAction(result)) // Push the result to the result array
    } catch (error) {
        console.log(error);
    }
}