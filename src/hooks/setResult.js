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

export const usePublishResult = (resultData) => {
    const { result, username } = resultData;
    (async () => {
        try {
            // Check if result is empty or username is missing
            if (result.length === 0 || !username) throw new Error("Couldn't get Result");
            
            // Get the selected subject ID from localStorage
            const selectedSubjectId = localStorage.getItem("selectedSubjectId");
            if (!selectedSubjectId) {
                throw new Error("No subject selected");
            }
            
            // Calculate attempts and points
            const attempts = resultData.attempts || result.filter(r => r !== undefined).length;
            const points = resultData.points || 0;
            const achieved = resultData.achived || "A";
            
            // Get the set information from localStorage or use a default value
            const set = localStorage.getItem("quizSet") || "setOne";
            
            // Check if we're in the Result component (which means the result was already saved)
            const isResultPage = window.location.pathname === '/result';
            if (isResultPage) {
                console.log("Already on result page, skipping result submission");
                return;
            }
            
            // Prepare the data according to the API requirements
            const apiData = {
                rollNumber: username,
                subjectId: selectedSubjectId,
                result: result,
                attempts: attempts,
                points: points,
                achieved: achieved,
                set: set
            };
            
            console.log("Submitting result to API:", apiData);
            
            // Post data to the server
            await postServerData(`${process.env.REACT_APP_BACKEND_URI}/api/result/${username}/${selectedSubjectId}`, apiData, data => data);
        } catch (error) {
            console.error("Error publishing result:", error);
        }
    })();
};
