import React from 'react'; // Import react
import { // Import react native components
    SafeAreaView,
    StyleSheet,   
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import URLS from '../utils/Url'; // Import URLS
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import ToasterLoader from '../utils/ToasterLoader'; // Import ToasterLoader


class ShowFlava extends React.Component { // ShowFlava class

    constructor(props) // Default constructor
    {
        super(props); // Call default constructor
        this.state = { // Initialize state
            user: null, // Initialize user
            loading: false, // Initialize loading
            toast: false, // Initialize toast
            toast_message: null, // Initialize toast message
            show: false, // Initialize show
            peoples: [ // Initialize peoples
                {
                    img: require('../assets/icons/peaple1.png'), // Set image for peaple
                    similarity: '93',
                    rank: '2',
                    notes: 'Caramel, Toffee',
                    city: 'Vancouver'
                },
                {
                    img: require('../assets/icons/peaple2.png'),
                    similarity: '43',
                    rank: '1',
                    notes: 'Caramel, Toffee',
                    city: 'Toronto'
                },
                {
                    img: require('../assets/icons/peaple3.png'),
                    similarity: '82',
                    rank: '40',
                    notes: 'Caramel, Toffee',
                    city: 'Spain'
                }
            ]
        }
    }

  

    render()
    {
        return (
            <SafeAreaView style={[styles.container]}>
                {/* Safe Area View */}
                <View className='flex justify-between items-center px-5 mb-3 w-full flex-row'>
                    <TouchableOpacity  
                        // Back Button
                        //size={Button.sizes.xsmall}
                        className='border-0 bg-transparent p-0 flex items-end justify-start'
                        borderRadius={0}
                        onPress={ _ => this.props.navigation.goBack() } // Go back on press   
                        >
                        <Ionicons name={'arrow-back-outline'} size={30} color={'gray'}/> {/* Back Icon */}
                    </TouchableOpacity>
                </View>
                <View className='w-full flex flex-col px-5'>
                    <View className='bg-white flex flex-col p-4 rounded-md items-center relative mb-5'>
                        <View className='absolute left-0 top-4 p-3 w-40 rounded-tr-xl rounded-br-xl'
                        style={ {
                            backgroundColor: '#F5F0EB'
                        }}>
                            <Text className='text-base font-bold'
                             style={ {color: '#4A4A4A'}}>
                                {this.props.route.params.item.name} {/** Product Name */} 
                            </Text>
                            <Text className='text-sm'
                            style={{color: '#4A4A4A'}}>
                                {this.props.route.params.item.brand.name} {/** Brand Name */}
                            </Text>
                        </View>
                        {
                            this.props.route.params.item.thumbnail ? // Check if thumbnail is not null 
                            (
                                <Image 
                                    resizeMode={'contain'}
                                    className='w-20 mt-20 h-28'
                                    source={{uri: URLS.PRODUCT_IMG+this.props.route.params.item.thumbnail}} // Set image source for product thumbnail
                                />
                            ) : // Else
                            (
                                <Image 
                                    resizeMode={'contain'}
                                    className='w-20 mt-20 h-28'
                                    source={require('../assets/icons/sample.jpeg')} // Set image source for product thumbnail
                                />
                            )
                        }
                        
                        <View className='mt-4'>
                            {/* <Text style={tailwind('text-center')}>
                                Your rate to this flava is
                            </Text>
                            <Text style={[tailwind('text-center text-4xl font-bold mt-6'), {
                                color: '#DE6466'
                            }]}>
                                75 
                            </Text>
                            <Text style={[tailwind('text-center text-sm -mt-1'), {
                                color: '#DE6466'
                            }]}>
                                Points 
                            </Text> */}
                            <TouchableOpacity 
                                onPress={ _ => this.props.navigation.navigate('ShowFlava', { // Navigate to ShowFlava screen
                                    item: this.props.route.params.item // Pass item as parameter to ShowFlava screen
                                })}
                                className='border-b bg-transparent mt-8'>
                                {/* <Text>
                                    Rate this Flava
                                </Text> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ToasterLoader 
                    loading={this.state.loading} // Set loading state
                    toast={this.state.toast} // Set toast state 
                    toast_message={this.state.toast_message} // Set toast message
                    toast_loader={this.state.toast_loader} // Set toast loader
                />
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container : {
        backgroundColor: '#494949',
        height: '100%', 
        flex: 1
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

export default ShowFlava; // Export ShowFlava class
