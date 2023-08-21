import React, {useEffect, useState} from 'react'; // Import react
import { // Import react native components
    View, 
    Image,
} from 'react-native';
import * as Font from 'expo-font';

export default function Emoji(props)  {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
      const loadFonts = async () => {
        await Font.loadAsync({
          'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
          'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
          'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf'),
        });
        setFontLoaded(true);
      };
  
      loadFonts();
    }, []);

    return (
       <>
            {props.product? ( 
              <View className='absolute top-3 right-3'
              style={[
                {
                  zIndex: 999,
                },
              ]}>

                {props.item >= 0 && 
                props.item <= 20 ? ( 
                      <Image
                        source={require('../assets/icons/avatar01.png')} 
                        className='w-10 h-10'
                      />
                ) : null}

                {props.item > 20 && 
                props.item <= 40 ? ( 
                      <Image
                        source={require('../assets/icons/avatar02.png')} 
                        className='w-10 h-10'
                      />
                ) : null} 

                {props.item > 40 && 
                props.item<= 60 ? ( 
                      <Image
                        source={require('../assets/icons/avatar00.png')} // Use avatar00
                        className='w-10 h-10'
                      />
                ) : null}

                {props.item > 60 && // If item product review rate is greater than 60
                props.item <= 80 ? ( // And item product review rate is less than or equal to 80
                      <Image
                        source={require('../assets/icons/avatar03.png')} // Use avatar03
                        className='w-10 h-10'
                    />
                ) : null}

                {props.item > 80 && // If item product review rate is greater than 80
                props.item <= 100 ? ( // And item product review rate is less than or equal to 100
                      <Image
                        source={require('../assets/icons/avatar05.png')} // Use avatar05
                        className='w-10 h-10'
                    />
                ) : null}

              </View>
        ) : null}
    </>     
    )
}   