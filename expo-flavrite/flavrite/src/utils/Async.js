import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage from react-native-async-storage

// INTRO
setIntroActive = async () => { // Set intro active function
    try {
        await AsyncStorage.setItem('intro_status', '4'); // Set intro status to 4 
        return true; // Return true
    } catch (e) {
      // saving error
    }
}

checkIntroStatus = async () => { // Check intro status function
    try {
        const value = await AsyncStorage.getItem('intro_status') // Get intro status from async storage
        return value; // Return value
    } catch(e) {
      // error reading value
    }
}

// AUTH
setUserToken = async (par) => { // Set user token function
    try {
        await AsyncStorage.setItem('utk', par); // Set user token to par parameter 
        return true; // Return true
    } catch (e) {
      // saving error
    }
}

getUserToken = async () => { // Get user token function
    try {
        const value = await AsyncStorage.getItem('utk') // Get user token from async storage
        return value; // Return value
    } catch(e) {
      // error reading value
    }
}

removeUserToken = async () => { // Remove user token function
    try {
        await AsyncStorage.removeItem('utk'); // Remove user token from async storage
        await AsyncStorage.removeItem('bmr'); // Remove bmr from async storage
        await AsyncStorage.removeItem('meal'); // Remove meal from async storage
        await AsyncStorage.removeItem('kg'); // Remove kg from async storage
        await AsyncStorage.removeItem('water'); // Remove water from async storage
        await AsyncStorage.removeItem('cigar'); // Remove cigar from async storage
        await AsyncStorage.removeItem('book'); // Remove book from async storage
        await AsyncStorage.removeItem('sleep'); // Remove sleep from async storage
        await AsyncStorage.removeItem('byear'); // Remove byear from async storage
        await AsyncStorage.removeItem('gender'); // Remove Gender from async storage
        await AsyncStorage.removeItem('tall'); // Remove tall from async storage
        await AsyncStorage.removeItem('weight'); // Remove weight from async storage
        await AsyncStorage.removeItem('wstatus'); // Remove wstatus from async storage
        return true; // Return true
    } catch(e) {
      // error reading value
    }
}

// CONFIG
getConfig = async () => { // Get config function
    try {
        const value = await AsyncStorage.getItem('app_config') // Get app config from async storage
        return value; // Return value
    } catch(e) {
      // error reading value
    }
}

setConfig = async (par) => { // Set config function
    try {
        await AsyncStorage.setItem('app_config', par); // Set app config to par parameter
        return true;
    } catch (e) {
      // saving error
    }
}

removeConfig = async () => { // Remove config function
    try {
        const value = await AsyncStorage.removeItem('app_config'); // Remove app config from async storage
        return value; // Return value
    } catch(e) {
      // error reading value
    }
}

// BRANCS
setBrands = async (par) => { // Set brands function
    try {
        await AsyncStorage.setItem('brands', par); // Set brands to par parameter
        return true; // Return true
    } catch (e) {
      // saving error
    }
}

getBrands = async () => { // Get brands function
    try {
        const value = await AsyncStorage.getItem('brands') // Get brands from async storage
        return value; // Return value
    } catch(e) {
      // error reading value
    }
}

setCar = async (par) => { // Set car function
    try {
        await AsyncStorage.setItem('car', par); // Set car to par parameter
        return true;
    } catch (e) {
      // saving error
    }
}

getCar = async () => { // Get car function
    try {
        const value = await AsyncStorage.getItem('car') // Get car from async storage
        return value;
    } catch(e) {
      // error reading value
    }
}

deleteCar = async () => { // Delete car function
    try { 
        await AsyncStorage.removeItem('car'); // Remove car from async storage
        return true;
    } catch(e) {
      // error reading value
    }
}

export default 
{
    // INTRO
    setIntroActive,
    checkIntroStatus,

    // AUTH
    setUserToken,
    getUserToken,
    removeUserToken,

    // CONFIG
    getConfig,
    setConfig,
    removeConfig,

}