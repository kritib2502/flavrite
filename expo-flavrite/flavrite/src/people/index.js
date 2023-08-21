
import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,   
    View,
    Image,
    ScrollView,
    RefreshControl,
    FlatList,
    Text,
    ListItem,
    TouchableOpacity
  } from 'react-native';
  
  import { ScrollBar } from 'react-native-ui-lib';
  
  import URLS from '../utils/Url';
  import HttpClient from '../utils/Api';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import Async from '../utils/Async';
  import ToasterLoader from '../utils/ToasterLoader';
  import CircularProgress from 'react-native-circular-progress-indicator';
  import { LinearGradient } from 'expo-linear-gradient';
  import * as Font from 'expo-font';
  import { avatarImage, avatarImageWhite } from '../components/SwitchCase';
  import Loading from '../components/Loading';

export class People extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            likes: [], // likes state
            loading: true,
            toast: false,
            toast_message: null,
            categories: [],
            cat_loading: true,
            people_loading: true,
            refreshing: false,
            selectedCategory: 1,
            me: null, // me state
            user: null,
            people: [], // people state
            product_images: [], // product_images state

        }
    }

    async componentDidMount()
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
            url : URLS.GET_USER // Setting the url
        }).then( async res => { // Getting the response
            if(res.status == 200) // If the status is 200
            {
                this.setState({ // Setting the state
                    user: res.data, // Setting the user
                })
                console.log(this.state.user.id)
            }
        })
        
        await HttpClient({ 
            url : URLS.GET_CATEGORIES
        }).then( async res => {
            if(res.status == 200)
            {
                this.setState({
                    cat_loading: false,
                    categories: res.data,
                    loading: false
                })
            }
        })

        await HttpClient({ 
            url : URLS.GET_RECOMMENDATION + this.state.selectedCategory
        }).then( async res => {
            if(res.status == 200)
            {
                this.setState({
                    product_list: res.data
                })
            }
            console.log(this.state.product_list)
        })
        

        await HttpClient({  // call HttpClient
            url : URLS.USER_PROFILE+(this.state.user ? this.state.user.id : this.props.route.params.user.user_id) // call URLS.USER_PROFILE with user id
        }).then( async res => { // then function
            if(res.status == 200) // if status is 200
            {
                this.setState({ // set state 
                    me: res.data.me, // set me state to res.data.me
                    people: res.data.people, // set people state to res.data.people
                    people_loading: false
                })
                console.log(this.state.people)
            }
        })

        
    }
    async refreshExplore()
    {
        this.setState({
            refreshing: true
        })

        setTimeout( _ => {
            this.setState({
                refreshing: false
            })
        }, 2000)
    }

    async loadCategory(category) {
        let category_name = category.name
        let category_id = category.id
        this.setState({
            recommendation_loading: true,
            selectedCategory: category_id,
            recommendations: [],
            category_name
        })
        await HttpClient({ 
            url : URLS.EXPLORE_CATEGORY + category_id
        }).then( async res => {
            if(res.status == 200)
            {
                this.setState({
                    recommendation_loading: false,
                    recommendations: res.data
                })
            }
        })
    }
    async refreshPeople() {
        await HttpClient({  // call HttpClient
            url : URLS.USER_PROFILE+(this.state.user ? this.state.user.id : this.props.route.params.user.user_id) // call URLS.USER_PROFILE with user id
        }).then( async res => { // then function
            if(res.status == 200) // if status is 200
            {
                this.setState({ // set state 
                    me: res.data.me, // set me state to res.data.me
                    people: res.data.people, // set people state to res.data.people
                    people_loading: false
                })
            }
        })
    }
    async getUserLikes(item) {
        try{
            await HttpClient({  // call HttpClient
                url : URLS.GET_LIKE+item.id // call URLS.GET_LIKE with item id
            }).then( async res => { // then function
                if(res.status == 200) // if status is 200
                {
                    this.setState({ // set state
                        product_images: res.data // set product_images state to res.data
                    })
                }
            })
        }catch(e){
            console.log(e)
        }
    }
    renderRow = (user_likes, item, index) => { // render row function

        // this.getUserLikes(item)

        const a = user_likes ? JSON.parse(user_likes) : []; // parse user_likes
        const b = item.coffee ? JSON.parse(item.coffee) : []; // parse item['coffee_idies']
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
				className='border bg-white rounded-xl overflow-hidden flex flex-row justify-between items-center p-4 mb-3 ml-4 mr-4 relative'
				style={[
				{
					borderColor: '#F4EFEA',
				}
            ]}>
                <View className='flex flex-row items-center justify-start pl-1 py-4'>
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
                        <View className="flex-row">
                            {item.liked_product_thumbnails && item.liked_product_thumbnails.map((image, index) => {
                                return (
                                    <Image 
                                        source={{ uri: URLS.PRODUCT_IMG+image}}
                                        className='w-8 h-8 rounded-full mr-1'
                                    />
                                )
                            }
                        )}
                        </View>
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
  
  render() {
    return (
        <SafeAreaView style={[styles.container]}>
            				{this.state.cat_loading|| this.state.refreshing ? (
					<Loading />
				) : (
                    <>
        <ScrollView
            refreshControl={
                <RefreshControl
                    tintColor={'#333'}
                    refreshing={this.state.refreshing}
                    onRefresh={ _ => this.refreshExplore(true)}
                />
            }
        >
        {/* <LinearGradient
            colors={['#F3EEEA', '#fff']}> */}
                <View>
                    <View className='flex justify-center items-center px-5 my-6 w-full flex-row'>
                        <View className='w-1/4 items-start'>
                            <TouchableOpacity 
                               className='p-0 m-0 bg-transparent'
                                borderRadius={0} 
                                avoidMinWidth={true}
                                onPress={ _ => this.props.navigation.navigate('TextSearchFlava')}
                            >
                                <Ionicons name={'search'} size={22} color={'#000'} className='mb-3'/>
                            </TouchableOpacity>
                        </View>
                        <Text className='w-2/4 text-xl text-center' style={[{color: '#E06060',fontFamily: 'Baloo2-Bold',marginTop: 4}]}>PEOPLE</Text>
                        <View className='w-1/4'>
                        {
                            this.state.user && this.state.user ?
                            (
                                <TouchableOpacity 
                                onPress={ _ => this.props.navigation.openDrawer()}
                                className='border-0 bg-transparent p-0 flex items-end justify-end'
                                borderRadius={0}
                                >
                                    {
                                        this.state.user.avatar && this.state.user.avatar ? 
                                        (
                                            <Image 
                                                className='w-8 h-8 rounded-full '
                                                resizeMode={'cover'}
                                                source={{ uri: URLS.PROFILE_IMG+this.state.user.avatar}}
                                            />      
                                        ) : 
                                        (
                                            <Image 
                                                className='w-8 h-8 rounded-full border'
                                                resizeMode={'contain'}
                                                source={{ uri: `${this.state.user && this.state.user.profile_img ? URLS.PROFILE_IMG+this.state.user.profile_img : 'https://ui-avatars.com/api/?name='+this.state.user.email}`}}
                                            />
                                        )
                                    }
                                </TouchableOpacity>
                            ) : 
                            (
                                <TouchableOpacity 
                                onPress={ _ => this.props.navigation.openDrawer()}
                                className='border-0 bg-transparent p-0 flex items-end justify-end'
                                borderRadius={0}
                                >
                                    <View 
                                        className='w-8 h-8 rounded-full' 
                                        style={[{
                                            backgroundColor: '#E06060'
                                        }]}
                                    ></View>    
                                </TouchableOpacity>
                            )
                        }
                        </View>
                    </View>
                    <View>
                        <ScrollBar 
                            gradientWidth={0} 
                            className='w-full pl-4'
                            >
                            {
                                this.state.categories.map((mini_cat_item, index) => {
                                    return (
                                        <TouchableOpacity 
                                            onPress={ _ => this.loadCategory(mini_cat_item) && this.refreshPeople()}
                                            borderRadius={0}  
                                            avoidMinWidth={true}
                                            className='flex flex-col items-center bg-transparent pl-0 pr-3 py-0'>
                                            <View className='bg-white rounded-full p-2' style={[this.state.selectedCategory == mini_cat_item.id ? { backgroundColor: '#E76E50'} : '']}>
                                                <Image 
                                                    source={this.state.selectedCategory == mini_cat_item.id ? avatarImageWhite(mini_cat_item.slug) : avatarImage(mini_cat_item.slug)}
                                                    style={[{ width: 35, height: 35}]} />
                                            </View>
                                            <Text className='mt-1' style={[{color: `${this.state.selectedCategory == mini_cat_item.id ? '#E76E50' : '#4A4A4A'}`,
                                                fontFamily: 'Baloo2-Bold',
                                                fontSize: 11
                                            }]}>{mini_cat_item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollBar>
                    </View>
                </View>  
                {/* </LinearGradient> */}
                <View className='mt-8'>
                {
                                        this.state.people.map((item, index) => this.renderRow(this.state.me.coffee, item, index))  // map people array and return renderRow function
                                    }
                </View>


        </ScrollView>
        <ToasterLoader 
            loading={this.state.loading}
            toast={this.state.toast}
            toast_message={this.state.toast_message}
            toast_loader={this.state.toast_loader}
        />
        </>
        )}
    </SafeAreaView>

    )
  }
}
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
export default People