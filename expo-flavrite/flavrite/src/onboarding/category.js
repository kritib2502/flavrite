import React, { useEffect, useState} from 'react'; // Import react and react hooks
import { // Import react native components
    View,
    ScrollView,
    ActivityIndicator,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { ScrollBar} from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import safe area view
import URLS from '../utils/Url'; // Import URLS
import HttpClient from '../utils/Api'; // Import HttpClient
import * as Font from 'expo-font';
import { avatarImage } from '../components/SwitchCase';


export default function OnBoardingCategory(props) // OnBoardingCategory function
{
    const [ categories, setCategory] = useState([]); // Initialize categories
    const [ loading, setLoading] = useState(true); // Initialize loading
    const [fontLoaded, setFontLoaded] = useState(false);


    
    useEffect( _ => {
        getCategoryList() // Call getCategoryList function
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
      
    
    const getCategoryList = async () =>
    {
        await HttpClient({  // GET USER INFORMATION
            url : URLS.GET_CATEGORIES // URL for GET REQUEST
        }).then( async res => { // Get response from API
            if(res.status == 200) // If status is 200
            { 
                setCategory(res.data) // Set categories to response data
                setLoading(false) // Set loading to false
            }
        })
    }

    return (
        <SafeAreaView className='flex-1' edges={['right', 'left']}>
            {/* Safe area view */}
            <ScrollView style={{
                backgroundColor: '#F3EEEA',
                height: '100%'
            }}>
                <Text className='mt-1' style={{color: `#E76E50`,fontFamily: 'Baloo2-Bold',fontSize: 22,textAlign: 'center',marginTop: '30%'}}>Pick a flavor category{`\n`}to start with.</Text>
                <View className='flex flex-row flex-wrap mt-10 px-5 justify-center'>
                 {
                    loading ? // If loading is true
                    (
                        <ActivityIndicator 
                            size={'large'}
                            color={'white'}
                        />
                    )
                    : categories.map((mini_cat_item, index) => { // Map categories to mini_cat_item and index as parameters
                        return (
                            <View className='w-1/3 mb-5' key={index}>
                                <TouchableOpacity 
                                    onPress={ _ => props.navigation.navigate('OnBoarding', { // On press navigate to OnBoarding
                                        category: mini_cat_item.id // Pass category as mini_cat_item
                                    })}
                                    borderRadius={0} 
                                    // size={TouchableOpacity.sizes.small} 
                                    avoidMinWidth={true}
                                    className='flex flex-col items-center bg-transparent p-0 '>
                                    <View className='bg-white rounded-full p-3'>
                                        <Image 
                                            source={ avatarImage(mini_cat_item.slug)} // Source for image is avatarImage function with mini_cat_item.slug as parameter
                                            style={[{ width: 40, height: 40}]} />
                                    </View>
                                    <Text className='mt-1' style={{color: `black`,fontFamily: 'Baloo2-Bold',fontSize: 15}}>{mini_cat_item.name}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
