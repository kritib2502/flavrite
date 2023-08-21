import React from 'react'; // import React
import {
  StyleSheet,   
  View,
  Image,
  ScrollView,
  StatusBar,
  Linking,
  Text,
  ListItem,
  TouchableOpacity,
} from 'react-native'; // import React Native components
import { SafeAreaView } from 'react-native-safe-area-context'; // import Safe Area View 
// import tailwind from 'tailwind-rn';
import URLS from '../utils/Url'; // import URLS for API
import HttpClient from '../utils/Api';  // import API Client
import Ionicons from 'react-native-vector-icons/Ionicons';  // import Ionicons
import AntDesign from 'react-native-vector-icons/AntDesign'; // import AntDesign
import Async from '../utils/Async'; // import Async Storage
import ToasterLoader from '../utils/ToasterLoader'; // import Toaster Loader
import * as Font from 'expo-font';  // import Font
import { LinearGradient } from 'expo-linear-gradient';
import { LoaderScreen,ScrollBar } from 'react-native-ui-lib';
import WishList from '../wishlist/list';  // import WishList
import Like from './likes';  // import Like
import CircularProgress from 'react-native-circular-progress-indicator';  // import Circular Progress Indicator
import uuid from 'react-native-uuid';  // import UUID for keys
import { avatarImage, avatarImageWhite } from '../components/SwitchCase';

class UserProfile extends React.Component { // export Profile class

    constructor(props) // constructor with props
    {
        super(props); // super props to constructor 
        this.state = { // state variables
            user: null, // user state
            loading: true, // loading state
            toast: false, // toast state
            toast_message: null, // toast message state
            categories: [], // categories state
            wishlist_loading: false, // wishlist loading state
            wishlist: [],  // wishlist state
            people: [], // people state
            user: { name: ''}, // user state
            me: null, // me state
            selectedCategory: 1, // selected category state
            likes: [] // likes state
        }
    }

    async componentDidMount() // on component mount function
    {
        await Font.loadAsync({ // load fonts async function 
            'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'), // load Baloo2-Bold font
            'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'), // load Baloo2-Regular font
            'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf') // load DaysOne-Regular font
          });
          // Set fontLoaded state to true
          this.setState({ fontLoaded: true }); // set fontLoaded state to true

        // GET USER INFORMATION
        await HttpClient({ // call HttpClient
            url : URLS.GET_CATEGORIES // call URLS.GET_CATEGORIES
        }).then( async res => { // then function
            if(res.status == 200) // if status is 200
            {
                this.setState({ // set state
                    cat_loading: false, // set cat_loading state to false
                    categories: res.data, // set categories state to res.data
                })
            }
        })

        await HttpClient({  // call HttpClient
            url : URLS.USER_PROFILE+(this.props.route.params.user.name ? this.props.route.params.user.id : this.props.route.params.user.user_id) // call URLS.USER_PROFILE with user id
        }).then( async res => { // then function
            if(res.status == 200) // if status is 200
            {
                this.setState({ // set state 
                    user: res.data.user, // set user state to res.data.user
                    me: res.data.me, // set me state to res.data.me
                    people: res.data.people // set people state to res.data.people
                })
            }
        })

        await HttpClient({  // call HttpClient
            url : URLS.USER_LIKES + this.state.user.id + '?category=' + this.state.selectedCategory // call URLS.USER_LIKES with user id and selected category
        }).then( async res => { // then function
            // console.log('>>>>', res.data) // console log res.data
            if(res.status == 200) // if status is 200
            {
                this.setState({ // set state
                    loading: false, // set loading state to false
                    likes: res.data // set likes state to res.data
                })
            }
        })

      
    }

    async removeFromList(item, ind) // remove from list function
    {
        this.setState({ // set state
            loading: true // set loading state to true
        })
        await HttpClient({  // call HttpClient
            url : URLS.DELETE_WISHLIST, // call URLS.DELETE_WISHLIST
            data : { // data
                product: item.product_id // product id 
            }
        }, 'POST').then( async res => { // then function
            await HttpClient({  // call HttpClient
                url : URLS.GET_WISHLIST+1 // call URLS.GET_WISHLIST
            }).then( async res => { // then function
                if(res.status == 200) // if status is 200
                {
                    this.setState({ // set state
                        wishlist_loading: false, // set wishlist_loading state to false
                        wishlist: res.data, // set wishlist state to res.data
                        loading: false // set loading state to false
                    })
                }
            })
        })

    }
    async refreshPeople() {
        // console.log('refreshing people')
        await HttpClient({  // call HttpClient
            url : URLS.USER_PROFILE+(this.props.route.params.user.name ? this.props.route.params.user.id : this.props.route.params.user.user_id) // call URLS.USER_PROFILE with user id
        }).then( async res => { // then function
            if(res.status == 200) // if status is 200
            {
                this.setState({ // set state 
                    user: res.data.user, // set user state to res.data.user
                    me: res.data.me, // set me state to res.data.me
                    people: res.data.people // set people state to res.data.people
                })
            }
        })
    }
    renderRow = (user_likes, item, index) => { // render row function
        const a = user_likes ? JSON.parse(user_likes) : []; // parse user_likes
        const b = item['coffee_idies'] ? JSON.parse(item['coffee_idies']) : []; // parse item['coffee_idies']
        let diffPercent = 0; // set diffPercent to 0
        for (let i = 0; i<a.length; i++) { // for loop
            if(a[i] == b[i]) // if a[i] == b[i]
            {
                ++diffPercent // increment diffPercent
            }
        }

        return (
            // return view component with TouchableOpacity component for touch event
            <TouchableOpacity 
                onPress={ _ => this.props.navigation.push('UserProfile', {
                    user: item,
                    similarity: diffPercent == 0 ? 0 : (diffPercent/a.length)*100
                })}
                key={index} 
				className='border bg-white rounded-xl overflow-hidden flex flex-row justify-between items-center p-4 mb-3 relative'
				style={[
				{
					borderColor: '#F4EFEA',
				}
            ]}>
                <View className='flex flex-row'>
                    {
                        item.avatar ? // if item.avatar is true then return Image component with source as URLS.PROFILE_IMG+item.avatar
                        (
                            <Image 
                                source={{ uri: URLS.PROFILE_IMG+item.avatar}}
                                className='w-16 h-16 rounded-full' 
                            />
                        ) : // else return Image component with source as require('../assets/icons/avatar.jpeg')
                        (
                            <Image 
                                source={require('../assets/icons/avatar.jpeg')}
                                resizeMode={'contain'}
                                className='w-16 h-16 rounded-full border border-gray-300'
                            />
                        )
                    }
                    
                    <View className='ml-4'>
                        <Text className='text-base' style={[{fontFamily: 'Baloo2-Bold'}]}>{ item.name.length < 14 ? item.name : `${item.name.substring(0,11)}...`}</Text>
                        <View className='hidden flex-row items-center'>
                            <Text className='text-xs' style={[{fontFamily: 'Baloo2-Regular'}]}>Overall Flava Similar:</Text>
                            <Text className='text-sm text-gray-700' style={[{fontFamily: 'Baloo2-Bold'}]}>{diffPercent == 0 ? 0 : (diffPercent/a.length ?? 0)*100}%</Text>
                        </View>
                    </View>
                </View>
                {/* Show Circular Progress */}
                <View className='flex-col items-center justify-center'>
                    <CircularProgress
                        radius={27}
                        value={diffPercent == 0 ? 0 : (diffPercent/a.length)*100} 
                        textColor={'#E76E50'}
                        textStyle={{fontFamily: 'Baloo2-Bold'}}
                        activeStrokeColor={'#E76E50'}
                        activeStrokeWidth={6}
                        valueSuffix={'%'}
                        inActiveStrokeOpacity={0}
                        circleBackgroundColor={'#FAE1DC'}
                    />
                    <Text style={[{color: '#E76E50',fontFamily: 'Baloo2-Bold',fontSize: 10}]}className='text-center'>{`Similar to you in`}</Text>
                    <Text style={[{color: '#E76E50', fontFamily: 'Baloo2-Bold',fontSize: 10}]}className='text-center -mt-1'>{`coffee`}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    async loadCategory(category) { // load category function

        this.setState({ // set state
            loading: true, // loading to true
            selectedCategory: category.id // selectedCategory to category.id
        })
        await HttpClient({  // HttpClient function
            url : URLS.USER_LIKES + this.state.user.id + '?category=' + category.id // URLS.USER_LIKES + this.state.user.id + '?category=' + category.id
        }).then( async res => { // then function
            if(res.status == 200) // if res.status == 200
            {
                this.setState({ // set state 
                    loading: false, // loading to false
                    likes: res.data // likes to res.data
                })
            }
        })
    }

    render() // render function
    {
        return (
            // return SafeAreaView component with style and edges
            <SafeAreaView style={[styles.container]} edges={['right', 'top', 'left']}>
                {/*  StatusBar component with style */}
                <StatusBar 
                    barStyle={'dark-content'} 
                />
                {
                    this.state.loading ? // if this.state.loading is true then return LoaderScreen component
                    (
                        <LoaderScreen backgroundColor={'rgba(0,0,0,.4)'} color={'white'} overlay/>
                    ) 
                    :  // else return View component
                    (
                        <ScrollView>
                            <LinearGradient colors={['#F3EEEA', '#fff']}>
                                <View className='flex justify-between items-center px-4 mb-10 w-full flex-row'
                                style={[{
                                    zIndex: 999
                                }]}>
                                    {/* TouchableOpacity component with onPress event for back button */}
                                    <TouchableOpacity  
                                        // size={Button.sizes.xsmall}
                                        className='border-0 bg-transparent p-0 flex items-center justify-start'
                                            style={[{
                                                zIndex: 999
                                        }]}
                                        borderRadius={0}
                                        onPress={ _ => this.props.navigation.goBack() }    
                                    >
                                        <Ionicons name={'chevron-back-outline'} size={30} color={'#000'}/>
                                        <Text className='text-base' style={[{fontFamily: 'Baloo2-Bold',color: '#000'}]}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className='items-center justify-center -mt-10'>
                                    {
                                        this.state.user.avatar ? // if this.state.user.avatar is true then return Image component with source as URLS.PROFILE_IMG+this.state.user.avatar
                                        (
                                            <Image 
                                                source={{ uri: URLS.PROFILE_IMG+this.state.user.avatar}}
                                                className='w-20 h-20 rounded-full'
                                            />
                                        ) : // else return Image component with source as require('../assets/icons/avatar.jpeg')
                                        (
                                            <Image 
                                                source={require('../assets/icons/avatar.jpeg')}
                                                className='w-20 h-20 rounded-full border border-gray-300'
                                            />
                                        )
                                    }
                                    {/* Text component with style for item name */}
                                    <Text className='text-xl text-black w-full text-center mt-3'style={[ {fontFamily: 'Baloo2-Bold'}]}>{this.state.user.name}</Text>
                                    <Text className='text-sm text-gray-600 text-center hidden'style={[{fontFamily: 'Baloo2-Bold'}]}>Vancouver</Text>
                                    <View className='hidden flex-row items-center'>
                                        <Text className='text-xs' style={[{fontFamily: 'Baloo2-Regular'}]}>Overall Flava Similar:</Text>
                                        <Text className='text-sm text-gray-700' style={[{fontFamily: 'Baloo2-Bold'}]}>45%</Text>
                                    </View>
                                    <View className='w-full px-5'>
                                        {
                                            this.state.user.about ? // if this.state.user.about is true then return Text component with style
                                            (
                                                <Text className='mt-4' style={[{fontFamily: 'Baloo2-Regular'}]}>{this.state.user.about}</Text>
                                            ) : null
                                        }
                                        <View className='mt-2'>
                                            {
                                                this.state.user.instagram && this.state.user.instagram.length ? // if this.state.user.instagram && this.state.user.instagram.length is true then return TouchableOpacity component with onPress event for instagram
                                                (
                                                    // TouchableOpacity component with onPress event for instagram
                                                    <TouchableOpacity 
                                                        className='bg-transparent w-24'
                                                        borderRadius={0} 
                                                        // size={Button.sizes.small} 
                                                        avoidMinWidth={true}
                                                        onPress={ _ => Linking.openURL(this.state.user.instagram)}    
                                                    >
                                                        <View className='flex flex-row'>
                                                            <AntDesign name={'instagram'} size={22} color={'#000'} className='mr-1' />
                                                            <Text style={{fontFamily: 'Baloo2-Bold'}}>Instagram</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : null
                                            }
                                            {
                                                this.state.user.twitter && this.state.user.twitter.length ? // if this.state.user.twitter && this.state.user.twitter.length is true then return TouchableOpacity component with onPress event for twitter
                                                (
                                                    // TouchableOpacity component with onPress event for twitter
                                                    <TouchableOpacity 
                                                        className='bg-transparent w-20'
                                                        borderRadius={0} 
                                                        // size={Button.sizes.small} 
                                                        avoidMinWidth={true}
                                                        onPress={ _ => Linking.openURL(this.state.user.twitter)}  
                                                    >
                                                        <View className='flex flex-row'>
                                                            <AntDesign name={'twitter'} size={22} color={'#000'} className='mr-1'/>
                                                            <Text style={{fontFamily: 'Baloo2-Bold'}}>Twitter</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : null
                                            }
                                        </View>
                                    </View>
                                </View>
                                <View className='px-4'>
                                    <ScrollBar
                                        gradientWidth={0}
                                        className='my-4'>
                                        {
                                            this.state.categories.map((mini_cat_item, index) => { // map categories array
                                                return (
                                                    <TouchableOpacity 
                                                        onPress={ _ => this.loadCategory(mini_cat_item)}
                                                        borderRadius={0} 
                                                        // size={Button.sizes.small} 
                                                        avoidMinWidth={true}
                                                        className='flex flex-col items-center bg-transparent pl-0 pr-3 py-0'>
                                                        <View className='bg-white rounded-full p-2' style={[this.state.selectedCategory == mini_cat_item.id ? { backgroundColor: '#E76E50'} : '']}>
                                                            <Image 
                                                                source={this.state.selectedCategory == mini_cat_item.id ? avatarImageWhite(mini_cat_item.slug) : avatarImage(mini_cat_item.slug)}
                                                                style={[{ width: 35, height: 35}]} />
                                                        </View>
                                                        <Text className='mt-1'
                                                        style={[{
                                                            color: `${this.state.selectedCategory == mini_cat_item.id ? '#E76E50' : '#828282'}`,
                                                            fontFamily: 'Baloo2-Bold',
                                                            fontSize: 11
                                                        }]}>
                                                            {mini_cat_item.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </ScrollBar>
                                </View>
                                <Like items={this.state.likes} navigation={this.props.navigation} />
                            </LinearGradient>
                            <View>
                                <View className='p-6' 
                                style={[{
                                    backgroundColor: '#F3EEEA'
                                }]}>
                                    {
                                        this.state.people.length ? // if this.state.people.length is true then return View component with style
                                        (
                                            <View className='mb-4' 
                                            style={[{
                                                backgroundColor: '#F5F0EB'
                                            }]}>
                                                <Text className='text-sm' style={[{color: '#777777',fontFamily: 'Baloo2-Bold'}]}>EXPLORE MORE PEOPLE</Text>
                                            </View>
                                        ) : null
                                    }
                                    {
                                        this.state.people.map((item, index) => this.renderRow(this.state.me.coffee_idies ,item, index))  // map people array and return renderRow function
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    )
                }
            </SafeAreaView>
        );
    }
};


const styles = StyleSheet.create({
    container : {
        backgroundColor: '#F3EEEA',
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

export default UserProfile;


{/* <View style={tailwind('flex flex-col items-center pl-3 pr-2')}>
        <CircularProgress
            radius={29}
            value={!this.props.route.params.similarity ? 0 : this.props.route.params.similarity} 
            textColor={'#E76E50'}
            textStyle={{fontFamily: 'Baloo2-Bold'}}
            activeStrokeColor={'#E76E50'}
            activeStrokeWidth={6}
            valueSuffix={'%'}
            inActiveStrokeOpacity={0}
            circleBackgroundColor={'#FAE1DC'}
        />
        <Text style={[tailwind(`text-xs font-bold`), {
            color: `${index == 0 ? '#E76E50' : '#828282'}`,
            fontFamily: 'Baloo2-Bold'
        }]}>
            {mini_cat_item.name}
        </Text>
</View> */}