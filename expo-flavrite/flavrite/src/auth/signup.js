import React from 'react'; // Import react
import { // Import react native components
    SafeAreaView,
    Linking,
    StyleSheet,
    View,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,

    TextInput,
    TouchableOpacity
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import {LoaderScreen} from 'react-native-ui-lib'; // Import loader screen
import * as Font from 'expo-font';
import Toast from 'react-native-toast-message'; // Import Toast
import HttpClient from '../utils/Api'; // Import HttpClient
import URLS from '../utils/Url'; // Import URLS
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

class Register extends React.Component {
    constructor(props) // Default constructor
    {
        super(props); // Call default constructor
        this.state = { // Initialize state
            showToast: false, // Define toast state 
            loading: false, // Define loading state
            email: '', // Define email state
            name: '', // Define name state
            password: '', // Define password state
            textToast: '', // Define toast text
            success: '' // Define success state
        }
    }

    async componentDidMount() // Call after component is mounted
    {
        await Font.loadAsync({
            'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
            'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
            'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
        });
        // Set fontLoaded state to true
        this.setState({ fontLoaded: true });
    }

    async submit() // Submit form
    {
        Keyboard.dismiss() // Dismiss keyboard
        if(!this.state.email.length) // If email is empty
        {
            this.setState({ 
                showToast: true,  // Set toast state
                textToast: 'Enter Email' // Set toast text
            })
            return false; // Return false
        }

        if(!this.state.name.length) // If name is empty
        {
            this.setState({ 
                showToast: true, // Set toast state
                textToast: 'Enter Name' // Set toast text
            })
            return false; // Return false
        }

        if(!this.state.password.length) // If password is empty
        {
            this.setState({ 
                showToast: true, // Set toast state
                textToast: 'Enter Password' // Set toast text
            })
            return false; // Return false
        }
        this.setState({ 
            loading: true // Set loading to true
        })
        await HttpClient({ // Call HttpClient
            url : URLS.OAUTH_LOGIN, // Define url
            data : { // Define data
                email: this.state.email, // Define email
                name: this.state.name, // Define name
                password: this.state.password // Define password
            }
        }, 'POST', false).then( async res => { // Post request to server to send email 
            this.setState({ // Set state
                success : res.data, // Set success state
                loading: false // Set loading to false
            })
        const jsonValue = JSON.stringify(res.data);
        await SecureStore.setItemAsync('token', jsonValue); // Set Token
        this.props.navigation.push('OnBoardingCategory') // Navigate to Explore Screens

        }).catch( error => { // Catch error
            this.setState({ 
                textToast: error.message, // Set toast text
                loading: false, // Set loading to false
                showToast: true // Set toast state
            })
        })
    }

    render() // Render component
    {
        return (
            // Define Safe Area View
            <SafeAreaView className='justify-center' style={[styles.container]}>
                <View className='absolute top-14 flex justify-between items-center px-5 mb-10 w-full flex-row'>
                    <TouchableOpacity className='border-0 bg-transparent p-0 flex items-center flex-row' borderRadius={0} onPress={ _ => this.props.navigation.goBack() }>
                        <Ionicons name={'chevron-back-outline'} size={30} color={'#333'}/>
                        <Text className='text-base' style={[{ fontFamily: 'Baloo2-Bold', color: '#333' }]}>Back</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View className='w-full flex p-8'>
                        <View className='flex items-center justify-center mb-10'>
                            <Text className='font-bold' style={[{ color: '#E76E50', fontFamily: 'Baloo2-Bold', fontSize: 50 }]}>FLAVRITE</Text>
                            <Text className='text-base text-center text-gray-600 leading-4 pt-2' style={[{ fontFamily: 'Baloo2-Bold'}]}>EXPLORE YOUR PERSONAL {`\n`} FLAVRITE PROFILE</Text>
                        </View>
                                <View className='w-full mt-4'>

                                    <TextInput
                                        placeholder={'Display Name'}
                                        className='border-2 border-gray-500 rounded-md mt-3 p-2'
                                        disabled
                                        style={ {
                                            fontFamily: 'Baloo2-Bold'
                                        }}
                                        hideUnderline={true}
                                        containerStyle={{ borderWidth: 0}}
                                                onChangeText={ text => this.setState({ 
                                                    name: text 
                                            })}
                                    />

                                    <TextInput
                                        placeholder={'Email'}
                                        className='border-2 border-gray-500 rounded-md mt-3 p-2'
                                        style={ {
                                            fontFamily: 'Baloo2-Bold'
                                        }}
                                        hideUnderline={true}
                                        containerStyle={{ borderWidth: 0}}
                                        onChangeText={ text => this.setState({ 
                                            email: text 
                                        })}
                                    />
                                    <TextInput
                                        placeholder={'Password'}
                                        className='border-2 border-gray-500 rounded-md mt-3 p-2'
                                        disabled
                                        style={ {
                                            fontFamily: 'Baloo2-Bold'
                                        }}
                                        hideUnderline={true}
                                        containerStyle={{ borderWidth: 0}}
                                                onChangeText={ text => this.setState({ 
                                                    password: text 
                                            })}
                                    />


                                    <TouchableOpacity
                                        className='border-0 w-full rounded-full p-2 mt-6'
                                        style={[ {
                                            backgroundColor: '#E76E50',
                                        }]}
                                        borderRadius={0}
                                        onPress={ _ => this.submit()}>
                                        <Text className='text-center w-full text-white' style={[{ fontFamily: 'Baloo2-Bold'}]}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>


                    </View>
                </KeyboardAvoidingView>

                <Toast
                    // Toast Component  
                    visible={this.state.showToast} // Set visible state to show toast
                    position={'bottom'} // 
                    backgroundColor={'#E16160'}
                    message={this.state.textToast} // Set message to textToast state
                    onDismiss={ _ => this.setState({ // On dismiss set showToast state to false
                        showToast: false // Set showToast state to false
                    })}
                    autoDismiss={3000} // Auto dismiss toast after 3 seconds
                    // showDismiss={showDismiss}
                    // action={{iconSource: Assets.icons.x, onPress: () => console.log('dismiss')}}
                    // showLoader={true}
                />
                {this.state.loading && <LoaderScreen backgroundColor={'rgba(0,0,0,.4)'} color={'white'} overlay/>} 
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container : {
        backgroundColor: '#F4EFE9',
        height: '100%'
    },  
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default Register;
