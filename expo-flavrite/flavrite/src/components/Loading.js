import { View, Text, Image } from 'react-native'

const Loading = () => {
  return (
    <View className="flex flex-grow justify-center items-center p-8 ">
        <Image source={require('../../assets/loading/loading.gif')} style={{width: 145, height: 145, zIndex: 999, elevation: 999}} />
    </View>
  )
}
export default Loading