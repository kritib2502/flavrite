import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  LoaderScreen
} from 'react-native';
import {Toast } from 'react-native-ui-lib';
import URLS from '../utils/Url';
import HttpClient from '../utils/Api';
import Async from '../utils/Async';
import uuid from 'react-native-uuid';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RateSlider from './rateSlider';
import * as Font from 'expo-font';
import { defaultNotes, hotSauceNotes} from '../components/JSONData';
import { generateRandomColor } from '../components/SwitchCase';

export default function Rating(props) {
  const [review, setReview] = useState(0);
  const [step, setStep] = useState(1);
  const [sliderValueMain, setSliderValueMain] = useState(0);
  const [notes, setNotes] = useState([]);
  const [flava, setFlava] = useState([]);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [noteBtnLoading, setNoteBtnLoading] = useState(false);

  const imageScaleSize = useSharedValue(1);
  const imageScaleSize2 = useSharedValue(0);
  const imageScaleSize3 = useSharedValue(480);
  const animatedStylesTextValue = useSharedValue(0);
  const noteBox = useSharedValue('none');
  const noteBoxY = useSharedValue(150);

  const likeBtns = useSharedValue('flex');
  const taskBtns = useSharedValue('none');

  const likeBtnsStyles = useAnimatedStyle(() => {
    return {
      display: likeBtns.value,
    };
  });

  const taskBtnsStyles = useAnimatedStyle(() => {
    return {
      display: taskBtns.value,
    };
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: imageScaleSize.value,
        },
        {
          translateY: imageScaleSize2.value,
        },
      ],
    };
  });

  const animatedViewStyles = useAnimatedStyle(() => {
    return {
      height: imageScaleSize3.value,
    };
  });

  const animatedStylesText = useAnimatedStyle(() => {
    return {
      transform: [{translateY: animatedStylesTextValue.value}],
    };
  });

  const noteBoxStyles = useAnimatedStyle(() => {
    return {
      display: noteBox.value,
      transform: [{translateY: noteBoxY.value}],
    };
  });

  useEffect(_ => {
    setFlava(props.route.params.item);
    if (props.route.params.item.review) {
      if (
        props.route.params.item.review.notes &&
        props.route.params.item.review.notes.length
      ) {
        setNotes(props.route.params.item.review.notes);
      }
    } else {
      if (props.route.params.item.tags && props.route.params.item.tags.length) {
        let temp_nt = [];
        props.route.params.item.tags.map(item => {
          temp_nt.push(item.id);
        });
        setNotes(temp_nt);
      }
    }
    setSliderValueMain(
      props.route.params.item.review ? props.route.params.item.review.rate : 50,
    );
  }, []);

  function flipCard() {
    imageScaleSize.value = withTiming(0.5);
    imageScaleSize2.value = withTiming(-130);
    animatedStylesTextValue.value = withTiming(-170);
    noteBox.value = 'flex';
    noteBoxY.value = withTiming(0);
    imageScaleSize3.value = withSpring(220);

    likeBtns.value = 'none';
    taskBtns.value = 'flex';
    setCardFlipped(true);
  }

  function undoFlipCard() {
    imageScaleSize.value = withTiming(0.5);
    imageScaleSize2.value = withTiming(0);
    animatedStylesTextValue.value = withTiming(0);
    noteBox.value = 'none';
    noteBoxY.value = withTiming(150);
    imageScaleSize3.value = withSpring(480);

    likeBtns.value = 'flex';
    taskBtns.value = 'none';
    setCardFlipped(false);
  }


  const addToWishlist = async () => {
    setFlava({...flava, wished: true});
    await HttpClient(
      {
        url: URLS.ADD_TO_WISHLIST,
        data: {
          product: props.route.params.item.id,
        },
      },
      'POST',
    ).then(async res => {});
  };

  const removeFromWishlist = async () => {
    setFlava({...flava, wished: false});
    await HttpClient(
      {
        url: URLS.DELETE_WISHLIST,
        data: {
          product: props.route.params.item.id,
        },
      },
      'POST',
    ).then(async res => {});
  };

  const like = async () => {
    setFlava({...flava, liked: true});
    await HttpClient(
      {
        url: URLS.LIKE,
        data: {
          product: props.route.params.item.id,
        },
      },
      'POST',
    ).then(async res => {});
  };

  const unLike = async () => {
    setFlava({...flava, liked: false});
    await HttpClient(
      {
        url: URLS.DISLIKE,
        data: {
          product: props.route.params.item.id,
        },
      },
      'POST',
    ).then(async res => {});
  };

  function editAnswer(val) {
    let temp_notes = [...notes];
    if (temp_notes.includes(val)) {
      const index = temp_notes.indexOf(val);
      if (index > -1) {
        temp_notes.splice(index, 1);
      }
    } else {
      temp_notes.push(val);
    }
    setNotes(temp_notes);
  }

  const submitNotes = async () => {
    if (step == 1) {
      setStep(2);
      return;
    }
    setNoteBtnLoading(true);
    await HttpClient(
      {
        url: URLS.STORE_REVIEW,
        data: {
          product: props.route.params.item.id,
          notes: notes,
          rate: sliderValueMain,
        },
      },
      'POST',
    )
      .then(async res => {
        setNoteBtnLoading(false);
        props.navigation.goBack();
      })
      .catch(error => {});
  };

  function backgroundChanger() {
    let progress = sliderValueMain;

    if (progress >= 0 && progress <= 20) {
      return '#DC4848';
    }
    if (progress > 20 && progress <= 40) {
      return '#E87F7F';
    }
    if (progress > 40 && progress <= 60) {
      return '#232323';
    }
    if (progress > 60 && progress <= 80) {
      return '#55A954';
    }
    if (progress > 80 && progress <= 100) {
      return '#27ae60';
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: backgroundChanger(),
        },
      ]}
      >
      <StatusBar backgroundColor="#232323" barStyle={'light-content'} />
      <ScrollView
        style={{
          backgroundColor: backgroundChanger(),
        }}
        >
        <View className='flex items-center px-4 mt-6 flex-row'>
          <View className='w-1/5'>
            <TouchableOpacity 
              className='border-0 bg-transparent p-0 flex items-center flex-row'
              borderRadius={0}
              onPress={_ => props.navigation.goBack()}
              >
              <Ionicons
                name={'chevron-back-outline'}
                size={30}
                color={'#fff'}
              />
              <Text
                className='text-base'
                style={[{
                    fontFamily: 'Baloo2-Bold',
                    color: '#fff',
                  },
                ]}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
          <Text className='text-2xl text-center font-bold mt-2 ml-2 w-3/5'
            style={[
              {color: '#fff', fontFamily: 'Baloo2-Bold'},
            ]}>
            {step == 1 ? 'RATE IT' : 'Add Notes'}
          </Text>
          <View 
            className='w-1/5 justify-start'
            >
            {step == 1 ? (
              <TouchableOpacity 
                // size={Button.sizes.xsmall}
                className='border-0 bg-transparent p-0 flex items-center'
            
                borderRadius={0}
                onPress={_ => setStep(2)}
                >
                <Text
                  className='text-base'
                  style={[{
                      fontFamily: 'Baloo2-Bold',
                      color: '#fff',
                    },
                  ]}>
                  Skip
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View 
        className='w-full flex flex-col p-5 pt-0 mt-4'
        >
          <View
            style={{
              shadowColor: '#333',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.37,
              shadowRadius: 7.49,
              elevation: 12,
            }}>
            <View
            className='w-full bg-white rounded-xl overflow-hidden relative flex items-center'
              >
              <View
              className='w-full items-center'
              >
                {step == 1 ? (
                  <>
                    {flava.thumbnail ? (
                      <Image
                        resizeMode={'cover'}
                        
                        className='w-48 h-48 rounded-xl overflow-hidden mt-10 mb-4'
                   
                        source={{uri: URLS.PRODUCT_IMG + flava.thumbnail}}
                      />
                    ) : (
                      <Image
                        source={require('../assets/icons/sample.jpeg')}
                        resizeMode={'cover'}

                        className='w-48 h-48 rounded-xl overflow-hidden mt-10 mb-4'
                      />
                    )}
                    <View 
                        className='p-2 px-5 my-5'
                    >
                      <Text
                        className='text-lg text-center font-bold'
                        style={[
                          {
                            color: '#484A4A',
                            fontFamily: 'Baloo2-Bold',
                          },
                        ]}>
                        {flava.name}
                      </Text>
                      <Text
                        className='text-sm text-center text-gray-400'
                        style={[
                          {
                            fontFamily: 'Baloo2-Bold',
                          },
                        ]}>
                        {flava.brand ? flava.brand.name : null}
                      </Text>
                    </View>
                    <RateSlider
                      val={
                        props.route.params.item.review
                          ? props.route.params.item.review.rate
                          : 50
                      }
                      setSliderValue={val => setSliderValueMain(val)}
                    />

                    <View
                      className='my-4 flex w-full px-20 flex-col items-center justify-center'
                    >
                      <TouchableOpacity 
                        className='rounded-full w-full mb-2 p-2 items-center'
                        style={[
                          {
                            backgroundColor: '#254652',
                          },
                        ]}
                        onPress={_ => submitNotes()}>
                        <Text
                          className='text-white'
                          style={[
                            {
                              fontFamily: 'Baloo2-Bold',
                            },
                          ]}>
                          {noteBtnLoading ? 'Updating ...' : 'RATE IT'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}
              </View>
              {step == 2 ? (
                <View 
                className='items-center w-full'
                >
                  <View
                    className='items-center justify-center border-b w-5/6 border-gray-200'
                    >
                    {flava.thumbnail ? (
                      <Image
                        resizeMode={'cover'}
                        className='w-20 h-20 rounded-xl overflow-hidden mt-10'
  
                        source={{uri: URLS.PRODUCT_IMG + flava.thumbnail}}
                      />
                    ) : (
                      <Image
                        source={require('../assets/icons/sample.jpeg')}
                        resizeMode={'cover'}
                        className='w-20 h-20 rounded-xl overflow-hidden mt-10'
                      />
                    )}
                    <View 
                        className='px-4 my-5'
                    >
                      <Text
                        className='text-lg text-center font-bold'
                        style={[
                          {
                            color: '#484A4A',
                            fontFamily: 'Baloo2-Bold',
                          },
                        ]}>
                        {flava.name}
                      </Text>
                      <Text
                        className='text-sm text-center text-gray-400'
                        style={[
                          {
                            fontFamily: 'Baloo2-Bold',
                          },
                        ]}>
                        {flava.brand ? (
                          <>
                            {flava.brand.id == 1 && flava.brand_name
                              ? flava.brand_name
                              : flava.brand.name}
                          </>
                        ) : null}
                      </Text>
                    </View>
                  </View>
                  <View
                    className='w-full pb-6'
                    style={[
                      {
                        backgroundColor: '#fff',
                      },
                    ]}>
                    <Text
                      className='text-center text-xl font-bold mt-6'
                      style={[
                        {
                          color: '#254652',
                          fontFamily: 'Baloo2-Bold',
                        },
                      ]}>
                      SELECT YOUR NOTES
                    </Text>
                    <View 
                    className='h-52'
                    >
                      <ScrollView
                     contentContainerStyle={{ 
                      flexDirection: 'row', 
                      flexWrap: 'wrap', 
                      marginBottom: 2, 
                      marginTop: 4, 
                      paddingBottom: 10, 
                      paddingHorizontal: 4, 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '100%'
                    }}
                        //className='flex flex-row flex-wrap mb-2 mt-4 pb-10 px-4 items-center justify-center w-full'
                        >

                        {defaultNotes.map((item, index) => {
                          return (
                            <View
                            className='p-1'
                            key={uuid.v4()}>
                              <TouchableOpacity
                                onPress={val => editAnswer(item.id)}
                                className='rounded-xl py-2 px-6'
                                style={[
                                  !notes.includes(item.id)
                                    ? {backgroundColor: '#597F85'}
                                    : {
                                        backgroundColor: generateRandomColor(
                                          item.name,
                                        ),
                                      },
                                ]}>
                                <Text
                                  className='text-white text-center text-sm'
                                  style={[
                                    {
                                      fontFamily: 'Baloo2-Bold',
                                    },
                                  ]}>
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>
                  <View
                    className='my-4 px-20 flex w-full flex-col items-center justify-center'
                   >
                    <TouchableOpacity
                      className='rounded-full w-full mb-2 p-2 items-center'
                      style={[
                        {
                          backgroundColor: '#254652',
                        },
                      ]}
                      onPress={_ => submitNotes()}>
                      <Text
                        className='text-white'
                        style={[
                          {
                            fontFamily: 'Baloo2-Bold',
                          },
                        ]}>
                        FINISH
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className='bg-transparent pt-1 pb-1'
                      onPress={_ => props.navigation.goBack()}>
                      <Text
                        style={{
                          color: '#254652',
                          fontFamily: 'Baloo2-Bold',
                        }}>
                        SKIP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

class RateFlava extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
      toast: false,
      toast_message: null,
      show: false,
      products: [],
      search_text_input: null,
      debounce: 0,
      categories: [
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
      rate: 3,
      answers: [],
    };
    this.timeout = 0;
  }

  async componentDidMount() {

    await Font.loadAsync({
      'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
      'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
      'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
    });
    // Set fontLoaded state to true
    this.setState({ fontLoaded: true });

    if (this.props.route.params.item.review) {
      this.setState({
        rate: this.props.route.params.item.review.rate,
      });
    }
    if (this.props.route.params.item.review.notes) {
      this.setState({
        answers: this.props.route.params.item.review.notes,
      });
    }
  }

  editAnswer = val => {
    let answers = this.state.answers;
    if (answers.includes(val)) {
      const index = answers.indexOf(val);
      if (index > -1) {
        answers.splice(index, 1);
      }
    } else {
      answers.push(val);
    }
    this.setState({
      answers,
    });
  };

  showState = pos => {
    if (pos < 2) {
      return 'Very bad';
    }
    if (pos < 3) {
      return 'Bad';
    }
    if (pos < 4) {
      return 'Good';
    }
    if (pos <= 5) {
      return 'Very good';
    }
  };

  async submit() {
    this.setState({
      loading: true,
    });
    await HttpClient(
      {
        url: this.props.route.params.item.review
          ? URLS.CHANGE_REVIEW + this.props.route.params.item.review.id
          : URLS.STORE_REVIEW,
        data: {
          product: this.props.route.params.item.id,
          notes: this.state.answers,
          rate: Math.ceil(this.state.rate),
        },
      },
      'POST',
    )
      .then(async res => {
        this.setState({
          textToast: 'Updated Successfully',
          loading: false,
          showToast: true,
        });
      })
      .catch(error => {
        this.setState({
          textToast: error.message,
          loading: false,
          showToast: true,
        });
      });
  }

  generateRandomColor = () => {
    let rnd = Math.floor(Math.random() * 5);
    switch (rnd) {
      case 1:
        return '#F3A160';
        break;
      case 2:
        return '#E9C46B';
        break;
      case 3:
        return '#E76E50';
        break;
      case 4:
        return '#299C8E';
        break;
        break;
      default:
        return '#F3A160';
    }
  };

  render() {
    return (
      <SafeAreaView style={[styles.container]}>
        <LinearGradient
          colors={['#F3EEEA', '#fff']}
          style={{
            height: '100%',
          }}>
          <Text
            className='text-2xl text-center font-bold mt-6'
            style={[
              {color: '#E76E50', fontFamily: 'Baloo2-Bold'},
            ]}>
            RATE FALAVA!
          </Text>
          <View 
            className='px-10 mt-8'
            >
            <View
              className='bg-white rounded-t-xl p-2'
              style={[
                {
                  shadowColor: '#333',
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.27,
                  shadowRadius: 7.49,
                  elevation: 55,
                },
              ]}></View>
          </View>
          <View 
            className='w-full flex flex-col p-5 pt-0'
            >
            <View
              className='py-5 pt-2 bg-white rounded-xl relative flex items-center'
              style={[
                {
                  shadowColor: '#333',
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.37,
                  shadowRadius: 7.49,
                  elevation: 12,
                },
              ]}>
              {this.props.route.params.item.thumbnail ? (
                <Image
                  resizeMode={'contain'}
                  className='w-20 h-20 rounded-xl overflow-hidden mt-10 mb-4'
                  source={{
                    uri:
                      URLS.PRODUCT_IMG + this.props.route.params.item.thumbnail,
                  }}
                />
              ) : (
                <Image
                  source={require('../assets/icons/sample.jpeg')}
                  resizeMode={'contain'}
                  className='w-20 h-20 rounded-xl overflow-hidden mt-10 mb-4'
                />
              )}
              <View 
              className='p-2 px-5 my-5'
              >
                <Text
                  className='text-xl text-center font-bold'
                  style={[
                    {
                      color: '#484A4A',
                      fontFamily: 'Baloo2-Bold',
                    },
                  ]}>
                  {this.props.route.params.item.name}
                </Text>
                <Text
                  className='text-sm text-center text-gray-400'
                  style={[
                    {
                      fontFamily: 'Baloo2-Bold',
                    },
                  ]}>
                  {this.props.route.params.item.brand.name}
                </Text>
              </View>
              {this.props.route.params.item.tags &&
              this.props.route.params.item.tags.length ? (
                <View
                  className='hidden w-full pb-6'
                  style={[
                    // tailwind('hidden'),
                    {
                      backgroundColor: '#254652',
                    },
                    // tailwind('w-full pb-6'),
                  ]}>
                  <Text
                    className='text-center text-xl font-bold mt-8'
                    style={[
                      {
                        color: '#fff',
                        fontFamily: 'Baloo2-Bold',
                      },
                    ]}>
                    TASTING NOTES
                  </Text>
                  <View
                  className='flex flex-row flex-wrap mb-2 mt-4 items-center justify-center w-full'
                   >
                    {this.props.route.params.item.tags.map((item, index) => {
                      return (
                        <View 
                        className='p-1'
                        key={uuid.v4()}>
                          <TouchableOpacity
                            onPress={val => this.editAnswer(item.id)}
                            className='rounded-xl py-2 px-6'
                            style={[
                              this.state.answers.includes(item.id)
                                ? {backgroundColor: '#597F85'}
                                : {backgroundColor: this.generateRandomColor()},
                            ]}>
                            <Text
                              className='text-white text-center text-base'
                              style={[
                                {
                                  fontFamily: 'Baloo2-Bold',
                                },
                              ]}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              <View className='mb-4 mt-8 flex flex-row'>
                <TouchableOpacity
                  className='bg-transparent p-0'
                  onPress={_ => this.props.navigation.goBack()}>
                  <Image
                    source={require('../assets/icons/rate-close-btn.png')}
                    className='h-16 w-16'
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                    className='bg-transparent p-0'
                 >
                  <Image
                    source={require('../assets/icons/rate-wishlist-btn.png')}
                    className='h-14 w-14'
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                    className='bg-transparent p-0'
                >
                  <Image
                    source={require('../assets/icons/rate-heart-btn.png')}
                    className='h-16 w-16'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Toast
            visible={this.state.showToast}
            position={'bottom'}
            backgroundColor={'#E16160'}
            message={this.state.textToast}
            onDismiss={_ =>
              this.setState({
                showToast: false,
              })
            }
            autoDismiss={3000}
            // showDismiss={showDismiss}
            // action={{iconSource: Assets.icons.x, onPress: () => console.log('dismiss')}}
            // showLoader={true}
          />
          {this.state.loading && (
            <LoaderScreen
              backgroundColor={'rgba(0,0,0,.4)'}
              color={'white'}
              overlay
            />
          )}
        </LinearGradient> 
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#232323',
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
