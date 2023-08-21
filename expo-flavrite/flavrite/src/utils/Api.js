import axios from "axios"; // Import axios for api calls
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for storing user token
import * as SecureStore from 'expo-secure-store';

import Async from './Async'; // Import Async Storage for storing user token
import * as RootNavigation from '../../RootNavigation'; // Import RootNavigation for navigation 

export default async (options, method = "GET", isHeader = true) => { // Api call function with options, method and isHeader as parameters

    let token    = null; // Initialize token to null
    const client = axios.create(); // Create axios instance 

    async function getToken() // Get token function 
    {
        token = JSON.parse(await SecureStore.getItemAsync("token")) // Get token from async storage and parse it
        return token // Return token
    }
   
    client.interceptors.request.use( // Intercept request
        async config => { // Config parameter
            config.headers = {  // Set headers
                'Authorization': `Bearer ${isHeader ? await getToken().then(res=>res) : null}`, // Set authorization header 
                'Accept': 'application/json', // Set accept header
                'Content-Type': "application/json" // Set content type header
            } 
            config.method = method // Set method to method parameter
            //console.log(config)  
            return config; // Return config
        },
        error => { // Error parameter
            // console.log(error)
            Promise.reject(error) // Reject error 
    });

  
    const onSuccess = async function (response) { // On success function with response parameter
        return response.data; // Return response data
    };

    const onError = async function (error) { // On error function with error parameter 
        //navigate error page
        console.log('Error',JSON.stringify(error)) // Log error
        if( error.response && error.response.status == 401) // If error response status is 401
        { 
            await Async.removeUserToken() // Remove user token from async storage
            .then( res => { // Get response
            })
            RootNavigation.navigate('Gate'); // Navigate to gate screen 


        }
        // NavigationService.navigate('NetworkConnection');
        return Promise.reject(error);        // Return error
    };
    
    return client(options) // Return client with options
        .then(onSuccess) // Call on success function
        .catch(onError); // Call on error function
}
