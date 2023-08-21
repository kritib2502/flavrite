//Line 89 is causing biiig errors, haven't been able to see if this tailwind stuff is even working
import React from 'react'; // Import react
import { // Import react native components
    SafeAreaView,
    StatusBar,
    StyleSheet,   
    View,
    Image,
    FlatList,
    Text,
    TouchableOpacity
} from 'react-native';
import { ListItem } from 'react-native-ui-lib';
import URLS from '../utils/Url'; // Import URLS
import HttpClient from '../utils/Api'; // Import HttpClient
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import Async from '../utils/Async'; // Import Async
import ToasterLoader from '../utils/ToasterLoader'; // Import ToasterLoader
import * as Font from 'expo-font';

class Search extends React.Component {

    constructor(props) // Default constructor
    {
        super(props); // Call default constructor
        this.state = { // Initialize state
            user: null, // Initialize user
            loading: true, // Define loading to true
            toast: false, // Define toast to false
            toast_message: null // Define toast message to null
        }
    }

    async componentDidMount() // On component mount
    {
        await Font.loadAsync({
            'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
            'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
            'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
          });
          // Set fontLoaded state to true
          this.setState({ fontLoaded: true });

        // GET USER INFORMATION
        await HttpClient({ 
            url : URLS.GET_USER // Define URL to get user information from API
        }).then( async res => { // Get response from API
            if(res.status == 200) // If status is 200 (OK)
            {
                this.setState({ // Set state
                    loading: false, // Set loading to false
                    user: res.data, // Set user to response data
                    name: res.data.name // Set name to response data name
                })
            }
        })
    }

    renderRow(row, id) { // Render row function
        return (
            <View className='border-b border-gray-300 px-5 py-2'>
                <ListItem
                // @ts-expect-error
                //   activeBackgroundColor={Colors.grey60}
                    activeOpacity={0.3}
                    height={77.5}
                    onPress={() => alert(`pressed on order #${id + 1}`)} // Alert user when pressed on order number id + 1
                >
                    <ListItem.Part left>
                    <Image 
                        source={{uri: row.icon}}  // Set image source to row icon 
                        className='w-16 h-16'
                        resizeMode={'contain'} />
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={[{paddingLeft: 17}]}>
                        <ListItem.Part containerStyle={[{marginBottom: 3}, className='flex flex-col items-start']}>
                            <Text className='text-lg' style={[{fontFamily: 'Baloo2-Regular'}]}>{row.name}</Text>
                            <Text className='text-gray-500'>{row.description} </Text>
                        </ListItem.Part>
                    </ListItem.Part>
                    <ListItem.Part right>
                        <Ionicons name={'chevron-forward-outline'} size={30} color={'#02BDD6'}/>
                    </ListItem.Part>
                </ListItem>
            </View>
        );
    }

    render()
    {
        const searchTitle = "Search"
        return (
            // SafeAreaView is used to render content within the safe area boundaries of a device
            <SafeAreaView style={[styles.container]}>
                <StatusBar /> 
                <View className='flex justify-between items-center px-5 w-full flex-row'>
                    <TouchableOpacity
                        // Back button to go back to previous screen
                        //size={Button.sizes.xsmall}
                        className='border-0 bg-transparent p-0 flex items-end justify-start'
                        title="Back"
                        borderRadius={0}
                        onPress={ _ => this.props.navigation.goBack() }     // Go back to previous screen
                    >
                        <Ionicons name={'arrow-back-outline'} size={30} color={'#02BDD6'}/>
                    </TouchableOpacity>
                </View>
                <View className='flex flex-col justify-center items-center px-5 mb-10 mt-5 w-full'>
                    <Text className='text-3xl font-bold w-full text-center' style={[{color: '#E16160',fontFamily: 'Baloo2-Regular'}]}>{searchTitle}</Text>
                    <Text className='text-sm font-bold text-center' style={[{fontFamily: 'Baloo2-Regular'}]}>Search result</Text>
                </View>
                <View className='w-full flex flex-col bg-white'>
                    <FlatList 
                    // FlatList is a component that helps you render a list of items 
                        data={[ // Data to be rendered in FlatList
                            {
                                name: 'Coffee Green Big',
                                description: 'dark chocklate',
                                icon: 'http://127.0.0.1:8000/storage/products/1.jpg'
                            },
                            {
                                name: 'Milk Big',
                                description: 'White Roast',
                                icon: 'http://127.0.0.1:8000/storage/products/2.jpg'
                            },
                            {
                                name: 'Coffee Big',
                                description: 'chocklate',
                                icon: 'http://127.0.0.1:8000/storage/products/3.jpg'
                            }
                        ]}
                        renderItem={({item, index}) => this.renderRow(item, index)} // Render row function to render each row in FlatList 
                        keyExtractor={this.keyExtractor} // Key extractor function to extract key from each row in FlatList
                    />
                </View>
                <ToasterLoader 
                    loading={this.state.loading} // Set loading to state loading
                    toast={this.state.toast} // Set toast to state toast
                    toast_message={this.state.toast_message} // Set toast message to state toast message
                    toast_loader={this.state.toast_loader} // Set toast loader to state toast loader
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

export default Search;
