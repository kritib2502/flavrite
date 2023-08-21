import * as React from 'react'; // Import React
import { // Import React Native Components
    SafeAreaView,
    StyleSheet,
    View,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Linking,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Font from 'expo-font';
import Toast from 'react-native-toast-message'; // Import Toast
import HttpClient from '../utils/Api'; // Import HttpClient
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for storing user token
import Async from '../utils/Async'; // Import Async Storage
import URLS from '../utils/Url'; // Import URLS
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import jwt_decode from 'jwt-decode'; // Import jwt-decode
import * as RootNavigation from '../../RootNavigation'; // Import Root Navigation
import { LoaderScreen } from 'react-native-ui-lib'; // Import Loader Screen
import axios from 'axios';
export class LoginTest extends React.Component {
    constructor(props) // Default Constructor
    {
        super(props); // Call default constructor
        this.state = { // Initialize state
            showToast: false, // Defining Toast State
            loading: false, //  Defining Loading State
            email: '', //  Defining Email State
            password: '', //  Defining Password State
            textToast: '', // Defining Toast Text State
            success: '' //  Defining Success State
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

    async submit() // Submit Function
    {
        Keyboard.dismiss() // Dismiss Keyboard
        if(!this.state.email.length) // If email is empty
        {
            this.setState({ // Set Toast State
                showToast: true,  // Set Toast State to true
                textToast: 'Enter Email' // Set Toast Text State to 'Enter Email'
            })
            return false; // Return false
        }

        if(!this.state.password.length) // If email is empty
        {
            this.setState({ // Set Toast State
                showToast: true,  // Set Toast State to true
                textToast: 'Enter Password' // Set Toast Text State to 'Enter Email'
            })
            return false; // Return false
        }
        // this.setState({ // Set Loading State
        //     loading: true // Set Loading State to true
        // })
        await HttpClient({ // Call HttpClient
            url : URLS.OAUTH_LOGIN, // Set URL to FAST_GATE
            data : { // Set Data
                email: this.state.email, // Set Email
                password: this.state.password // Set Password
            }
        }, 'POST', false).then( async res => { // Call HttpClient
            this.setState({ // Set Loading State
                success : res.data, // Set Success State
                loading: false // Set Loading State
            })
            const jsonValue = JSON.stringify(res.data);
            await SecureStore.setItemAsync('token', jsonValue); // Set Token
            this.props.navigation.push('DrawerStack') // Navigate to Explore Screens
        }).catch( error => { // Catch Error
            this.setState({ // Set Loading State
                textToast: error.message, // Set Toast Text State
                loading: false, // Set Loading State
                showToast: true // Set Toast State
            })
        })

    }

    //console.log(AsyncStorage.getItemAsync('token')) // Get Token
    //359|PHJ9LXLhrBTuQvQiJBQagObJu83VLh7yB0guifSt
    //16|cGF1AQ1vc2FDtJ6EGVVdLtmOEhmJ6GrGBeZzhdCS


    render() {
        return (
        // Define Safe Area View
        <SafeAreaView  className='justify-center' style={[styles.container]}>
        <View className='absolute top-14 flex justify-between items-center px-5 mb-10 w-full flex-row'>
            {/* Container View */}
            <TouchableOpacity
                // Back Button
                className='border-0 bg-transparent p-0 flex items-center flex-row'
                borderRadius={0}
                onPress={ _ => this.props.navigation.goBack() }>
                    <Ionicons name={'chevron-back-outline'} size={30} color={'#333'}/>
                    <Text style={[{ fontFamily: 'Baloo2-Bold', color: '#333' }]} className='text-base'>Back</Text>
            </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} // Behavior of Keyboard Avoiding View on IOS and Android
        >
            <View className='w-full flex p-8'>
                {/* Container View */}
                <View className='flex items-center justify-center mb-10'> 
                    <Text style={[{ color: '#E76E50', fontFamily: 'Baloo2-Bold', fontSize: 50 }]}>FLAVRITE</Text>
                    <Text className='text-base text-center text-gray-600 pt-2 leading-4' style={{fontFamily: 'Baloo2-Bold'}}>EXPLORE YOUR PERSONAL {'\n'} FLAVOUR PROFILE</Text>
                </View>
                {
                    this.state.success ? // If Success State is true
                    (
                        <Text className='text-base text-center text-green-600'>{this.state.success}</Text>
                    ) : // Else 
                    (
                        <View className='w-full mt-4'>
                            <TextInput
                                placeholder={'Email'}
                                className='border-2 border-gray-500 rounded-md m-0 p-2'
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
                                // Submit Button
                                className='border-0 w-full rounded-full p-2 mt-6'
                                style={[{
                                    backgroundColor: '#E76E50',
                                }]}
                                borderRadius={0}
                                onPress={ _ => this.submit()} // Submit Function on Press
                            >
                                <Text className='text-center w-full text-white' style={[{ fontFamily: 'Baloo2-Bold'}]}>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                
                <View className='border-t border-gray-300 pt-5 mt-5 items-center'>
                    {/* Login with Google View */}
                    <TouchableOpacity
                        // Login with Google Button 
                        className='border-0 rounded-md justify-center py-4 flex flex-row'
                        style={[{
                            backgroundColor: '#fff',
                            paddingHorizontal: 8
                        }]}
                        borderRadius={0}
                        onPress={ () => { Linking.openURL('https://api.flavrite.com/g/redirect') }} // Login with Google Function on Press
                    >

                        <Ionicons name={'logo-google'} marginTop={2} size={13} color={'#000'}/>
                        <Text className='text-center text-black ml-1' style={[{color: '#000', fontWeight: '600'}]}>Sign in with Google</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                    onPress={ _ => this.getDecodedToken()}
                    >
                        <Text>Token</Text>
                    </TouchableOpacity> */}
                </View>

                <View className='pt-5 items-center'>
                    {/* Login with Apple View */}
                    {Platform.OS === 'ios' && (
                    <TouchableOpacity
                        // Login with Apple Button 
                        className='border-0 rounded-md justify-center py-4 flex flex-row'
                        style={[{
                            backgroundColor: '#fff',
                            paddingHorizontal: 8
                        }]}
                        borderRadius={0}
                        onPress={ () => onAppleButtonPress()}
                    >
                        <Ionicons name={'logo-apple'} marginTop={2} size={13} color={'#000'}/>
                        <Text className='text-center text-black ml-1' style={[{color: '#000', fontWeight: '600'}]}>Sign in with Apple</Text>
                    </TouchableOpacity>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>

        {/* Toast View */}
        <Toast
            visible={this.state.showToast} // Toast State Visible or Not
            position={'bottom'}  // Toast Position
            backgroundColor={'#E16160'} // Toast Background Color
            message={this.state.textToast} // Toast Message
            onDismiss={ _ => this.setState({ // On Dismiss Function
                showToast: false // Set Toast State False
            })}
            autoDismiss={3000} // Toast Auto Dismiss Time

        />

        {this.state.loading && <LoaderScreen backgroundColor={'rgba(0,0,0,.4)'} color={'white'} overlay/>}
        </SafeAreaView>
    )
  }
}

async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
  
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        const { email, email_verified, is_private_email, sub } = jwt_decode(appleAuthRequestResponse.identityToken)
        if(appleAuthRequestResponse.fullName.givenName)
        {
            await HttpClient({ 
                url : URLS.OAUTH_LOGIN,
                data : {
                    email: appleAuthRequestResponse.email,
                    name: appleAuthRequestResponse.fullName.givenName+' '+appleAuthRequestResponse.fullName.familyName
                }
            }, 'POST', false).then( async res => {
                Async.setUserToken(JSON.stringify(res.data));
                RootNavigation.navigate('MainStack');

            });
        }
        else 
        {
            let jwt_temp = jwt_decode(appleAuthRequestResponse.identityToken)
            await HttpClient({
                url : URLS.OAUTH_FAST_LOGIN,
                data : {
                    email: jwt_temp.email,
                }
            }, 'POST', false).then( async res => {
                // console.log(res.data)
                Async.setUserToken(JSON.stringify(res.data));
                RootNavigation.navigate('MainStack');

            });
        }
    }
}

function AppleMainButton({ type}) {
    useEffect(() => {
        // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
        return appleAuth.onCredentialRevoked(async () => {
            console.warn('If this function executes, User Credentials have been Revoked');
        });
    }, []);
    return (
        <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={type == 'Sign in' ? AppleButton.Type.SIGN_IN : AppleButton.Type.SIGN_UP}
            style={{
            width: 160, // You must specify a width
            height: 45, // You must specify a height
            }}
            onPress={() => onAppleButtonPress()}
        />
    );
}

const styles = StyleSheet.create({ 
    container : { // Container Style
        backgroundColor: '#F3EEEA', // Background Color
        height: '100%' // Height
    },  
    sectionContainer: { // Section Container Style
        marginTop: 32, // Margin Top
        paddingHorizontal: 24, // Padding Horizontal
    },
    sectionTitle: { // Section Title Style
        fontSize: 24, // Font Size
        fontWeight: '600', // Font Weight
    },
    sectionDescription: { // Section Description Style
        marginTop: 8, // Margin Top
        fontSize: 18, // Font Size
        fontWeight: '400', // Font Weight
    },
    highlight: { // Highlight Style
        fontWeight: '700', // Font Weight
    },
});

export default LoginTest