import React from 'react'; // Import react
import { // Import react native components
    RefreshControl, 
    StyleSheet, 
    View, 
    TouchableOpacity,
    Text,
    Image,
    SafeAreaView,

} from 'react-native';
import { ScrollBar } from 'react-native-ui-lib';

import URLS from '../utils/Url'; // Import URLS
import HttpClient from '../utils/Api'; // Import HttpClient
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import Async Storage
import DraggableFlatList from 'react-native-draggable-flatlist'; // Import DraggableFlatList
import  {ShadowDecorator} from 'react-native-draggable-flatlist';
import * as Font from 'expo-font';
import { avatarImage, avatarImageWhite } from '../components/SwitchCase'; // Import avatarImage and avatarImageWhite
import  Emoji from '../components/RenderItem'; // Import RenderClickableItem
import Loading from '../components/Loading'; // Import Loading
class Explore extends React.Component {
    constructor(props) { // Constructor
    	super(props); // Call default constructor
        this.state = { // Initialize state
            user: null, // Define user state
            proflie_loading: true, // Define profile loading state
            cat_loading: true, // Define category loading state
            categories: [], // Define categories state
            recommendations: [], // Define recommendations state
            category_products_loading: true, // Define category products loading state
            wishlist: [], // Define wishlist state
            refreshing: false, // Define refreshing state
            selectedCategory: 1, // Define selected category state
            recommendation_loading: true, // Define recommendation loading state
            category_name: 'Coffee', // Define category name state
        };
  	}

   async componentDidMount() {
	// GET USER INFORMATION
    await Font.loadAsync({
      	'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
      	'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
      	'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
    });
  	// Set fontLoaded state to true
  	this.setState({ fontLoaded: true });

  	this.refreshExplore(); // Refresh explore

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
	};

  	async refreshExplore(refreshing = false) { // Refresh explore
		if (refreshing) { // If refreshing is true
			this.setState({ // Set state
				refreshing: true, // Set refreshing to true
				recommendations: [], // Set recommendations to empty array
				recommendation_loading: true, // Set recommendation loading to true
			});
		}

		await HttpClient({ 
			url: URLS.EXPLORE_CATEGORY + this.state.selectedCategory, // Define URL for get explore category
		}).then(async res => { // Handle response
		if (res.status == 200) { // If response status is 200
			this.setState({ // Set state
				recommendation_loading: false, // Set recommendation loading to false
				recommendations: res.data, // Set recommendations state
			});
			if (refreshing) { // If refreshing is true
				this.setState({ // Set state
					refreshing: false, // Set refreshing to false
				});
			}
		}
		});
	}

	async addToWishlist(item) { // Add to wishlist
		this.setState({ // Set state
			wishlist_loading: item.id, // Set wishlist loading to item id
			wishlist: [...this.state.wishlist, item.id], // Set wishlist state
		});
		await HttpClient( // Add to wishlist
		{ 
			url: URLS.ADD_TO_WISHLIST, // Define URL for add to wishlist
			data: { // Define data
			product: item.id, // Define product
			},
		},
		'POST', // Define method
		).then(async res => { // Handle response
			if (res.status == 200) { // If response status is 200
				this.setState({ // Set state
				wishlist_loading: null, // Set wishlist loading to null
				// wishlist: null
				});
			}
		});
	}

	async loadCategory(category) { // Load category
		let category_name = category.name; // Define category name
		let category_id = category.id; // Define category id
		this.setState({ // Set state
			recommendation_loading: true, // Set recommendation loading to true
			selectedCategory: category_id, // Set selected category state
			recommendations: [], // Set recommendations to empty array
			category_name, // Set category name state
		});

		await AsyncStorage.setItem('category', JSON.stringify(category.id)); // Set category to async storage
		await HttpClient({ // Get recommendations
			url: URLS.EXPLORE_CATEGORY + category_id, // Define URL for get recommendations
		}).then(async res => { // Handle response
		if (res.status == 200) { // If response status is 200
			this.setState({
				recommendation_loading: false, // Set recommendation loading to false
				recommendations: res.data, // Set recommendations state
			});
		}
    	});
  	}

	renderItem = ({item, drag, isActive}) => { // Render item
		return ( 
		// Shadow decorator for item
		<ShadowDecorator activeScale={28}>
			<View className='px-4'>
			<TouchableOpacity
				onPress={_ =>
					this.props.navigation.navigate('ShowFlava', { // Navigate to show flava
						item: item  // Define item
					})
				}
				disabled={isActive}  // Define disabled
				onLongPress={drag} // Define on long press
				className='border bg-white rounded-xl overflow-hidden flex flex-row justify-between items-center p-4 mb-3 relative'
				style={[
				{
					borderColor: '#F4EFEA',
				},
            ]}>
				<View className='flex flex-row items-center justify-start pl-1 py-4'>
					{item.product.thumbnail ? ( // If item product thumbnail is not null
						<Image
							source={{uri: URLS.PRODUCT_IMG + item.product.thumbnail}} // Use product image
							resizeMode={'cover'}
							style={{width: 60, height: 60, borderRadius: 10}}
						/>
					) : ( // Else 
						<Image
							source={require('../assets/icons/sample.jpeg')}  // Use sample image
							resizeMode={'cover'}
							style={{width: 60, height: 60, borderRadius: 10}}
						/>
					)}
					<View className='pl-4 justify-start h-15'>
						<View className='items-start'>
							<Text
								className='text-base h-7 w-48'
								style={[{
									color: '#4A4A4A',
									fontFamily: 'Baloo2-Bold',
								}]}
							>
								{item.product.name.length > 13 // If item product name length is greater than 13
								? item.product.name.substring(0, 20) + '...' // Use substring
								: item.product.name} 
                  			</Text>

                  			{item.product.brand ? ( // If item product brand is not null
								<Text
									className='text-xs -mt-2'
									style={[{
										color: '#4A4A4A',
										fontFamily: 'Baloo2-Regular',
									}]}
								>
									{item.product.brand.id == 1 && item.product.brand_name // If item product brand id is 1 and item product brand name is not null
																? item.product.brand_name // Use item product brand name
																: item.product.brand.name} 
                    			</Text>
                  			) : null} 
                		</View>

                		{item.product.likers.length ? (  // If item product likers length is not null
                  		<View className='flex flex-row items-center mt-1'>
                    		<View className='flex flex-row items-center pl-2'>
                      			{item.product.likers.map((likers_item, likers_index) => { // Map through item product likers
                        			return (
                          				<View
                            				key={likers_index} 
                            				className='flex flex-row items-center mt-2 -ml-2'
                            			>
                            				{likers_item.user && likers_item.user.avatar ? ( //   
                              					<Image
                                					source={{
                                 						uri:
                                    					URLS.PROFILE_IMG + likers_item.user.avatar,  // Define URL for user avatar 
                                					}}
                                					resizeMode={'cover'}
                                					style={{width: 18, height: 18, borderRadius: 10, borderWidth: 1, borderColor: '#E5E5E5'}}
                              					/>
                            				) : ( 
                              					<Image
                                					source={require('../assets/icons/avatar.jpeg')} // Use sample images
                                					resizeMode={'cover'}
                                					style={{width: 18, height: 18, borderRadius: 10, borderWidth: 1, borderColor: '#E5E5E5'}}
                              					/>
                            				)}
                          				</View>
                        			);
                      			})}
                    		</View>

                    		<View className='flex flex-col pt-2'>
                      			<Text
                        			className='text-gray-500 ml-2 text-left'
                        			style={[{
                            			fontFamily: 'Baloo2-Regular', 
                            			fontSize: 10
									}]}
								>
                        		People who also
                      			</Text>
                      			<Text
                        			className='text-gray-500 ml-2 text-left -mt-1'
                        			style={[{
                            			fontFamily: 'Baloo2-Regular', 
                            			fontSize: 10
									}]}
								>
                        		like this flavor
                      			</Text>
                    		</View>
                  		</View>
                	) : null} 
              	</View>
            </View>
			{item.product.review? ( 
              <View className='absolute top-3 right-3'
              style={[
                {
                  zIndex: 999,
                },
              ]}>

                {item.product.review.rate >= 0 && 
                item.product.review.rate <= 20 ? ( 
                      <Image
                        source={require('../assets/icons/avatar01.png')} 
                        className='w-10 h-10'
                      />
                ) : null}

                {item.product.review.rate > 20 && 
                item.product.review.rate <= 40 ? ( 
                      <Image
                        source={require('../assets/icons/avatar02.png')} 
                        className='w-10 h-10'
                      />
                ) : null} 

                {item.product.review.rate > 40 && 
                item.product.review.rate <= 60 ? ( 
                      <Image
                        source={require('../assets/icons/avatar00.png')} // Use avatar00
                        className='w-10 h-10'
                      />
                ) : null}

                {item.product.review.rate > 60 && // If item product review rate is greater than 60
                item.product.review.rate <= 80 ? ( // And item product review rate is less than or equal to 80
                      <Image
                        source={require('../assets/icons/avatar03.png')} // Use avatar03
                        className='w-10 h-10'
                    />
                ) : null}

                {item.product.review.rate > 80 && // If item product review rate is greater than 80
                item.product.review.rate<= 100 ? ( // And item product review rate is less than or equal to 100
                      <Image
                        source={require('../assets/icons/avatar05.png')} // Use avatar05
                        className='w-10 h-10'
                    />
                ) : null}

              </View>
        ) : null}

            <View></View>
        	</TouchableOpacity>
        	</View>
      	</ShadowDecorator>
    	);
	};

  	async reOrdering(data) { // Reordering
    	let temp_ordering = []; // Define temp_ordering
    	data.map(item => { // Map through data
      		temp_ordering.push(item.product_id); // Push item product id to temp_ordering
    	});
    	this.setState({
      		recommendations: data, // Set recommendations to data
    	});
    	await HttpClient( // Call HttpClient
      	{
        	url: URLS.RE_ORDERING, // Define URL
        	data: { // Define data
          		products: temp_ordering, // Define products to temp_ordering
        	},
      	},
      	'POST', // Define method
    	).then(async res => {}); // Then call async function
  	}

  	render() {
    	return (
			
      		// Safe area view 
      		<SafeAreaView style={[styles.container]} edges={['right', 'left', 'top']}>
				{this.state.recommendation_loading || this.state.refreshing ? (
					<Loading />
				) : (

					
        	<DraggableFlatList
          		data={this.state.recommendations} // Define data to recommendations 
          		refreshControl={ // Define refresh control
            		<RefreshControl
              			tintColor={'#333'}
              			refreshing={this.state.refreshing} // Define refreshing to state refreshing 
              			onRefresh={_ => this.refreshExplore(true)} // On refresh call refreshExplore
            		/>
          		}
          		className='h-full'
          		ListHeaderComponent={ // Define list header component
            		<>
              		<View className='flex justify-center items-center px-5 my-6 w-full flex-row'>
                		<View className='w-1/4 items-start'>
                  			<TouchableOpacity
                    			// Search button 
                    			className='p-0 m-0 bg-transparent'
                    			borderRadius={0}
                    			avoidMinWidth={true}
                    			onPress={_ =>  // On press navigate to text search flava
                      				this.props.navigation.navigate('TextSearchFlava')
                    			}
							>
								<Ionicons // Ionicons search icon
									name={'search'} // Define name
									size={22} 
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
                  		MY FAVES
                		</Text>
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

					<ScrollBar gradientWidth={0} animationType="slide"
						style={{width: '100%', paddingLeft: 8, marginLeft: 4, flexGrow: 1 }} >
							{this.state.categories.map((mini_cat_item, index) => {
							return (
								<TouchableOpacity
									onPress={_ => this.loadCategory(mini_cat_item)}
									borderRadius={0}
									avoidMinWidth={true}
									className='flex flex-col items-center bg-transparent pl-0 pr-3 py-0 mb-8'
								>
									<View
                          				className='bg-white rounded-full p-2'
                          				style={[
                            				this.state.selectedCategory == mini_cat_item.id
                              				? {backgroundColor: '#E76E50'}
                              				: '',
                          				]}
									>
                          				<Image
                            				source={
                              					this.state.selectedCategory == mini_cat_item.id
                                				? avatarImageWhite(mini_cat_item.slug) 
                                				: avatarImage(mini_cat_item.slug)
											}
                            				style={[{width: 35, height: 35}]}
                          				/>
                        			</View>
                        		<Text
                          			className='mt-1'
                          			style={[{
                              			color: `${
                                			this.state.selectedCategory == mini_cat_item.id
                                  			? '#E76E50'
                                  			: '#4A4A4A'
                              			}`,
                              		fontFamily: 'Baloo2-Bold',
                              		fontSize: 11,
                            		}]}
								>
                          		{mini_cat_item.name}
                        		</Text>
                      		</TouchableOpacity>
                    	);
                  	})}
                </ScrollBar>
				</View>
            </>
          	}
          	ListHeaderComponentStyle={className='mb-4'}
          	ListEmptyComponent={ // 
            	<View className='px-4'>
              		<>
                	{this.state.recommendation_loading || this.state.refreshing ? ( // If recommendation loading or refreshing is true
                  		
						<Text>Loading...</Text>
                		) : ( // If recommendation loading or refreshing is false
                  			<View className='flex flex-col items-center justify-center relative'>
                    			<Image
                      				source={require('../assets/images/people-celebrating-online.png')} // Set image path 
                      				style={{  width: '72%', aspectRatio: 1,}}
                      				resizeMode={'contain'}
                    			/>
                    			<Text
                      				className='text-center text-xl -mt-7'
                      				style={[{
										color: '#E06060',
										fontFamily: 'Baloo2-Bold',
										fontSize: 20,
                        			}]}
								>
								`Scan in` your first {this.state.category_name} to {'\n'}{' '}
								get started in this category
                    			</Text>
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() =>
										this.props.navigation.navigate('ImageSearchFlava') // Navigate to ImageSearchFlava screen
									}
									className='relative flex flex-col items-center justify-center mx-5 absolute top-48 mt-5 right-20'
									style={[{
										shadowColor: '#000',
										shadowOffset: {
											width: 0,
											height: 3,
										},
										shadowOpacity: 0.15,
										shadowRadius: 3.84,
										elevation: 5,
									}]}
								>
                      				<View
                      					className='bg-white flex flex-col items-center justify-center -mt-7 w-14 h-14 rounded-full'
                        				style={[{backgroundColor: '#E76E50'}]}
									>
										<Image
											source={require('../assets/icons/plus-icon.png')} // Set image path for plus icon
											style={{width: 20, height: 20}}
											resizeMode="cover"
										/>
                      				</View>
                    			</TouchableOpacity>

                    			<TouchableOpacity
                      				activeOpacity={0.7}
									onPress={_ =>
										this.props.navigation.push('OnBoarding', { // Navigate to OnBoarding screen with selected category
										category: this.state.selectedCategory, // Set selected category 
										})
									}
                      				className='relative flex flex-col items-center justify-center -mt-10'
								>
									<Text
										className='text-gray-500 text-center mt-20 border-bottom'
										style={[{
											fontFamily: 'Baloo2-Bold',
											fontSize: 16,
										}]}>
										{`...or rate some popular \n flavors from the community.`}
									</Text>
                    			</TouchableOpacity>
                  			</View>
                		)}
              		</>
            	</View>
          	}
          	onDragEnd={({data}) => this.reOrdering(data)} // On drag end reordering data 
          	keyExtractor={item => item.id} // Set key for each item
          	renderItem={this.renderItem} // Render item 
        />
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

export default Explore;
