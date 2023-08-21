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

export default function List({ navigation, refresh, category})
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
            url : URLS.GET_WISHLIST + category
        }).then( async res => {
            if(res.status == 200)
            {
                setList(res.data)
                setListLoading(false)
            }
        })

    }

    const removeFromWishlist = async (id) => 
    {
        // setListLoading(true)
        let tt = [...tempWished];
        tt.push(id)
        setTempWished(tt)
        await HttpClient({ 
            url : URLS.DELETE_WISHLIST,
            data: {
                product: id
            }
        }, 'POST').then( async res => {})
    }

    const addToWishlist = async (id) =>
    {
        let tt = [...tempWished];
        tt = tt.filter(item => item != id)
        setTempWished(tt)
        await HttpClient({ 
            url : URLS.ADD_TO_WISHLIST,
            data: {
                product: id
            }
        }, 'POST').then( async res => {})
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
                {
                    !tempWished.includes(row.product.id) ? 
                    (
                        <TouchableOpacity 
                            onPress={ _ => removeFromWishlist(row.product.id)}
                            className='p-0 bg-transparent absolute top-4 right-4'
                            avoidMinWidth={true}
                        >
                            <Image 
                                source={require('../assets/icons/wishon.png')}
                                style={[{ width: 30, height: 30}]} />
                        </TouchableOpacity>
                    ) :
                    (
                        <TouchableOpacity
                            className='p-0 bg-transparent absolute top-4 right-4'
                            onPress={ _ => addToWishlist(row.product.id)}
                            avoidMinWidth={true}

                        >
                            <Image 
                                source={require('../assets/icons/wishoff.png')}
                                style={[{ width: 30, height: 30}]} />
                        </TouchableOpacity>
                    )
                }
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
                            ) : null
                        }
                    </View>
                </View>
                <View></View>
            </TouchableOpacity>
        );
    }

    return (
        <View className='px-4 mt-4'>
            <Text className='text-sm text-left text-gray-500' style={[{fontFamily: 'Baloo2-Bold'}]}>WISHLIST</Text>
            {
                !listLoading ? 
                (
                    <View className='w-full mt-2'>
                        {list.map((item, index) => renderRow(item, index))}
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