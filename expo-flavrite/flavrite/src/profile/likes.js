import React, { useState, useEffect} from 'react'; // import React 
import {Text, TouchableOpacity, Image,View} from 'react-native'; // import React Native components
import { ScrollBar } from 'react-native-ui-lib';

// import tailwind from 'tailwind-rn';
// import SkeletonContent from '@03balogun/react-native-skeleton-content'; // import Skeleton Content Component
import uuid from 'react-native-uuid'; // import UUID for keys
import URLS from '../utils/Url'; // import URLS for API
import HttpClient from '../utils/Api'; // import API Client
import * as Font from 'expo-font'; // import Font

export default function Recommendation({ navigation, items}) // export function with navigation and refresh props
{
    const [ list, setList] = useState(items); // set list state with items props
    // const [ listLoading, setListLoading] = useState(true);

    // useEffect( _ => {
    //     getList();
    //     setListLoading(refresh)
    // }, [refresh]);

    const [fontLoaded, setFontLoaded] = useState(false);  // set fontLoaded state to false
    useEffect( _ => { // load fonts on component mount
        loadFontsAsync(); // load fonts async
    }, [])

    const loadFontsAsync = async () => { // load fonts async
        await Font.loadAsync({ // load fonts async with Font.loadAsync
            'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'), // load Baloo2-Bold
            'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'), // load Baloo2-Regular
            'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf') // load DaysOne-Regular
        });
        setFontLoaded(true); // set fontLoaded state to true
      };
      
    return (
        <View className='pb-3'>
            {/* Skeleton Content */}
            {/* <SkeletonContent
                className='w-full flex-row'
                isLoading={false}
                boneColor={'lightgray'}
                layout={[
                    { key: 'someId', width: 190, height: 240, borderRadius: 10, marginRight: 20, marginLeft: 10 },
                    { key: 'someId', width: 190, height: 240, borderRadius: 10, marginRight: 20 },
                    { key: 'someId', width: 190, height: 240, borderRadius: 10, marginRight: 20 }
                ]}
            ><ScrollBar focusIndex={0} className='pb-2'>
                {
                    list.map((item) => { // map list items
                        return (
                            // TouchableOpacity for item click and navigation to ShowFlava screen 
                            <TouchableOpacity
                                key={uuid.v4()} 
                                className='w-48 bg-white rounded-xl flex flex-col p-6 mr-3 ml-3 mb-1'
                                style={[{
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 4.22,
                                    elevation: 3
                                    }]}
                                    onPress={() => navigation.push('ShowFlava', {
                                        item: item.product
                                    })}
                                >

                                    <Image 
                                        source={{uri: URLS.PRODUCT_IMG+item.product.thumbnail}}
                                        className='w-40 h-40'
                                        resizeMode={'contain'}
                                    />

                                    <View className='w-full mt-2 px-1'>
                                        <Text className='text-gray-800 text-lg' style={[ {fontFamily: 'Baloo2-Bold'}]}>{ item.product.name.length > 11 ? item.product.name.substring(0,11)+'...' : item.product.name}</Text>
                                        <Text className='text-gray-500' style={[ {fontFamily: 'Baloo2-Bold'}]}>{ item.product.brand.name.length > 16 ? item.product.brand.name.substring(0,16)+'...' : item.product.brand.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollBar>
            </SkeletonContent> */}
        </View>
    )
}