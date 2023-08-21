import React, { useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import Slider from '@react-native-community/slider';


const Player = ({setSliderValue, val}) => {
    // const playbackState = usePlaybackState();
    const [progress, setProgress] = useState(val);
  
    const [trackArtwork, setTrackArtwork] = useState('');
    const [trackTitle, setTrackTitle] = useState('');
    const [trackArtist, setTrackArtist] = useState('');


    function backgroundChanger()
    {
        if(progress >= 0 && progress <= 20)
        {
            return '#DC4848';
        }
        if(progress > 20 && progress <= 40)
        {
            return '#E87F7F';
        }
        if(progress > 40 && progress <= 60)
        {
            return '#232323';
        }
        if(progress > 60 && progress <= 80)
        {
            return '#2ecc71';
        }
        if(progress > 80 && progress <= 100)
        {
            return '#27ae60';
        }
    }
    
    return (
        <View className='mb-2 px-10 items-center'>
            { progress >= 0 && progress <= 20 ? <Image source={require('../assets/icons/avatar01.png')} className='w-24 h-24'/> : null }
            { progress > 20 && progress <= 40 ? <Image source={require('../assets/icons/avatar02.png')} className='w-24 h-24'/> : null }
            { progress > 40 && progress <= 60 ? <Image source={require('../assets/icons/avatar00.png')} className='w-24 h-24'/> : null }
            { progress > 60 && progress <= 80 ? <Image source={require('../assets/icons/avatar03.png')} className='w-24 h-24'/> : null }
            { progress > 80 && progress <= 100 ? <Image source={require('../assets/icons/avatar05.png')} className='w-24 h-24'/> : null }
            <View className='w-full flex-row justify-center items-center'>
                <Slider
                    style={{width: '100%'}}
                    value={progress}
                    minimumValue={0}
                    maximumValue={100}
                    thumbTintColor={backgroundChanger()}
                    minimumTrackTintColor="#C4C4C4"
                    maximumTrackTintColor="#C4C4C4"
                    onValueChange={async value => {
                      let sliderValue = Math.floor(value);
                      setProgress(sliderValue)
                      setSliderValue(sliderValue)
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
screenContainer: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'center',
},
contentContainer: {
    flex: 1,
    alignItems: 'center',
},
topBarContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
},
queueButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD479',
},
artwork: {
    width: 240,
    height: 240,
    marginTop: 30,
    backgroundColor: 'grey',
},
titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 30,
},
artistText: {
    fontSize: 16,
    fontWeight: '200',
    color: 'white',
},
progressContainer: {
    height: 40,
    width: 380,
    marginTop: 25,
    flexDirection: 'row',
},
progressLabelContainer: {
    width: 370,
    flexDirection: 'row',
    justifyContent: 'space-between',
},
progressLabelText: {
    color: 'white',
    fontVariant: ['tabular-nums'],
},
actionRowContainer: {
    width: '60%',
    flexDirection: 'row',
    marginBottom: 100,
    justifyContent: 'space-between',
},
primaryActionButton: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD479',
},
secondaryActionButton: {
    fontSize: 14,
    color: '#FFD479',
},
});

export default Player;