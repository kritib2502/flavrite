import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardStack, { Card } from 'react-native-deck-swiper';
import URLS from '../utils/Url';
import HttpClient from '../utils/Api';
import * as Font from 'expo-font';
import {AnimatedSwiper, AnimatedSwiperRef} from 'react-native-tinder-cards-view';

export default function Rating(props) {
  const [list, setList] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // console.log("This console log has been activated");
    getList();
    loadFontsAsync();
  }, []);

  const loadFontsAsync = async () => {
    await Font.loadAsync({
      'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
      'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
      'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
    });
    setFontLoaded(true);
  };

  const getList = async () => {

    await HttpClient({
      url: URLS.GET_RECOMMENDATION + props.route.params.category,
      
    }).then(async res => {
      if (res.status == 200) {
        setList([res.data]);
        // console.log(res.data);
      }

    });
  };

  const likeRight = async cardIndex => {
    await HttpClient(
      {
        url: URLS.LIKE,
        data: {
          product: list[cardIndex]['id'],
        },
      },
      'POST',
    ).then(async res => {});
  };

  const skipCard = () => {
    swiper.swipeLeft();
  };

  const nextCard = () => {
    swiper.swipeRight();
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <LinearGradient
        colors={['#F3EEEA', '#fff']}
        style={[{
          height: '100%',
        }]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginTop: 6 }}>
          <View style={{ width: '20%' }}>
            <TouchableOpacity
              style={{ zIndex: 999 }}
              borderRadius={0}
              onPress={() => props.navigation.navigate('MainStack')}
            >
              <Ionicons
                name={'chevron-back-outline'}
                size={30}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 20, color: '#E76E50', fontFamily: 'Baloo2-Bold', textAlign: 'center', width: '60%' }}>FIND YOUR FLAVRITES!</Text>
          <View style={{ width: '20%' }}></View>
        </View>

		<View className='flex-1 w-full mt-10 flex-col'>
    {list && list.length === 0 ? (
      <View className='flex items-center justify-center pt-20'>
        <ActivityIndicator size={'large'} color={'gray'} />
      </View>
    ) : null}

    <CardStack
      ref={swiper => {
        this.swiper = swiper;
      }}
      style={{ flex: 1 }}
      renderNoMoreCards={() => (
        <>
          {list && list.length ? (
            <View className='w-full h-2/4 items-center justify-center'>
              <TouchableOpacity
                className='bg-black w-40'
                onPress={_ => props.navigation.navigate('MainStack')}
              >
                <Text className='text-white'>Go To Home</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      )}
      onSwipedRight={cardIndex => likeRight(cardIndex)}
      renderCard={card => (
        <Card>
          <RenderCard
            key={card.id} // Assuming `id` is a unique identifier for each card
            skip={skipCard}
            next={nextCard}
            card={card}
            {...props}
          />
        </Card>
      )}
    >
      {list.map(card => card)} {/* Assuming `list` is an array of cards */}
    </CardStack>
  </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function RenderCard(props) {
  const [flava, setFlava] = useState(props.card);
  const [cardFlipped, setCardFlipped] = useState(false);

  function flipCard() {
    setCardFlipped(true);
  }

  function undoFlipCard() {
    setCardFlipped(false);
  }

  const wish = async () => {
    setFlava({ ...flava, wished: true });
    await HttpClient(
      {
        url: URLS.ADD_TO_WISHLIST,
        data: {
          product: flava.id,
        },
      },
      'POST',
    ).then(async res => {});
  };

  const diswish = async () => {
    setFlava({ ...flava, wished: false });
    await HttpClient(
      {
        url: URLS.DELETE_WISHLIST,
        data: {
          product: flava.id,
        },
      },
      'POST',
    ).then(async res => {});
  };

  const like = async () => {
    setFlava({ ...flava, liked: true });
    props.next();
    await HttpClient(
      {
        url: URLS.LIKE,
        data: {
          product: flava.id,
        },
      },
      'POST',
    ).then(async res => {});
  };

  const unLike = async () => {
    setFlava({ ...flava, liked: false });
    await HttpClient(
      {
        url: URLS.DISLIKE,
        data: {
          product: flava.id,
        },
      },
      'POST',
    ).then(async res => {});
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {!cardFlipped ? (
          <TouchableOpacity onPress={flipCard} style={styles.flipButton}>
            <Ionicons name={'chevron-up'} size={30} color={'#333'} />
          </TouchableOpacity>
        ) : null}

        {/* Render card content here */}

        <View style={styles.likeButtons}>
          <TouchableOpacity onPress={props.skip} style={styles.button}>
            <Image source={require('../assets/icons/rate-close-btn.png')} style={styles.buttonImage} />
          </TouchableOpacity>
          {flava.wished ? (
            <TouchableOpacity onPress={diswish} style={styles.button}>
              <Image source={require('../assets/icons/rate-wishlist-btn.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={wish} style={styles.button}>
              <Image source={require('../assets/icons/rate-wishlist-btn-gray.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          )}
          {flava.liked ? (
            <TouchableOpacity onPress={unLike} style={styles.button}>
              <Image source={require('../assets/icons/rate-heart-btn.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={like} style={styles.button}>
              <Image source={require('../assets/icons/rate-heart-btn-gray.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4EFE9',
    height: '100%',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 7.49,
    elevation: 12,
  },
  flipButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 999,
  },
  likeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 10,
  },
  buttonImage: {
    width: 20,
    height: 20,
  },
});
