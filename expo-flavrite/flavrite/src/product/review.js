import React from 'react'; // Import react
import { // Import react native components
    ScrollView,
    SafeAreaView,
    StatusBar,
    StyleSheet,   
    View,
    Text,
    Button,
    Image,
    TouchableOpacity
} from 'react-native';

import URLS from '../utils/Url'; // Import URLS
import HttpClient from '../utils/Api'; // Import HttpClient
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import Async from '../utils/Async'; // Import Async Storage
import ToasterLoader from '../utils/ToasterLoader'; // Import ToasterLoader


// const audioRecorderPlayer = new AudioRecorderPlayer();

class ReviewFlava extends React.Component {

    constructor(props) // Default constructor
    {
        super(props); // Call default constructor
        this.state = { // Initialize state
            user: null, // Initialize user
            loading: false, // Set loading to false
            toast: false, // Set toast to false
            toast_message: null, // Set toast message to null
            show: false, // Set show to false
            questions: [ // Set questions array
                {
                    question: 'Was it Nutty, Caramel-like?',
                    buttons: [
                        "Yes. These flavors were really distinct.",
                        "No. I did'nt discern these flavors.",
                        "Sort Of. These flavors were really distinct."
                    ],
                    type: 1
                },
                {
                    question: 'What other flavors did you pick up on?',
                    buttons: [
                        "Peach",
                        "Straw",
                        "Rubber",
                        "Other",
                        "Banana",
                        "Other"
                    ],
                    type: 2,
                    description: "(What was the most dominant flavor)"
                },
                {
                    question: 'Was it Nutty, Caramel-like?',
                    description: "(What was the most dominant flavor)",
                    buttons: [
                        "Yes. These flavors were really distinct.",
                        "No. I did'nt discern these flavors.",
                        "Sort Of. These flavors were really distinct."
                    ],
                    type: 1
                }
            ]
        }
    }

    async componentDidMount()
    {
        // GET USER INFORMATION
       
    }

    renderRow = (item, index) => { // Render row function 
        return (
            
            <View 
                key={index} // Set key to index 
                className='px-5 py-2 relative'>
                <View 
                    className='rounded-lg bg-white p-3 overflow-hidden mb-2'>
                    <Text className='text-gray-600'>
                        {item.question}
                    </Text>
                    {
                        item.description ? // If item.description is not null
                        (
                            <Text className='text-gray-400 mt-1'>
                                {item.description}
                            </Text>
                        ) : null // Else null
                    }
                </View>
                <View className='px-1'>
                    {
                        item.type == 1 ? // If item.type is 1
                        (
                            <>
                                {
                                    item.buttons.map((item, btn_key) => ( // Map item.buttons to item and btn_key
                                        <TouchableOpacity 
                                            key={btn_key} // Set key to btn_key
                                            borderRadius={10} 
                                            title={item} // Set title to item
                                            className='bg-transparent mb-2 border border-white'
                                            style={[{
                                                backgroundColor: '#5E9CA6'
                                            }]}    
                                        >
                                            <Text className='text-white font-bold'>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </>
                        ) : null // Else null
                    }
                    {
                        item.type == 2 ? // If item.type is 2
                        (
                            <View className='flex flex-row flex-wrap'>
                                {
                                    item.buttons.map((item, btn_key) => ( // Map item.buttons to item and btn_key
                                        <TouchableOpacity 
                                            key={btn_key} // Set key to btn_key
                                            borderRadius={10}
                                            className='w-1/2 px-1 py-0 bg-transparent'
                                            title={item}    // Set title to item
                                        >
                                            <View
                                                className='w-full rounded-lg bg-transparent p-3 mb-2 border border-white' 
                                                style={[{
                                                    backgroundColor: '#5E9CA6'
                                            }]}>
                                                <Text className='text-white font-bold'>
                                                    {item}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        ) : null // Else null
                    }
                    {
                        item.type == 'six' ? // If item.type is six
                        (
                            <View className='flex flex-row flex-wrap'>
                                {
                                    item.buttons.map((item, btn_key) => ( // Map item.buttons to item and btn_key
                                        <TouchableOpacity 
                                            key={btn_key} // Set key to btn_key
                                            borderRadius={10}
                                            className='w-1/2 px-1 py-0 bg-transparent'
                                            title={item}    // Set title to item
                                        >
                                            <View 
                                                className='w-full rounded-lg bg-transparent p-3 mb-2 border border-white'
                                                style={[{
                                                backgroundColor: '#5E9CA6'
                                            }]}  >
                                                <Text className='text-white font-bold'>
                                                    {item} 
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        ) : null // Else null
                    }
                </View>
                <View 
                    
                    className='w-3 h-3 absolute top-4 left-4' 
                    style={[{transform: [{ rotate: '45deg'}]}]}></View>
            </View>
        )
    }

    render() // Render function
    {
        return (
            // SafeAreaView to render content within safe area boundaries of iOS and Android
            <SafeAreaView style={[styles.container]}>
                <StatusBar />
                <View className='flex justify-between items-center px-5 mb-4 w-full flex-row'>
                    <TouchableOpacity  
                        // Back button 

                        //size={Button.sizes.xsmall}
                        className='border-0 bg-transparent p-0 flex items-end justify-start'
                        title='Back' // Set title to Back
                        borderRadius={0}
                        onPress={ _ => this.props.navigation.goBack() } // Go back to previous screen on press    
                    >
                        <Ionicons name={'arrow-back-outline'} size={30} color={'gray'}/>
                    </TouchableOpacity>
                </View>
                <ScrollView
                >
                    <View className='w-full flex flex-col px-5'>
                        <View className='bg-white p-4 h-40 rounded-md relative mb-5'>
                            <View
                               className='absolute left-0 top-4 p-3 w-40 rounded-tr-xl rounded-br-xl'
                                style={[{
                                backgroundColor: '#F5F0EB'
                            }]}>
                                <Text 
                                    className='text-base font-bold'
                                    style={[{color: '#4A4A4A'}]}>
                                    49th Paralle
                                </Text>
                                <Text
                                    className='text-sm' 
                                    style={[{color: '#4A4A4A'}]}>
                                    Dark Roast
                                </Text>
                            </View>
                            <Image 
                                resizeMode={'contain'}
                                className='w-20 absolute top-6 right-8 h-28'
                                source={require('../assets/icons/package.png')} // Set image source to package.png
                            />
                            <View className='absolute bottom-3 left-0 pl-3 flex-row items-start'>
                                <Text className='text-xl font-bold mr-2'> 
                                    350
                                </Text>
                                <Text>
                                    People Like this
                                    {`\n`}
                                    Flava
                                </Text>
                            </View>
                        </View>
                    </View>
                    {
                        this.state.questions.map((item ,index) => ( // Map this.state.questions to item and index
                            this.renderRow(item, index) // Render row with item and index
                        )) 
                    }

                </ScrollView>
                <ToasterLoader 
                    loading={this.state.loading} // Set loading to this.state.loading
                    toast={this.state.toast} // Set toast to this.state.toast
                    toast_message={this.state.toast_message} // Set toast_message to this.state.toast_message
                    toast_loader={this.state.toast_loader} // Set toast_loader to this.state.toast_loader
                />
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container : {
        backgroundColor: '#494949',
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

export default ReviewFlava;
