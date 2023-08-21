import React, { Component } from 'react'
import Swiper from 'react-native-deck-swiper'
import { Button, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import URLS from '../utils/Url';
import HttpClient from '../utils/Api';
import { defaultNotes, hotSauceNotes} from '../components/JSONData';
import * as Font from 'expo-font';

export default class Exemple extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cards: [
		{
			id: [],
			thumbnail: [],
			title: [],
			brand: [],
		}
	  ],
      images: [],
      swipedAllCards: false,
      swipeDirection: '',
      cardIndex: 0,
      list: [],
      category: props.route.params.category,
      likedIds: [],
	  fontLoaded: false,
    }
    this.cardsList = [];
  }

  async componentDidMount() {
	await Font.loadAsync({
		'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
		'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
		'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
	  });
	  // Set fontLoaded state to true
	  this.setState({ fontLoaded: true });

    try {
      await HttpClient({
        url: URLS.GET_RECOMMENDATION + this.state.category,
      }).then(async (res) => {
        if (res.status == 200) {
          this.setState({
            list: res.data,
            loading: false,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

    async addToWishlist(id) {
        try {
            await HttpClient(
            {
                url: URLS.ADD_TO_WISHLIST,
                data: {
                product: id,
                },
            },
            'POST',
            ).then(async res => {});
        } catch (error) {
            console.log(error)
        }
    }

    async addToLikes(id) {
        try {
            await HttpClient(
                {
                  url: URLS.LIKE,
                  data: {
                    product: id,
                  },
                },
                'POST',
              ).then(async res => {});
        } catch (error) {
            console.log(error)
        }
    }


	mapList() {
		return this.state.list.map((item, index) => ({
		  id: item.id,
		  thumbnail: item.thumbnail,
		  title: item.name,
		  brand: item.brand.name,
		}));
	}

	renderCard(card, index) {
		if (!card) {
		  return <Text>Loading..</Text>;  // or return a placeholder or a loading spinner
		}
		return (
		  <View style={styles.card}>
			<Image
			  source={{uri: URLS.PRODUCT_IMG+card.thumbnail}}
			  className='w-48 h-48 rounded-lg mx-auto'

			/>
			<Text className='text-base h-7 text-center text-lg'
								style={[{
									color: '#4A4A4A',
									fontFamily: 'Baloo2-Bold',
								}]}>{card.title.length > 13 
								? card.title.substring(0, 20) + '...' // Use substring
								: card.title}</Text>
			<Text className='text-md -mt-2 text-center'
									style={[{
										color: '#4A4A4A',
										fontFamily: 'Baloo2-Regular',
									}]}>{card.brand}</Text>
		  </View>
		)
	  };

  onSwiped = (type) => {
    console.log(`on swiped ${type}`)

  }

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    })
    this.props.navigation.push('DrawerStack') // Navigate to Explore Screens
  };

  swipeBottom = (id, index) => {
    console.log(index)
    this.addToWishlist(id)
  }
  swipeLeft = () => {
    this.swiper.swipeLeft()
  };
  swipeRight = () => {
	console.log("swiped right" + cardIndex)
    this.addToLikes(this.state.cards[cardIndex].id)
    };
   

  render () {
    this.state.cards = this.mapList(); // Call mapList method here
    console.log(this.state.list)
    return (
      <View style={styles.container}>
        
        <Swiper
          ref={swiper => {
            this.swiper = swiper
          }}
          onSwiped={() => this.onSwiped('general')}
          onSwipedLeft={() => this.onSwiped('left')}
          onSwipedRight={(cardIndex) => {this.addToLikes(this.state.list[cardIndex].id)}}
          onSwipedTop={() => this.onSwiped('top')}
          onSwipedBottom={(cardIndex) => {this.addToWishlist(this.state.list[cardIndex].id)}}
          onTapCard={this.swipeLeft}
          cards={this.state.cards}
		      images={this.state.images}
          cardIndex={this.state.cardIndex}
          cardVerticalMargin={150}
          renderCard={this.renderCard}
          onSwipedAll={this.onSwipedAllCards}
          stackSize={4}
          stackSeparation={15}

          overlayLabels={{
            bottom: {
              title: 'Add to Wishlist',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            },
            left: {
              title: 'DISLIKE',
              style: {
                label: {
                  backgroundColor: 'red',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30
                }
              }
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: 'green',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30
                }
              }
            },
            top: {
              title: 'Skip',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            }
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          backgroundColor={'#F3EEEA'}
        >

          <Text className='mt-10' style={{color: `#E76E50`,fontFamily: 'Baloo2-Bold',fontSize: 22,textAlign: 'center'}}>Find Your</Text>
          <Text className='mt-1' style={{color: `#E76E50`,fontFamily: 'Baloo2-Bold',fontSize: 22,textAlign: 'center'}}>Favourites!</Text>
        </Swiper>
        <View style={[styles.bottomWrapper, { flexDirection: 'row' }]}>
			<View>
				<TouchableOpacity onPress={() => this.swiper.swipeLeft()}>
					<Image source={require(`../../assets/icons/rate-close-btn.png`)} style={styles.buttonImage}/>
					<Text className="pt-1" style={{fontFamily: 'Baloo2-Bold'}}>Dislike</Text>
				</TouchableOpacity>
			</View>
			<View>
				<TouchableOpacity onPress={() => this.swiper.swipeBottom()}>
					<Image source={require(`../../assets/icons/rate-wishlist-btn.png`)} style={styles.buttonImage}/>
					<Text className="pt-1" style={{fontFamily: 'Baloo2-Bold'}}>Wishlist</Text>
				</TouchableOpacity>
			</View>
			<View>
				<TouchableOpacity onPress={() => this.swiper.swipeRight()}>
					<Image source={require(`../../assets/icons/rate-heart-btn.png`)} style={styles.buttonImage}/>
					<Text className="ml-2 pt-1 " style={{fontFamily: 'Baloo2-Bold'}}>Like</Text>
				</TouchableOpacity>
			</View>
		</View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EEEA'
  },
  card: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
	alignContent: 'center',
    backgroundColor: 'white',
    height: 50
    
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent'
  },
  bottomWrapper: {
    flex: 1,
    position: 'absolute',
    bottom: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  imageContainer: {
	flex: 1,
    width: 100, // Adjust the width as per your requirements
    height: 100, // Adjust the height as per your requirements
    justifyContent: 'center', // Center aligns the image vertically
    alignItems: 'center', // Center aligns the image horizontally
  }
})