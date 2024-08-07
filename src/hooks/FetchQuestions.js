import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServerData } from "../helper/helper";
import * as Action from '../redux/question_reducer';
import store from '../redux/store';

export const useFetchQuestion = () => {
    const dispatch = useDispatch();
    const rollNumber = useSelector((state) => state.result.userId);
    const [getData, setGetData] = useState({ 
        isLoading: false,
        apiData: [],
        serverError: null
    });

    useEffect(() => {
        if (!rollNumber) return;

        setGetData(prev => ({ ...prev, isLoading: true }));

        (async () => {
          try {
            const url = `${process.env.REACT_APP_BACKEND_URI}/api/questions?rollNumber=${rollNumber}`;
            const data = await getServerData(url);

            if (data && data.questions && data.questions.length > 0) {
              const { questions, answers } = data;

              console.log("Fetched questions:", questions);
              setGetData({ isLoading: false, apiData: questions, serverError: null });

              // Dispatch action to store data in Redux state
              dispatch(Action.startExamAction({ questions, answers }));

              // Log state after dispatch to confirm update
              console.log("State after dispatch:", store.getState());
            } else {
              throw new Error("No Questions Available");
            }
          } catch (error) {
            setGetData({ isLoading: false, apiData: [], serverError: error.message });
            console.error("Error fetching data:", error);
          }
        })();
    }, [dispatch, rollNumber]);

    return [getData, setGetData];
}

export const MoveNextQuestion = () => async (dispatch) => {
    try {
        console.log("Dispatching MoveNextQuestion action");
        dispatch(Action.moveNextAction());
    } catch (error) {
        console.log(error);
    }
}

export const MovePrevQuestion = () => async (dispatch) => {
    try {
        console.log("Dispatching MovePrevQuestion action");
        dispatch(Action.movePrevAction());
    } catch (error) {
        console.log(error);
    }
}