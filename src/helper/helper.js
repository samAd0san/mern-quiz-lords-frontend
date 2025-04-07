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
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        console.log(`Making API request to: ${url}`);
        const response = await axios.get(url, { headers });
        console.log('API Response:', response.data);
        
        // Check if the response has the expected structure
        if (response.data && response.data.status === "success") {
            return response.data;
        } else {
            console.error('Invalid API response format:', response.data);
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('Error fetching server data:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            throw new Error(error.response.data.message || 'Server error');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            throw new Error('No response from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
            throw error;
        }
    }
}

/** post server data */
export async function postServerData(url, result, callback) {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      console.log(`Making POST request to: ${url}`);
      console.log('Request payload:', result);
      
      const response = await axios.post(url, result, { headers });
      console.log('POST Response:', response.data);
      
      // Check if the response has the expected structure
      if (response.data && response.data.status === "success") {
        return callback ? callback(response.data) : response.data;
      } else {
        console.error('Invalid API response format:', response.data);
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error posting server data:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        throw new Error(error.response.data.message || 'Server error');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw error;
      }
    }
  }