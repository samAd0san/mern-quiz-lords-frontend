import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from 'axios'

export function attempts_Number(result){
    return result.filter(r => r !== undefined).length;
}

export function earnPoints_Number(result, answers, point){
    return result.map((element, i) => answers[i] === element).filter(i => i).map(i => point).reduce((prev, curr) => prev + curr, 0);
}

export function flagResult(totalPoints, earnPoints){
    return (totalPoints * 50 / 100) < earnPoints; /** earn 50% marks */
}

/** check user auth  */
export function CheckUserExist({ children }){
    const auth = useSelector(state => state.result.userId)
    return auth ? children : <Navigate to={'/'} replace={true}></Navigate>
}

/** get server data */
export async function getServerData(url) {
    try {
        const response = await axios.get(url);
        console.log('Fetched data:', response.data); // Add this line to debug
        return response.data;
    } catch (error) {
        console.error('Error fetching server data:', error);
        throw error;
    }
}

/** post server data */
export async function postServerData(url, result, callback) {
    try {
      const response = await axios.post(url, result);
      return callback ? callback(response.data) : response.data;
    } catch (error) {
      console.error('Error posting server data:', error);
      throw error;
    }
  }