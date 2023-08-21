import React, { useState, useEffect} from 'react';
import {View, FlatList,Text, TouchableOpacity, ScrollBar, Image} from 'react-native';
import uuid from 'react-native-uuid';
import URLS from '../utils/Url';
import HttpClient from '../utils/Api';
import * as Font from 'expo-font';

export default function Recommendation({ navigation, refresh, category})
{
    const [ list, setList] = useState([]);
    const [ listLoading, setListLoading] = useState(true);
    const [fontLoaded, setFontLoaded] = useState(false);

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

    useEffect( _ => {
        setList([])
        getList();
        setListLoading(refresh)
    }, [refresh]);

    const getList = async () =>
    {
        await HttpClient({ 
            url : URLS.GET_RECOMMENDATION + category
        }).then( async res => {
            if(res.status == 200)
            {
                setList(res.data)
                setListLoading(false)
            }
        })
    }

    const getEndList = async () =>
    {
        await HttpClient({ 
            url : URLS.GET_RECOMMENDATION + category
        }).then( async res => {
            if(res.status == 200)
            {
                let temp_list = [...list];
                // temp_list.push(res.data);
                let result_list = temp_list.concat(res.data);
                // console.log(result_list)
                setList(result_list)
                setListLoading(false)
            }
        })
    }


    return (
        <View className='pb-3 mt-6 px-1'>
                <FlatList
                    data={list}
                    horizontal
                    onEndReached={ _ => {
                        // setListLoading(true);
                        getEndList();
                    }}
                    onEndReachedThreshold={0.5}
                    renderItem={ list_item => {
                        let item = list_item.item
                        return (
                            <TouchableOpacity
                                key={uuid.v4()}
                                className='w-48 bg-white rounded-xl flex flex-col p-4 mr-3 ml-3 relative mb-2'
                                stye={[{
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 4.22,
                                    elevation: 3
                                }]}
                                onPress={() => navigation.navigate('ShowFlava', {
                                    item: item
                                })}
                            >
                                <Image 
                                    source={{uri: URLS.PRODUCT_IMG+item.thumbnail}}
                                    className='w-40 h-40'
                                    resizeMode={'contain'}
                                />
                                <View  className='w-full mt-2 px-1'>
                                    <Text   className='text-gray-800 h-6 text-base'
                                    style=
                                    {[{fontFamily: 'Baloo2-Bold'}]}
                                    >
                                        { item.name.length > 13 ? item.name.substring(0,11)+'...' : item.name} 
                                    </Text>
                                    <Text className='text-gray-500 text-sm h-6' 
                                    style={[{fontFamily: 'Baloo2-Bold'}]}>
                                        <>
                                            {
                                                item.brand.id == 1 && item.brand_name ?
                                                (
                                                    <>
                                                    { item.brand_name.length > 13 ? item.brand_name.substring(0,11)+'...' : item.brand_name}
                                                    </>
                                                )
                                                :
                                                <>
                                                    { item.brand.name.length > 13 ? item.brand.name.substring(0,11)+'...' : item.brand.name}
                                                </>
                                            }
                                        </> 
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={item => item.id}
                />
        </View>
    )
}