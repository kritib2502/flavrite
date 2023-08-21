import React, { useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,   
  View,
  Image,
  ScrollView,
  Text,
  ListItem,
  ScrollBar,
  TouchableOpacity
} from 'react-native';
// import SkeletonContent from '@03balogun/react-native-skeleton-content';
import { useIsFocused } from '@react-navigation/native';
import * as Font from 'expo-font';
import URLS from '../utils/Url';
import HttpClient from '../utils/Api';
import uuid from 'react-native-uuid';
//comment

export default function LikedProducts({ navigation, refresh, category, category_name})
{
    const [ list, setList] = useState([]);
    const [ listLoading, setListLoading] = useState(true);

    const [ tempWished, setTempWished] = useState([]);

    const isFocused = useIsFocused();
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        setListLoading(true)
        setTempWished([])
        isFocused && getList()
      },[isFocused]);

    useEffect( _ => {
        setList([])
        setTempWished([])

        getList();
        setListLoading(refresh)
    }, [refresh]);

    useEffect( _ => {
        loadFontsAsync();
    }, [])

    const loadFontsAsync = async () => {
        await Font.loadAsync({
            'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
            'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
            'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
        });
        setFontLoaded(true);
      };
      
    const getList = async () =>
    {
        await HttpClient({ 
            url : URLS.EXPLORE_CATEGORY + category
        }).then( async res => {
            if(res.status == 200)
            {
                setList(res.data)
                setListLoading(false)
            }
        })

    }


    function renderRow(row, id) {
        return (
            <TouchableOpacity 
                key={uuid.v4()}
                onPress={() => navigation.navigate('ShowFlava', {
                    item: row.product
                })}
                style={[{
                    borderColor: '#F4EFEA'
                }]}
                className='border bg-white rounded-xl overflow-hidden flex flex-row justify-between items-center p-4 py-4 mb-3'
            >

                <View className='flex flex-row items-center -ml-1 py-1'>
                    {
                        row.product.thumbnail ?
                        (
                            <Image
                                source={{uri: URLS.PRODUCT_IMG+row.product.thumbnail}}
                                resizeMode={'contain'}
                                className='w-20 h-20 rounded-md'
                            />
                        ) :
                        (
                            <Image 
                                source={require('../assets/icons/sample.jpeg')}
                                resizeMode={'contain'}
                                className='w-20 h-20 rounded-md'
                            />
                        )
                    }
                    <View className='px-3 justify-start h-20'>
                        <View>
                            <Text className='text-base h-7 w-48'style={[ {
                                color: '#4A4A4A',
                                fontFamily: 'Baloo2-Bold'
                            }]}>{ row.product.name.length > 13 ? row.product.name.substring(0,20)+'...' : row.product.name}</Text>
                            {
                                row.brand ? 
                                (
                                    <Text className='text-xs -mt-2' style={[{color: '#4A4A4A',fontFamily: 'Baloo2-Regular'}]}>{row.brand.name}</Text>
                                ) : null
                            }
                        </View>
                        {
                            row.product.report ? 
                            (
                                <View className='flex flex-row items-center mt-2'>
                                    {
                                        row.product.report.avatar ? 
                                        (
                                            <Image
                                                source={{ uri: URLS.PROFILE_IMG+row.product.report.avatar}}
                                                resizeMode={'cover'}
                                                className='w-6 h-6 rounded-full border border-gray-300 bg-gray-100'
                                            />
                                        ) : 
                                        (
                                            <Image
                                                source={require('../assets/icons/avatar.jpeg')}
                                                resizeMode={'cover'}
                                                className='w-6 h-6 rounded-full border border-gray-300 bg-gray-100'
                                            />
                                        )
                                    }
                                    <View className='flex flex-col'>
                                        <Text className='text-gray-500 ml-2' style={[{fontFamily: 'Baloo2-Regular', fontSize: 10}]}>People who also </Text>
                                        <Text className='text-gray-500 ml-2 -mt-1' style={[{fontFamily: 'Baloo2-Regular', fontSize: 10}]}>Like this flavour</Text>
                                    </View>
                                </View>
                            ) : null}
                    </View>
                </View>
                {row.product.review? ( 
              <View className='absolute top-3 right-3'
              style={[
                {
                  zIndex: 999,
                },
              ]}>

                {row.product.review.rate >= 0 && 
                row.product.review.rate <= 20 ? ( 
                      <Image
                        source={require('../assets/icons/avatar01.png')} 
                        className='w-10 h-10'
                      />
                ) : null}

                {row.product.review.rate > 20 && 
                row.product.review.rate <= 40 ? ( 
                      <Image
                        source={require('../assets/icons/avatar02.png')} 
                        className='w-10 h-10'
                      />
                ) : null} 

                {row.product.review.rate > 40 && 
                row.product.review.rate <= 60 ? ( 
                      <Image
                        source={require('../assets/icons/avatar00.png')} // Use avatar00
                        className='w-10 h-10'
                      />
                ) : null}

                {row.product.review.rate > 60 && // If item product review rate is greater than 60
                row.product.review.rate <= 80 ? ( // And item product review rate is less than or equal to 80
                      <Image
                        source={require('../assets/icons/avatar03.png')} // Use avatar03
                        className='w-10 h-10'
                    />
                ) : null}

                {row.product.review.rate > 80 && // If item product review rate is greater than 80
                row.product.review.rate<= 100 ? ( // And item product review rate is less than or equal to 100
                      <Image
                        source={require('../assets/icons/avatar05.png')} // Use avatar05
                        className='w-10 h-10'
                    />
                ) : null}

              </View>
        ) : null}

                <View></View>
            </TouchableOpacity>
        );
    }

    return (
        <View className='px-4 mt-4'>
            {
                !listLoading ? 
                (
                    <View className='w-full mt-2'>
                        {list.length > 0 ?  ( list.map((item, index) => renderRow(item, index)) ) : (
  <View className='flex flex-col items-center justify-center relative'>
    <Image
      source={require('../assets/images/people-celebrating-online.png')} // Set image path
      style={{ width: '72%', aspectRatio: 1 }}
      resizeMode={'contain'}
    />
    <Text
      className='text-center text-xl -mt-7'
      style={[
        {
          color: '#E06060',
          fontFamily: 'Baloo2-Bold',
          fontSize: 20,
        },
      ]}
    >
      Scan in your first {category_name} to {'\n'} get started in this category
    </Text>
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('ImageSearchFlava') // Navigate to ImageSearchFlava screen
      }
      className='relative flex flex-col items-center justify-center mx-5 absolute top-48 mt-5 right-20'
      style={[
        {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ]}
    >
      <View
        className='bg-white flex flex-col items-center justify-center -mt-7 w-14 h-14 rounded-full'
        style={[{ backgroundColor: '#E76E50' }]}
      >
        <Image
          source={require('../assets/icons/plus-icon.png')} // Set image path for plus icon
          style={{ width: 20, height: 20 }}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      activeOpacity={0.7}
      onPress={_ =>
        navigation.push('OnBoarding', { 
          // Navigate to OnBoarding screen with selected category
          category: category, // Set selected category
        })
      }
      className='relative flex flex-col items-center justify-center -mt-10'
    >
      <Text
        className='text-gray-500 text-center mt-20 border-bottom'
        style={[
          {
            fontFamily: 'Baloo2-Bold',
            fontSize: 16,
          },
        ]}
      >
        ...or rate some popular {'\n'} flavors from the community.
      </Text>
    </TouchableOpacity>
  </View>
 
)}
                    </View>
                ) : 
                (
                    <View>
                    <Text>Loading...</Text>

                    </View>
                )
            }
        </View>
    )
}