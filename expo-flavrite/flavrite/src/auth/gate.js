 import * as React from 'react'; // Import React and Component
 import { // Import required components
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import * as Font from 'expo-font';
import Async from '../utils/Async'; // Import Async Storage
import { StackActions } from '@react-navigation/native'; // Import Stack Actions


class Gate extends React.Component {

    constructor(props) 
    {
        super(props); // Call default constructor
        this.state = {  // Initialize state
            loading: true // Set loading to true
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

        await Async.getUserToken().then( async res => { // Get user token from async storage
            if(res && res.length) // If token is not null
            {
                const jumpToAction = StackActions.replace('MainStack'); // Navigate to MainStack
                this.props.navigation.dispatch(jumpToAction); // Dispatch navigation action
            }
            else 
            {
                this.setState({ // Set loading to false
                    loading: false // Set loading to false
                })
            }
        });
    }

    render()
    {
        return (
            <SafeAreaView style={[styles.container]}>
                {/* Safe Area View */}
                {
                    this.state.loading ? // If loading is true show splash image
                    (
                        <View className='h-full w-full items-center justify-center'>
                            <Image 
                               className='w-full h-full bg-transparent'
                                resizeMode={'cover'}
                                source={require('../assets/images/splash.png')} // Image Source
                            />
                        </View>
                    ) : // Else show login screen
                    (
                        <>
                            <View className='h-3/6 w-full bg-transparent overflow-hidden' style={[{ borderBottomLeftRadius: 80, borderBottomRightRadius: 80}]}>
                                <Image 
                                    className='w-full h-full bg-transparent'
                                    resizeMode={'cover'}
                                    source={require('../assets/images/login-girl.png')} // Image Source
                                />
                            </View>
                            <View className='h-4/6 w-full flex flex-col items-center px-10'>
                                {/* View Container */}
                                <View className='bg-white rounded-full -mt-10 items-center justify-center' style={{
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 3.84,
                                    elevation: 5
                                }}>
                                    <Image 
                                        className='h-[100] w-[100] rounded-full'
                                        resizeMode={'contain'}
                                        source={require('../assets/images/mainlogo.png')} // Image Source for logo
                                    />
                                </View>
                                {/* Text For Logo */}
                                <Text style={[
                                    {
                                        color: '#E76E50',
                                        fontFamily: 'Baloo2-Bold',
                                        fontSize: 55
                                    },
                                    className='font-bold'
                                ]}> 
                                    FLAVRITE
                                </Text>
                                {/* Catchy Text  */}
                                <Text className='text-sm text-center text-gray-600 leading-4'
                                style={{fontFamily: 'Baloo2-Bold'}}
                                  
                                >
                                    {`EXPLORE YOUR PERSONAL \n FLAVOR PROFILE`}
                                </Text>
                                <View className='flex flex-row items-center justify-center'>
                                    {/* Login View */}
                                    <TouchableOpacity
                                        // Sign in Button 
                                        className='border-0 rounded-full mt-10 mr-4  py-2 px-3'
                                        style={[ {
                                            backgroundColor: '#E76E50',
                                        }]}
                                        borderRadius={0}
                                        onPress={ _ => this.props.navigation.push('Login', { // Navigate to Login Screen
                                            label: 'Sign in' // Set label to Sign in
                                        })}
                                       // Set title to Sign in
                                    >
                                        <Text   className='text-center px-5 text-white' style={[
                                            {
                                                fontFamily: 'Baloo2-Bold',
                                            }
                                        ]}>Sign in</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        // Sign up Button
                                  
                                         className='border-0 rounded-full mt-10 py-2 px-3'
                                        style={[ {
                                            backgroundColor: '#E76E50',
                                        }]}
                                        borderRadius={0}
                                        onPress={ _ => this.props.navigation.push('Register', { // Navigate to Signup Screen
                                            label: 'Register' // Set label to Sign up
                                        })}
                                        title="Sign up" //  Set title to Sign up
                                    >
                                        <Text  className='text-center px-5 text-white' style={[
                                            {
                                                fontFamily: 'Baloo2-Bold',
                                            }
                                        ]}>Sign up</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className='flex flex-row w-full justify-between mt-3 hidden'>
                                    {/* Already a member View */}
                                    <TouchableOpacity 
                                        // Already a member Button / Login Button
                                    onPress={ _ => this.props.navigation.push('Login')} // Navigate to Login Screen
                                    className='text-base font-bold bg-transparent justify-center p-0 m-0'
                                    style={[{
                                        color: '#629DA3'
                                    }]}
                                    borderRadius={0}
                                    title="ALREADY A MEMBER?" // Set title to Already a member
                                    >
                                        <Text className='text-center w-full' style={[
                                            {
                                                fontFamily: 'Baloo2-Bold',
                                            },
                                            
                                        ]}>ALREADY A MEMBER?</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )
                }
               
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({ 
    container : { // Container Style
        backgroundColor: '#F3EEEA', // Background Color
        flex: 1 // Set flex to 1
    }, 
    sectionContainer: { // Section Container Style
        marginTop: 32, // Set marginTop to 32
        paddingHorizontal: 24, // Set paddingHorizontal to 24
    },
    sectionTitle: { // Section Title Style
        fontSize: 24, // Set fontSize to 24
        fontWeight: '600', // Set fontWeight to 600
    },
    sectionDescription: { // Section Description Style
        marginTop: 8, // Set marginTop to 8
        fontSize: 18, // Set fontSize to 18
        fontWeight: '400', // Set fontWeight to 400
    },
    highlight: { // Highlight Style
        fontWeight: '700', // Set fontWeight to 700
    },
});

export default Gate;
