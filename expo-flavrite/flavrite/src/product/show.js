import React from 'react'; // Import react
import { // Import react native components
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import { ScrollBar } from 'react-native-ui-lib';
import URLS from '../utils/Url'; // Import URLS
import HttpClient from '../utils/Api'; // Import HttpClient
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
// import SkeletonContent from '@03balogun/react-native-skeleton-content';
// import Share from 'react-native-share';
import { LinearGradient } from 'expo-linear-gradient'; // Import Linear Gradient
import CircularProgress from 'react-native-circular-progress-indicator'; // Import Circular Progress
import {SafeAreaView} from 'react-native-safe-area-context'; // Import Safe Area View
import * as Font from 'expo-font'
import { ProgressBar } from 'react-native-paper';
// Component Imports 
import Emoji from '../components/RenderItem';
import { defaultNotes } from '../components/JSONData';
import { generateRandomColor } from '../components/SwitchCase';
class ShowFlava extends React.Component {
    constructor(props) { // Call default constructor
        super(props); // Call default constructor
        this.state = { // Initialize state
            user: null, // Default user null
            loading: false, // Default loading false
            toast: false, // Default toast false
            toast_message: null, // Default toast message null
            show: false, // Default show false
            peoples: [], // Default peoples array
            loading: true, // Default loading true
            flava: [], // Default flava array
        };

        let pid = this.props.route.params.item.product_id // Get product id
                ? this.props.route.params.item.product_id // If product id is not null
                : this.props.route.params.item.id; // Get product id
        this._unsubscribe = this.props.navigation.addListener('focus', async () => { // Add listener to navigation
            await HttpClient({ // Call HttpClient
            url: URLS.GET_FALAVA + pid, // Set url to get falava by product id
        }).then(async res => { // Call then function
            // console.log(res.data); // Log response data
        if (res.status == 200) { // If status is 200
            this.setState({ // Set state
                loading: false, // Set loading false
                flava: res.data, // Set flava data to response data
                peoples: res.data.peoples, // Set peoples data to response data
            });
        }
        });
    });
    }

    async componentDidMount() {
      await Font.loadAsync({
        'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
        'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
        'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
      });
      // Set fontLoaded state to true
      this.setState({ fontLoaded: true });

    } // Call after component mount

    renderRow = (user_likes, item, index) => { // Render row function with user_likes, item and index
        const a = user_likes ? JSON.parse(user_likes) : []; // Set a to user likes or empty array
        // const b = item['user']['coffee_idies'] ? JSON.parse(item['user']['coffee_idies']) : [];
        const b = item['user'][this.state.flava.category.slug] // Set b to user coffee idies or empty array
                ? JSON.parse(item['user'][this.state.flava.category.slug]) // Set b to user coffee idies or empty array
                : []; // Set b to user coffee idies or empty array
        let diffPercent = 0; // Set diff percent to 0
        for (let i = 0; i < a.length; i++) { // For loop to iterate a array length 
            b.forEach(bItem => { // For each b item
            if (a[i] == bItem) { // If a item is equal to b item
                ++diffPercent; // Increment diff percent by 1
            }
        });
        }

    return (
        <TouchableOpacity
            onPress={_ =>
                this.props.navigation.push('UserProfile', { // Navigate to user profile screen 
                user: item, // Set user to item 
                similarity: (diffPercent / a.length) * 100, // Set similarity to diff percent by a length multiply by 100
                })
            }
            key={index} // Set key to index
            title="title" // Set title to title
            className='px-2 p-4 py-5 relative flex flex-row justify-between items-center rounded-xl mb-4'
            style={[
                {backgroundColor: '#fff'},
            ]}>
            <View className='flex flex-row'>
          {item.user.avatar ? ( // If user avatar is not null 
            <Image
              source={{uri: URLS.PROFILE_IMG + item.user.avatar}} // Set source to user avatar url
              className='w-12 h-12 rounded-full bg-gray-100'
            />
          ) : ( //  Else
            <Image
              source={require('../assets/icons/avatar.jpeg')} // Set source to default avatar
              className='w-12 h-12 rounded-full border border-gray-300'
            />
          )}
          <View className='ml-4'>
            <Text
                className='text-sm'
              style={[
                {
                  fontFamily: 'Baloo2-Bold',
                },
              ]}
              >
              {item.user.name.length < 14 // If user name length is less than 14
                ? item.user.name // Set user name to user name
                : `${item.user.name.substring(0, 10)}...`}
            </Text>
            <View className='hidden flex-row items-center'>
              <Text
                className='text-xs'
                style={[
                  
                  {
                    fontFamily: 'Baloo2-Regular',
                  },
                ]}
                >
                Overall Flava Similar:
              </Text>
              <Text
              className='font-bold text-sm text-gray-700'
                style={[
                  {
                    fontFamily: 'Baloo2-Bold',
                  },
                ]}
                >
                {diffPercent == 0 ? 0 : (diffPercent / a.length) * 100}% 
              </Text>
            </View>
          </View>
        </View>
        <View className='flex-col items-center justify-center'>
          <ProgressBar progress={diffPercent == 0 ? 0 : (diffPercent / a.length)} color="#E76E50" style={{zIndex: 999}}/>
          <CircularProgress
            radius={27}
            value={diffPercent == 0 ? 0 : (diffPercent / a.length) * 100}
            textColor={'#E76E50'}
            textStyle={{fontFamily: 'Baloo2-Bold'}}
            activeStrokeColor={'#E76E50'}
            activeStrokeWidth={6}
            valueSuffix={'%'}
            inActiveStrokeOpacity={0}
            circleBackgroundColor={'#FAE1DC'}
          />
          <Text
          className='text-center -mt-1'
            style={[
              {color: '#E76E50', 
              fontFamily: 'Baloo2-Bold', 
              fontSize: 10},
            ]}>
            {`Similar to you`}
          </Text>
          <Text
            className='text-center -mt-1'
            style={[
              {color: '#E76E50', 
              fontFamily: 'Baloo2-Bold', 
              fontSize: 10},
            ]}>
            {`in ${this.state.flava.category.name}`} 
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  shareIt = () => {
    const shareOptions = {
      message: 'Share link to others',
      url: 'https://google.com',
      social: Share.Social.WHATSAPP,
    };

    Share.open(shareOptions)
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  componentWillUnmount() { // When component unmounts
    this._unsubscribe(); // Unsubscribe from navigation
  }

  async wish() { // Wish function
    this.setState({ // Set state
      flava: {...this.state.flava, wished: true}, // Set flava to flava wished to true 
    });
    await HttpClient(
      {
        url: URLS.ADD_TO_WISHLIST, // Set url to add to wishlist url
        data: {
          product: this.state.flava.id, // Set product to flava id 
        },
      },
      'POST', // Set method to post
    ).then(async res => {}); 
  }

  async diswish() { // Diswish function
    this.setState({
      flava: {...this.state.flava, wished: false}, // Set flava to flava wished to false 
    });
    await HttpClient(
      {
        url: URLS.DELETE_WISHLIST, // Set url to delete wishlist url
        data: {
          product: this.state.flava.id, // Set product to flava id
        },
      },
      'POST', // Set method to post
    ).then(async res => {});
  }

  render() {
    return (
      <LinearGradient style={styles.container} colors={['#254652', '#F3EEEA']}>
        <SafeAreaView
          className='flex-1'
          edges={['right', 'top', 'left']}>
          <StatusBar backgroundColor="#F3EEEA" barStyle={'light-content'} />
          <ScrollView className='flex-1'>
            <View
            className='w-full flex items-start flex-col px-5 relative py-5'
              style={[
                {
                  backgroundColor: '#254652',
                },
              ]}>
              <View
                className='flex justify-between items-center mb-3 w-full flex-row'>
                <TouchableOpacity
                  //size={Button.sizes.xsmall}
                  className='border-0 bg-transparent p-0 flex items-center justify-start flex-row	'
      
                  borderRadius={0}
                  title='Back' // Back button
                  onPress={_ => { 
                    if (this.props.route.params.home) { // If home is true
                      this.props.navigation.navigate('MainStack'); // Navigate to main stack
                    } else { // Else
                      this.props.navigation.goBack(); // Go back 
                    }
                  }}>
                  <Ionicons // Ionicons back icon
                    name={'chevron-back-outline'} 
                    size={30}
                    color={'#fff'}
                  />
                  <Text
                    // Back Button Text
                    className='text-base'
                    style={[
                      {
                        fontFamily: 'Baloo2-Bold',
                        color: '#fff',
                      },
                    ]}>
                    Back
                  </Text>
                </TouchableOpacity>
              </View>

              {/* <SkeletonContent
                containerStyle={{flexDirection: 'column', width: '100%'}}
                isLoading={this.state.loading}
                boneColor={'lightgray'}
                layout={[
                  {key: 'someId', width: '100%', height: 380, borderRadius: 20},
                  {
                    key: 'someId3',
                    width: '100%',
                    height: 60,
                    borderRadius: 20,
                    marginTop: 20,
                  },
                ]}> */}
                {!this.state.loading ? (
                  <>
                    <View className='w-full' >
                      {this.state.flava.wished ? (
                        <TouchableOpacity
                        className='bg-transparent rounded-xl flex flex-col p-0 absolute top-2 left-2'
                          style={[
                            {
                              zIndex: 999,
                            },
                          ]}
                          onPress={() => this.diswish()}>
                          <Image
                            source={require('../assets/icons/wishon.png')}
                            style={[{width: 40, height: 40}]}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                        className='bg-transparent rounded-xl flex flex-col p-0 absolute top-2 left-2'
                          style={[
                            {
                              zIndex: 999,
                            },
                          ]}
                          onPress={() => this.wish()}>
                          <Image
                            source={require('../assets/icons/wishoff.png')}
                            style={[{width: 40, height: 40}]}
                          />
                        </TouchableOpacity>
                      )}

                      {this.state.flava.review ? (
                        <View
                          className='bg-transparent rounded-xl flex flex-col p-0 absolute top-2 right-2'
                          style={[

                            {
                              zIndex: 999,
                            },
                          ]}>
                          {this.state.flava.review.rate >= 0 &&
                          this.state.flava.review.rate <= 20 ? (
                            <Image
                              source={require('../assets/icons/avatar01.png')}
                              className='w-10 h-10'
                            />
                          ) : null}
                          {this.state.flava.review.rate > 20 &&
                          this.state.flava.review.rate <= 40 ? (
                            <Image
                              source={require('../assets/icons/avatar02.png')}
                              className='w-10 h-10'
                            />
                          ) : null}
                          {this.state.flava.review.rate > 40 &&
                          this.state.flava.review.rate <= 60 ? (
                            <Image
                              source={require('../assets/icons/avatar00.png')}
                              className='w-10 h-10'
                            />
                          ) : null}
                          {this.state.flava.review.rate > 60 &&
                          this.state.flava.review.rate <= 80 ? (
                            <Image
                              source={require('../assets/icons/avatar03.png')}
                              className='w-10 h-10'
                            />
                          ) : null}
                          {this.state.flava.review.rate > 80 &&
                          this.state.flava.review.rate <= 100 ? (
                            <Image
                              source={require('../assets/icons/avatar05.png')}
                              className='w-10 h-10'
                            />
                          ) : null}
                        </View>
                      ) : null}

                      <View
                        className='bg-white w-full rounded-2xl overflow-hidden flex flex-col items-center py-10'
                        >
                        {this.state.flava.thumbnail ? (
                          <Image
                            resizeMode={'contain'}
                            className=
                              'mt-8 w-48 h-48 rounded-xl overflow-hidden'
                            source={{
                              uri:
                                URLS.PRODUCT_IMG + this.state.flava.thumbnail,
                            }}
                          />
                        ) : (
                          <Image
                            source={require('../assets/icons/sample.jpeg')}
                            resizeMode={'cover'}
                            className='mt-8 w-48 h-48 rounded-xl overflow-hidden'
                          />
                        )}
                        <View className='p-2 mt-5'>
                          <Text
                          className='text-2xl text-center'
                            style={[
                              {
                                color: '#484A4A',
                                fontFamily: 'Baloo2-Bold',
                              },
                            ]}>
                            {this.state.flava.name}
                          </Text>
                          <Text
                          className='text-sm text-center text-gray-500'
                            style={[
                              {
                                fontFamily: 'Baloo2-Bold',
                              },
                            ]}
                            >
                            {this.state.flava.brand.id == 1 &&
                            this.state.flava.brand_name
                              ? this.state.flava.brand_name
                              : this.state.flava.brand.name}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {this.state.flava.review &&
                    this.state.flava.review.notes &&
                    this.state.flava.review.notes.length ? (
                      <>
                        <View
                          className='flex flex-row justify-between items-center my-3 px-1'>
                          <View className='w-1/2'>
                            <Text
                                className='text-gray-300'
                              style={[
                                {
                                  fontFamily: 'Baloo2-Bold',
                                },
                              ]}
                              >
                              NOTES
                            </Text>
                          </View>
                          <View className='w-1/2 justify-end'>
                            <TouchableOpacity
                              onPress={_ =>
                                this.props.navigation.navigate('RateFlava', {
                                  item: this.state.flava,
                                })
                              }
                              className='text-white p-0 bg-transparent text-xs text-right flex-row'
                              title="Rate"
                              >
                              <Text
                              className='text-white text-right w-full'
                                style={[
                                  {
                                    fontFamily: 'Baloo2-Bold',
                                  },
                                ]}
                                >
                                EDIT
                              </Text>
                              <Ionicons
                                name={'chevron-forward-outline'}
                                size={20}
                                color={'#fff'}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <ScrollBar
                          focusIndex={0}
                          gradientWidth={0}
                          className='pb-2'>
                          {defaultNotes.map((item, index) => {
                            if (
                              this.state.flava.review.notes.includes(item.id)
                            ) {
                              return (
                                <View className='p-1'>
                                  <View
                                  className='w-full rounded-xl py-2 px-6'
                                    style={[
                                        {
                                        backgroundColor:
                                          generateRandomColor(item.name),
                                      },
                                    ]}>
                                    <Text
                                    className='text-white text-center text-base'
                                      style={[
                                        {
                                          fontFamily: 'Baloo2-Bold',
                                        },
                                      ]}
                                      >
                                      {item.name}
                                    </Text>
                                  </View>
                                </View>
                              );
                            }
                          })}
                        </ScrollBar>
                      </>
                    ) : (
                      <View
                      className='flex-col justify-center items-center mt-8 mb-4 ml-12' >
                        <Text
                        className='text-center text-white mb-4 ml-2'
                          style={{ fontFamily: 'Baloo2-Bold' }}
                          >
                          This product hasn't been rated yet...
                        </Text>
                        <TouchableOpacity
                          //size={Button.sizes.big}
                          className='border-0 w-full rounded-full py-2 px-3'
                          style={[
                            {
                              backgroundColor: '#E76E50',
                              padding:0,

                            },
                          ]}
                          borderRadius={0}
                          title="Rate"
                          onPress={_ =>
                            this.props.navigation.navigate('RateFlava', {
                              item: this.state.flava,
                            })
                          }>
                          <Text
                            className='text-white text-center w-full'
                            style={[
                              {
                        
                                fontFamily: 'Baloo2-Bold',
                              },
                            ]}>
                            RANK IT NOW
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                ) : null}
              {/* </SkeletonContent>  */}
            </View>

            <View>
              <View
              className='p-6'
                style={[
                  {
                    backgroundColor: '#F3EEEA',
                  },
                ]}>
                {this.state.peoples.length ? ( // if there are people with similar tastes
                  <View
                  className='mb-4'
                    style={[
                      {
                        backgroundColor: '#F5F0EB',
                      },
                    ]}>
                    <Text
                    // People with similar tastes Text
                    className='font-bold text-sm'
                      style={[
                        {
                          color: '#777777',
                          fontFamily: 'Baloo2-Bold',
                        },
                      ]}>
                      PEOPLE WITH SIMILAR TASTES
                    </Text>
                  </View>
                ) : null} 
                {this.state.peoples.map((item, index) => // for each person with similar tastes
                  this.renderRow(this.state.flava.user_likes, item, index), // render a row with the person's name and their likes in common with the user (if any)
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
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

export default ShowFlava;
