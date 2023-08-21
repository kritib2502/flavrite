// Importing necessary modules from 'react-native'
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,   
  View,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput
} from 'react-native';

// Importing custom modules
import URLS from '../utils/Url';
import HttpClient from '../utils/Api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Async from '../utils/Async';
import ToasterLoader from '../utils/ToasterLoader';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { SecureStore } from 'expo';

// Defining the class component 'Profile'
class Profile extends React.Component {

    constructor(props) // Initializing the state of the component
    {
        super(props); // Calling the constructor of the parent class
        this.state = { // Initializing the state
            user: { // Initializing the user object
                avatar: null, // Initializing the avatar of the user
               
                about: null, // Initializing the about of the user
            },
            name: null,
            loading: true, // Initializing the loading state
            toast: false, // Initializing the toast state
            toast_message: null, // Initializing the toast message
            about: '', // Initializing the about of the user
            modal_visibility: false, // Initializing the modal visibility state
        }
    }


    async componentDidMount() // Component did mount function
    {
        await Font.loadAsync({ // Loading the fonts
            'Baloo2-Bold'     : require('../assets/fonts/Baloo2-Bold.ttf'), // Loading the Baloo2-Bold font
            'Baloo2-Regular'  : require('../assets/fonts/Baloo2-Regular.ttf'), // Loading the Baloo2-Regular font
            'DaysOne-Regular' : require('../assets/fonts/DaysOne-Regular.ttf') // Loading the DaysOne-Regular font
          });
          // Set fontLoaded state to true
          this.setState({ fontLoaded: true });

        // GET USER INFORMATION
        await HttpClient({ 
            url : URLS.GET_USER // Setting the url
        }).then( async res => { // Getting the response
            if(res.status == 200) // If the status is 200
            {
                this.setState({ // Setting the state
                    user: res.data, // Setting the user
                    name: res.data.name, // Setting the name
                    loading: false, // Setting the loading state
                    about: res.data.about ?? '' // Setting the about
                })
            }
        })
    }

    async update_profile() // Update profile function
    {
        // GET USER INFORMATION
        Keyboard.dismiss(); // Dismissing the keyboard
        this.setState({ // Setting the state
            toast: true, // Setting the toast state
            toast_message: 'Updating Profile ...', // Setting the toast message
            toast_loader: true // Setting the toast loader
        })
        await HttpClient({  // Calling the HttpClient function
            url : URLS.GET_USER, // Setting the url
            data: { // Setting the data
                name: this.state.name, // Setting the name
                instagram: this.state.instagram, // Setting the instagram
                twitter: this.state.twitter, // Setting the twitter
                about: this.state.about // Setting the about
            }
        }, 'POST').then( async res => { // Getting the response from the server
            if(res.status == 200) // If the status is 200
            {
                this.setState({ // Setting the state
                    toast_message: 'Profile Updated!', // Setting the toast message
                    toast_loader: false // Setting the toast loader
                })
                setTimeout(_=> this.setState({ // Setting the state
                    toast: false // Setting the toast state
                }), 2000) // Setting the timeout
            }
        })
    }

    async delete_profile() // Delete profile function
    {
        // GET USER INFORMATION
        // Keyboard.dismiss();
        this.setState({ // Setting the state
            modal_visibility: false // Setting the modal visibility state
        })
        await HttpClient({  // Calling the HttpClient function
            url : URLS.DELETE_USER // Setting the url
        }, 'POST').then( async res => { // Getting the response from the server
            if(res.status == 200) // If the status is 200
            {
                await Async.removeUserToken().then( res => { // Removing the user token
                    if( res ) // If the response is true
                    {
                        this.props.navigation.navigate('Gate'); // Navigate to the Gate screen
                    }
                });
            }
        })
    }

    async selectFile() { // Select file function

        this.setState({ // Setting the state
            toast: true, // Setting the toast state
            toast_message: 'Uploading Avatar ...', // Setting the toast message
            toast_loader: true // Setting the toast loader
        })

        var options = { // Setting the options
    
            title: 'Select Image', // Setting the title
    
            customButtons: [ // Setting the custom buttons
    
            { 
    
                name: 'customOptionKey',  
    
                title: 'Choose file from Custom Option' 
    
            },
    
            ],
    
            storageOptions: {
    
                skipBackup: true,
    
                path: 'images'
    
            },

            includeBase64: true,
            maxWidth: 800,
            maxHeight: 800

    
        };
    
        launchImageLibrary(options, async res => { // Launching the image library
            // console.log('Response = ', res);
    
            if (res.didCancel) { // If the user cancelled the image picker
    
                // console.log('User cancelled image picker'); // Log the message
    
            } else if (res.error) { // If there is an error
    
                // console.log('ImagePicker Error: ', res.error); // Log the error
     
            } else if (res.customButton) { //  If the user tapped a custom button
    
                // console.log('User tapped custom button: ', res.customButton); // Log the message
     
                alert(res.customButton); // Alert the message to the user
    
            } else { // If everything is fine
    
                let source = res; // Setting the source
    
                this.setState({ // Setting the state
    
                resourcePath: source, // Setting the resource path
    
            });

            let token = await SecureStore.getItemAsync('utk'); // Getting the token
            let formData = new FormData(); // Creating a new form data
            formData.append('avatar', { // Appending the avatar
            uri: this.state.resourcePath.assets[0].uri, // Setting the uri
            name: 'avatar.png', // Setting the name
            type: 'image/png', // Setting the type
            });

            fetch(URLS.UPLOAD_PROFILE_IMG, { // Fetching the url
            method: 'POST', // Setting the method
            headers: {
                Authorization: `Bearer ${token}`, // Setting the authorization
                'Content-Type': 'multipart/form-data', // Setting the content type
            },
            body: formData, // Setting the body
            })
            .then((response) => { 
            // handle success
            })
            .catch((error) => {
            // handle error
            });
          }
    
        });
    
    };

    async logOut() // Log out function
    {
        await Async.removeUserToken().then( res => { // Removing the user token
            if( res ) // If the response is true
            {
                this.props.navigation.navigate('Gate'); // Navigate to the Gate screen
            }
        });
    }

    share() // Share function
    {
        Share.open({ // Opening the share
            message: 'Hey! I am using this awesome app called "Flavrite" to connect with people around the world. Download it now from the link below. https://flavrite.com',
        })
        .then((res) => { // Getting the response
            // console.log(res); 
        })
        .catch((err) => { // Getting the error
            err && console.log(err);
        });
    }

    render()
    {
        return (
            // Safe area view 
                <SafeAreaView style={[styles.container]}>
                {/* Show status bar */}
                <StatusBar />
                <ScrollView>
                    {/* Back Button View */}
                    <View className='flex justify-between items-center px-4 mb-10 w-full flex-row'>
                        <TouchableOpacity  
                            //size={Button.sizes.xsmall}
                            className='border-0 bg-transparent p-0 flex items-center flex-row'
                            style={[{
                                zIndex: 999
                            }]}
                            borderRadius={0}
                            onPress={ _ => this.props.navigation.goBack() }    
                        >
                            <Ionicons name={'chevron-back-outline'} size={30} color={'#000'}/>
                            <Text className='text-base' style={[{fontFamily: 'Baloo2-Bold',color: '#000'}]}>Back</Text>
                        </TouchableOpacity>
                        {/* Share Button */}
                        <TouchableOpacity  
                            // size={Button.sizes.xsmall}
                            className='border-0 rounded-md bg-transparent p-0 flex items-center justify-start bg-gray-200 px-3 py-1' 
                            style={[{
                                zIndex: 999
                            }]}
                            onPress={ _ => this.share() }    
                        ><Text className='text-base' style={[{fontFamily: 'Baloo2-Bold',color: '#264552'}]}>Share with your friends</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Profile View */}
                    <View className='w-full flex flex-col px-5'>
                        <View className='mb-4 border-b pb-3 border-gray-300'>
                            <View className='flex items-center justify-center'>
                                {
                                    this.state.resourcePath || this.state.user.avatar ? // If the resource path or user avatar is not null
                                    (
                                        // Show the image 
                                        <View className='flex flex-col items-center justify-center'>
                                            {
                                                this.state.resourcePath ? // If the resource path is not null
                                                (
                                                    <Image 
                                                         className='w-full rounded-full w-24 h-24 mb-3 border'
                                                        source={{uri: 'data:image/png;base64,'+this.state.resourcePath.assets[0].base64}} 
                                                    />
                                                ) : // Else show the user avatar
                                                (
                                                    <Image 
                                                        className='w-full rounded-full w-24 h-24 mb-3 border'
                                                        resizeMode={'cover'}
                                                        source={{ uri: URLS.PROFILE_IMG+this.state.user.avatar}} 
                                                    />
                                                )
                                            }
                                            {/* Choose Avatar Button */}
                                            <TouchableOpacity  
                                                // size={Button.sizes.xsmall}
                                                className='justify-center items-center mb-10 bg-transparent text-center'
                                                borderRadius={0}
                                                onPress={ _ => this.selectFile() }    
                                            ><Text className='text-black text-xs'>Choose Avatar Image</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : // Else show the default image
                                    (
                                        <TouchableOpacity  
                                            // size={Button.sizes.xsmall}
                                            className='rounded-full w-24 h-24 border border-black justify-center items-center mb-10 bg-transparent text-center'
                                            borderRadius={0}
                                            onPress={ _ => this.selectFile() }    
                                        ><Text className='text-black text-xs text-center'>Choose Avatar</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View> 
                            <Text className='text-left px-2' style={[{fontFamily: 'Baloo2-Bold',color: '#000'}]}>Fullname</Text>
                            {/* Fullname Text Input */}
                            <TextInput
                                placeholder={'Fullname'}
                                className='rounded-md m-0 '
                                style= {[{
                                    fontFamily: 'Baloo2-Bold',
                                    
                                }]}
                                floatingPlaceholder
                                floatingPlaceholderColor={'#000'}
                                
                                backgroundColor={'#F4EFE9'}
                                underlineColor={'#000'}
                                value={this.state.name}
                                onChangeText={ text => this.setState({
                                    name: text
                                })}
                            />
                            {/* Email Text Input */}
                            <TextInput
                                placeholder={'Email'}
                                className='rounded-md m-0 my-2' 
                                style={[{
                                     fontFamily: 'Baloo2-Bold',
                                }]}
                                floatingPlaceholder
                                color={'#D1D1D1'}
                                backgroundColor={'#F4EFE9'}
                                value={this.state.user ? this.state.user.email : null}
                                editable={false}
                            />
                            {/* Instagram Link  */}
                            <TextInput
                                placeholder={'Instargram link'}
                                className='rounded-md m-0 my-2'
                                style={[ {
                                     fontFamily: 'Baloo2-Bold'
                                }]}
                                floatingPlaceholder
                                floatingPlaceholderColor={'#000'}
                                color={'#000'}
                                backgroundColor={'#F4EFE9'}
                                underlineColor={'#000'}
                                value={this.state.user ? this.state.user.instagram : null}
                                onChangeText={ text => this.setState({
                                    instagram: text
                                })}
                            />
                            {/* Twitter Link */}
                            <TextInput
                                placeholder={'Twitter Link'}
                                className='rounded-md m-0 my-2' 
                                style={[{
                                     fontFamily: 'Baloo2-Bold'
                                }]}
                                floatingPlaceholder
                                floatingPlaceholderColor={'#000'}
                                color={'#000'}
                                backgroundColor={'#F4EFE9'}
                                underlineColor={'#000'}
                                value={this.state.user ? this.state.user.twitter : null}
                                onChangeText={ text => this.setState({
                                    twitter: text
                                })}
                            />
                            {/* Profile Description */}
                            <TextInput
                                placeholder={'Profile description (about)'}
                                className='rounded-md m-0 my-2'
                                style={[ {
                                     fontFamily: 'Baloo2-Bold'
                                }]}
                                floatingPlaceholder
                                floatingPlaceholderColor={'#000'}
                                color={'#000'}
                                backgroundColor={'#F4EFE9'}
                                underlineColor={'#000'}
                                value={this.state.about}
                                onChangeText={ text => {
                                    if(this.state.about.length < 250)
                                    {
                                        this.setState({
                                            about: text
                                        })
                                    }
                                }}
                                multiline={true}
                            />
                            <Text className='-mt-6 mb-4 my-2'>({this.state.about.length}/250)</Text>
                            {/* Update Profile Button */}
                            <TouchableOpacity  
                                // size={Button.sizes.xsmall}
                                borderRadius={8}
                                className='border-0 rounded-md flex items-end bg-orange justify-start p-2 py-4 text-center'
                                style={[{
                                    backgroundColor: '#df6060'
                                }]}
                                onPress={ _ => this.update_profile() }    
                            ><Text className='w-full text-center text-white'>Update Profile</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Sign Out Button */}
                        <TouchableOpacity  
                            // size={Button.sizes.xsmall}
                            borderRadius={8}
                            className='border-0 rounded-md flex items-end bg-gray-700 justify-start p-2 py-4 text-center' 
                            style={[{
                                backgroundColor: '#264552'
                            }]}
                            onPress={ _ => this.logOut() }    
                        ><Text className='w-full text-center text-white'>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Delete Account Button */}
                    <View className='w-full px-5 mt-5 border-t py-5 border-gray-300'>
                        <TouchableOpacity  
                            // size={Button.sizes.xsmall}
                            borderRadius={8}
                            className='border-0 rounded-md p-0 flex items-end bg-black justify-start py-4 text-center'
                            onPress={ _ => this.setState({
                                modal_visibility: true
                            }) }    
                        ><Text className='w-full text-center text-white'>Delete My Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {/* Delete Account Modal */}
                <Modal visible={this.state.modal_visibility} onBackgroundPress={() => this.setState({
                    modal_visibility: false
                })}>
                    <View className='h-full items-center justify-center px-10'>
                        <Text>Are you sure want to delete this account?</Text>
                        <View>
                            <TouchableOpacity
                                // size={Button.sizes.xsmall}
                                borderRadius={8}
                                className='my-5 mt-8 rounded-md border-0 flex items-end bg-red-500 justify-start p-2 py-4 text-center'
                                onPress={ _ => this.delete_profile() }><Text className='w-full text-center text-white'>Yes, Delete My Account</Text>     
                            </TouchableOpacity>
                            <TouchableOpacity
                                // size={Button.sizes.xsmall}
                                borderRadius={8}
                                className='border-0 rounded-md flex items-end bg-green-500 justify-start p-2 py-4 text-center'
                                onPress={ _ => this.setState({
                                    modal_visibility: false
                                }) }    
                            ><Text className='w-full text-center text-white'>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {/* Toaster Loader */}
                <ToasterLoader 
                    loading={this.state.loading}
                    toast={this.state.toast}
                    toast_message={this.state.toast_message}
                    toast_loader={this.state.toast_loader}
                />
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

export default Profile;
