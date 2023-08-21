import React from 'react';
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
import Loading from '../components/Loading'; // Import Loading
import {LinearGradient} from 'expo-linear-gradient';
import uuid from 'react-native-uuid';
import * as Font from 'expo-font';
import WishList from '../wishlist/list';
import Recommendation from '../wishlist/recommendation';
import { tail } from 'lodash';
import { avatarImage, avatarImageWhite } from '../components/SwitchCase';

class Wishlist extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            user: null,
            loading: true,
            toast: false,
            toast_message: null,
            categories: [],
            wishlist_loading: false,
            wishlist: [],
            refreshing: false,
            selectedCategory: 1
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
            url : URLS.GET_USER
        }).then( async res => {
            if(res.status == 200)
            {
                this.setState({
                    proflie_loading: false,
                    user: res.data
                })
            }
        })

      
    }

    async removeFromList(item, ind)
    {
        this.setState({
            loading: true
        })
        await HttpClient({ 
            url : URLS.DELETE_WISHLIST,
            data : {
                product: item.product_id
            }
        }, 'POST').then( async res => {
            await HttpClient({ 
                url : URLS.GET_WISHLIST+1
            }).then( async res => {
                if(res.status == 200)
                {
                    this.setState({
                        wishlist_loading: false,
                        wishlist: res.data,
                        loading: false
                    })
                }
            })
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
  

    render()
    {
        return (
            <SafeAreaView style={[styles.container]}>
				{this.state.loading || this.state.refreshing ? (
					<Loading />
				) : (
                    <View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            tintColor={'#333'}
                            refreshing={this.state.refreshing}
                            onRefresh={ _ => this.refreshExplore(true)}
                        />
                    }
                >
                <LinearGradient
                    colors={['#F3EEEA', '#fff']}>
                        <View>
                            <View className='flex justify-center items-center px-5 my-6 w-full flex-row'>
                                <View className='w-1/4 items-start'>
                                    <TouchableOpacity 
                                       className='p-0 m-0 bg-transparent'
                                        borderRadius={0} 
                                        // size={Button.sizes.small} 
                                        avoidMinWidth={true}
                                        onPress={ _ => this.props.navigation.navigate('TextSearchFlava')}
                                    >
                                        <Ionicons name={'search'} size={22} color={'#000'} className='mb-3'/>
                                    </TouchableOpacity>
                                </View>
                                <Text className='w-2/4 text-xl text-center' style={[{color: '#E06060',fontFamily: 'Baloo2-Bold',marginTop: 4}]}>WISHLIST</Text>
                                <View className='w-1/4'>
                                {
                                    this.state.user ?
                                    (
                                        <TouchableOpacity 
                                        onPress={ _ => this.props.navigation.openDrawer()}
                                        className='border-0 bg-transparent p-0 flex items-end justify-end'
                                        borderRadius={0}
                                        >
                                            {
                                                this.state.user.avatar ? 
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
                                                    onPress={ _ => this.loadCategory(mini_cat_item)}
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
                        <Recommendation
                            category={this.state.selectedCategory}
                            navigation={this.props.navigation}
                            refresh={this.state.refreshing || this.state.recommendation_loading}
                        />
                    </LinearGradient>
                    <WishList
                        category={this.state.selectedCategory}
                        navigation={this.props.navigation}
                        refresh={this.state.refreshing || this.state.recommendation_loading}
                    />
                </ScrollView>
                <ToasterLoader 
                    loading={this.state.loading}
                    toast={this.state.toast}
                    toast_message={this.state.toast_message}
                    toast_loader={this.state.toast_loader}
                />
                </View>
                )}
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

export default Wishlist;
