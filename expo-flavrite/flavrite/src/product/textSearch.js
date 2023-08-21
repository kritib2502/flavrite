import React from 'react'; // Import react
import { // Import react native components
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Text,
  Button,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { ListItem } from 'react-native-ui-lib';
import URLS from '../utils/Url'; // Import URLS
import HttpClient from '../utils/Api'; // Import HttpClient
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

import ToasterLoader from '../utils/ToasterLoader'; // Import ToasterLoader
import {ScrollView} from 'react-native-gesture-handler'; // Import ScrollView
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import * as Font from 'expo-font';


class TextSearch extends React.Component {
  constructor(props) { // Default constructor
    super(props); // Call default constructor
    this.state = { // Initialize state
      proflie_loading: true, // Define profile loading state
      cat_loading: true, // Define category loading state
      category_products_loading: true, // Define category products loading state
      wishlist: [], // Define wishlist state
      refreshing: false, // Define refreshing state
      selectedCategory: 1, // Define selected category state
      recommendation_loading: true, // Define recommendation loading state
      category_name: 'Coffee', // Define category name state
      user: null, // Initialize user
      loading: false, // Define loading to false 
      toast: false, // Define toast to false
      toast_message: null, // Define toast message to null
      show: false, // Define show to false
      products: [], // Define products to empty array
      search_text_input: null, // Define search text input to null
      debounce: 0, // Define debounce to 0
      categories: [ // Define categories
        {
          id: 1,
          name: 'tea',
        },
        {
          id: 2,
          name: 'milk',
        },
        {
          id: 3,
          name: 'drink',
        },
        {
          id: 4,
          name: 'fruits',
        },
      ],
      tabIndex: 0,
    };
    this.timeout = 0; // Define timeout to 0
  }

  async componentDidMount() {
    // GET USER INFORMATION
    // if (this.props.route.params.products.length) { // If products length is greater than 0
    //   this.setState({ // Set state
    //     products: this.props.route.params.products, // Set products to products from params 
    //   });
    // }

    await Font.loadAsync({
      'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
      'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
      'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
    });
    // Set fontLoaded state to true
    this.setState({ fontLoaded: true });

    await HttpClient({ // Get user information
      url: URLS.GET_USER, // Define URL for get user
  }).then(async res => { // Handle response
      if (res.status == 200) { // If response status is 200
          this.setState({ // Set state
              proflie_loading: false, // Set profile loading to false
              user: res.data, // Set user state
          });
      }
  });

  await HttpClient({ // Get categories
    url: URLS.GET_CATEGORIES, // Define URL for get categories
  }).then(async res => { // Handle response
     if (res.status == 200) { // If response status is 200
        this.setState({ // Set state
            cat_loading: false, // Set category loading to false
            categories: res.data, // Set categories state
        });
      }
  });


  }

  async searchByText(text) { // Search by text function
        try{
          await HttpClient({ 
            url: URLS.SEARCH_PRODUCT + text + '&cat=1', // Set url to search product url with text and category id 
          }).then(async res => { // Get response
            if (res.status == 200) { // If status is 200
              this.setState({ // Set state
                loading: false, // Set loading to false
                products: res.data, // Set products to response data
              });
              console.log("products" + res.data);
            }
          });
        } catch (e) {
          console.log(e);
        }

      };// Set timeout to 1000
    
  

  renderRow(row, id) { // Render row function 
    return (
      // Render view with key id
      <View className='px-4'>
      <View key={id} className='border-b border-gray-200 rounded-xl bg-white p-4 mb-3'>
        <ListItem
          activeOpacity={0.3}
          height={77.5}
          onPress={() =>
            this.props.navigation.navigate('ShowFlava', { // Navigate to show flava screen
              item: row, // Set item to row
            })
          }>
          <ListItem.Part left> 
            <Image
              source={{uri: URLS.PRODUCT_IMG + row.thumbnail}} // Set source to product image url with thumbnail 
              className='w-16 h-16'
              resizeMode={'contain'}
            />
          </ListItem.Part>
          <ListItem.Part middle column containerStyle={[{paddingLeft: 17}]}> 
            <ListItem.Part
            className='flex flex-col items-start'
              containerStyle={[
                {marginBottom: 3},
              ]}>
              <Text

              className='text-base h-7 w-48'
                style={[
                  {
                    color: '#4A4A4A',
                    fontFamily: 'Baloo2-Bold',
                  },
                ]}>
                {row.name} 
              </Text>
              {row.brand ? ( // If row brand exists 
                <Text
                className='text-xs -mt-2'
                  style={[
                    {
                      color: '#4A4A4A',
                      fontFamily: 'Baloo2-Regular',
                    },
                  ]}>
                  {row.brand.name} 
                </Text>
              ) : null} 
            </ListItem.Part>
          </ListItem.Part> 
          {/* <ListItem.Part right>
                <View>
                    <Text style={[tailwind('text-center font-bold text-lg'), { color: '#E16160'}]}>
                        {row.total_likes}
                    </Text>
                    <Text style={[tailwind('text-center text-white'), {
                        fontSize: 10
                    }]}>
                        {`Like this \n Flava`}
                    </Text>
                </View>
              </ListItem.Part> */}
        </ListItem>
      </View>
      </View>
    );
  }

  render() {
    return (
      // SafeAreaView with style container
      <SafeAreaView style={[styles.container]}>
        {this.state.loading || this.state.refreshing ? (
					<Loading />
				) : (
          <>

<View className='flex justify-center items-center px-5 my-6 w-full flex-row'>
                		<View className='w-1/4 items-start'>
                  			<TouchableOpacity
                    			// Search button 
                    			className='p-0 m-0 bg-transparent'
                    			borderRadius={0}
                    			avoidMinWidth={true}
                    			onPress={_ =>  // On press navigate to text search flava
                      				this.props.navigation.navigate('MainStack')
                    			}
							>
								<Ionicons // Ionicons search icon
									name={'chevron-back-outline'} // Define name
									size={30} 
									color={'#000'}
									className='mb-3'
								/>
                  			</TouchableOpacity>
                		</View>
                		<Text
                    		// My faves text
                    		className='text-center w-2/4 text-xl'
							style={[{
								color: '#E06060',
								fontFamily: 'Baloo2-Bold',
								marginTop: -4,
							}]}
						>
                  		SEARCH
                		</Text>
                    <View className='w-1/4'>
                                {
                                    this.state.user ?
                                    (
                                        <TouchableOpacity 
                                        onPress={ _ => this.props.navigation.navigate('Profile')}
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
                                        onPress={ _ => this.props.navigation.navigate('Profile')}
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
        <View
         className='flex justify-between items-center px-4 mb-4 w-full flex-row'>
          <TextInput
            placeholder={'Search for product or brand'} // Set placeholder to search for product or brand

            fieldStyle={className='border-0'}
            underlineColor={'#f3f4f6'}
            onChangeText={text => this.searchByText(text)} // Set on change text to search by text function with text 
            className='flex-1 bg-gray-100 rounded-md px-3 m-1 h-10 text-lg'

          />
        </View>
        <ScrollView contentContainerStyle={className='pb-40'}>
          {this.state.products && this.state.products.map((item, index) => // Map products to item and index
            this.renderRow(item, index), // Render row with item and index 
          )}
        </ScrollView>
        <ToasterLoader
          loading={this.state.loading} // Set loading to state loading
          toast={this.state.toast} // Set toast to state toast
          toast_message={this.state.toast_message} // Set toast message to state toast message
          toast_loader={this.state.toast_loader} // Set toast loader to state toast loader
        />
        </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3EEEA',
    height: '100%',
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

export default TextSearch;
