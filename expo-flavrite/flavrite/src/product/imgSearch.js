import React from 'react';
import {
	ImageBackground,
	Dimensions,
	StyleSheet,
	View,
	Text,
	ScrollBar,
	TouchableOpacity
} from 'react-native';
import URLS from '../utils/Url';
import HttpClient from '../utils/Api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Async from '../utils/Async';
import ToasterLoader from '../utils/ToasterLoader';
import {RNCamera} from 'react-native-camera';
import MlkitOcr from 'react-native-mlkit-ocr';
import ImageEditor from '@react-native-community/image-editor';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import * as Font from 'expo-font'
import { TouchableOpacity } from 'react-native';


class ImageSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			loading: false,
			toast: false,
			toast_message: null,
			show: false,
			step: 1,
			founds: [],
			croppedImg: null,
		};
	}

  	async componentDidMount() {
		// GET USER INFORMATION
		await Font.loadAsync({
			'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
			'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
			'DaysOne-Regular': require('../assets/fonts/DaysOne-Regular.ttf')
		});
		// Set fontLoaded state to true
		this.setState({ fontLoaded: true });
  	}

	getTexts = data => {
		let texts = [];
		data = data.slice(0, 7);
		data.forEach(element => {
			texts.push(element.text);
		});
		return texts;
	};

	takePicture = async () => {
		this.setState({
			loading: true,
		});
    	this.camera.pausePreview();
    	if (this.camera) {
      		const options = {
				quality: 0.5,
				base64: true,
				skipProcessing: true,
				forceUpOrientation: true,
      		};
      		const data = await this.camera.takePictureAsync(options);
      		var waitingUri = null;
      		let cropData = {
				offset: {x: 380, y: 1000},
				size: {width: 1200, height: 1800},
				displaySize: {width: 1000, height: 1200},
				resizeMode: 'contain',
      		};
			// STORE IMAGE AND GET UUID
			let token = JSON.parse(await AsyncStorage.getItem('utk'));
			var imgForServer = null;
			await RNFetchBlob.fetch(
        		'POST',
        		URLS.UPLOAD_PRODUCT_IMG,
        		{
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
					// here's the body you're going to send, should be a BASE64 encoded string
					// (you can use "base64"(refer to the library 'mathiasbynens/base64') APIs to make one).
					// The data will be converted to "byte array"(say, blob) before request sent.
				},
        		[
					{
						name: 'avatar',
						filename: 'avatar.png',
						data: data.base64,
					},
        		],
      		)
			.then(res => {
				imgForServer = JSON.parse(res.data)['data'];
			})
			.catch(err => {
				// error handling ..
				console.log(err);
			});
      		ImageEditor.cropImage(data.uri, cropData).then(async url => {
        		waitingUri = url;
				const resultFromUri = await MlkitOcr.detectFromUri(waitingUri);
				RNFS.readFile(url, 'base64').then(async bres => {
          			let textAfterOpt = this.getTexts(resultFromUri);
					this.setState({
						text_founders: textAfterOpt,
						image: data.base64,
						file: data.uri,
					});
          			let cat = (await AsyncStorage.getItem('category')) ?? 1;
					// CALL SEARCHING
					await HttpClient({
						url:
						URLS.SEARCH_PRODUCT +
						JSON.stringify(textAfterOpt) +
						'&cat=' +
						cat +
						'&img=' +
						imgForServer,
					}).then(async res => {
						if (res.status == 200) {
							this.setState({
								loading: false,
								products: res.data,
							});
						}
						if (res.data.length) {
							this.setState({
								founds: res.data,
								step: 2,
							});
						} else {
						this.camera.resumePreview();
						this.props.navigation.navigate('AddFlava', {
							image: data.base64,
							file: data.uri,
						});
						}
						// this.props.navigation.navigate('TextSearchFlava', {
						//     products: res.data
						// })
          			});
        		});
      		});
      		// IF DOESNT FOUND GO TO TEXT SEARCH MODE
    	}
  	};

  	render() {
    	return (
      	<>
        	<View className= 'flex justify-between items-center px-6 mb-10 w-full flex-row absolute top-12'
          		style={[{
              		zIndex: 999,
            	}]}
			>
          		<TouchableOpacity
            		className='border-0 bg-transparent p-0 flex items-center justify-start'
            		style={[{
                		zIndex: 999,
              		}]}
            		borderRadius={0}
            		onPress={_ => this.props.navigation.goBack()}
				>
            		<Ionicons name={'chevron-back-outline'} size={30} color={'#fff'} />
					<Text
						className='text-base'
						style={[{
							fontFamily: 'Baloo2-Bold',
							color: '#fff',
						}]}
					>
					Back
					</Text>
          		</TouchableOpacity>
        	</View>
        <RNCamera
          	ref={ref => {
            	this.camera = ref;
          	}}
          	className = 'h-full w-full absolute top-0 left-0'
			type={RNCamera.Constants.Type.back}
			// flashMode={RNCamera.Constants.FlashMode.on}
			androidCameraPermissionOptions={{
				title: 'Permission to use camera',
				message: 'We need your permission to use your camera',
				buttonPositive: 'Ok',
				buttonNegative: 'Cancel',
          	}}
          	androidRecordAudioPermissionOptions={{
				title: 'Permission to use audio recording',
				message: 'We need your permission to use your audio',
				buttonPositive: 'Ok',
				buttonNegative: 'Cancel',
          	}}
          	captureAudio={false}
        />
        <View
			className = 'w-72 h-72 bg-transparent absolute top-0 left-0'
			style={[{
              zIndex: 998,
            }]}>
		</View>
        {this.state.step === 1 ? (
          	<ImageBackground
				source={require('../assets/images/cameralayout.png')}
				className='h-full w-full absolute top-0 left-0 relative flex items-center justify-center'
				style={[{
                	zIndex: 997,
              	}]}
			>
				<TouchableOpacity
					borderRadius={0}
					onPress={_ => this.takePicture()}
					className='flex-col rounded-full'
					style={[{
						backgroundColor: '#E76E50',
						marginTop: 500,
                	}]}
              	>
					<Text
						className='text-center text-sm text-white font-bold'
						style={[{
							fontFamily: 'Baloo2-Bold',
						}]}>
						SCAN PACKAGE
					</Text>
            	</TouchableOpacity>
            <TouchableOpacity
              	className='p-0 m-0 bg-transparent mt-20'
             	borderRadius={0}
              	avoidMinWidth={true}
              	onPress={_ => this.props.navigation.navigate('TextSearchFlava')} 
            >
				<Text
					className='text-center text-base text-white font-bold'
					style={[{
						fontFamily: 'Baloo2-Bold',
					}]}
				>
                Search Flavor
              	</Text>
            </TouchableOpacity>
        </ImageBackground>
        ) : null}

        {this.state.step === 2 ? (
          	<View
            	className='h-full w-full absolute top-0 left-0 relative flex items-center justify-center'
            	style={[{
                zIndex: 998,
                backgroundColor: 'rgba(0,0,0,.7)',
              	}]}
			>
				<ScrollBar
					focusIndex={0}
					gradientWidth={0}
					className='py-3 pb-6'
				>
              		{this.state.founds.map(item => {
                		return (
							<TouchableOpacity
								className='bg-transparent p-2'
								style={[{
									width:
									this.state.founds.length === 1
										? Dimensions.get('window').width
										: Dimensions.get('window').width - 40,
								}]}
								onPress={_ =>
								this.props.navigation.navigate('ShowFlava', {
									item: item,
								})}
							>
								<View
									className='w-full bg-white rounded-xl flex flex-col p-6'
									style={[{
										shadowColor: '#000',
										shadowOffset: {
											width: 0,
											height: 1,
										},
										shadowOpacity: 0.12,
										shadowRadius: 4.22,
										elevation: 3,
									}]}
								>
									<Image
										source={{uri: URLS.PRODUCT_IMG + item.thumbnail}}
										className='w-full h-72'
										resizeMode={'contain'}
									/>
									<View className='w-full mt-4 px-1'>
				                        <Text
										className='text-gray-800 text-2xl text-center'
										style={[{fontFamily: 'Baloo2-Bold'}]}
										>
											{item.name.length > 13
												? item.name.substring(0, 15) + '...'
												: item.name}
										</Text>`
										<Text
										className='text-gray-500 text-center'
										style={[{fontFamily: 'Baloo2-Bold'}]}
										>
											{item.brand.name.length > 13
												? item.brand.name.substring(0, 20) + '...'
												: item.brand.name}
										</Text>
                      				</View>
                    			</View>
                  			</TouchableOpacity>                   
                		);
              		})}
            	</ScrollBar>
            	{this.state.founds.length && this.state.founds.length === 1 ? (
              	<TouchableOpacity
                	borderRadius={0}
                	onPress={_ =>
                  		this.props.navigation.navigate('ShowFlava', {
                    		item: this.state.founds[0],
                  		})
                	}
                	className='w-3/4 flex-col rounded-full mt-10'
                	style={[{
                    	backgroundColor: '#E76E50',
                  	}]}
                >
					<Text
						className='text-center text-base py-2 text-white font-bold'
						style={[{
							fontFamily: 'Baloo2-Bold',
						}]}
					>
                  	CONFIRM & RATE IT
                	</Text>
              	</TouchableOpacity>
            ) : (
              	<View className='flex flex-col items-center justify-center mt-5'>
                	<Text
						className='text-center text-sm text-white'
						style={[{
                      		fontFamily: 'Baloo2-Bold',
                    	}]}
					>
                  	We found multiple product matches
                	</Text>
					<Text
						className='text-center text-3xl text-white mt-2'
						style={[{
							fontFamily: 'Baloo2-Bold',
							}]}
					>
					{`Select the correct`}
					</Text>
					<Text
						className='text-center text-3xl text-white -mt-2'
						style={[{
							fontFamily: 'Baloo2-Bold',
						}]}
					>
					{`product`}
					</Text>
              	</View>
            )}

            <View className='flex flex-col items-center justify-center mt-10'>
              	<Text
					className='text-center text-sm text-white'
					style={[{
                    	fontFamily: 'Baloo2-Bold',
                  	}]}
				>
                Can’t locate it?
              	</Text>

              	<TouchableOpacity
					borderRadius={0}
					onPress={_ =>
						this.props.navigation.navigate('AddFlava', {
							image: this.state.image,
							file: this.state.file,
						})
					}
                	className= 'w-3/4 flex-col rounded-full bg-transparent bg-white mt-2'         
                >
                <Text
					className='text-center text-sm text-black font-bold'
					style={[{
						fontFamily: 'Baloo2-Bold',
					}]}
				>
                Add it as New Product
                </Text>
            </TouchableOpacity>
        </View>
	</View>
    ) : null}

    <View className='hidden w-full flex items-center flex-col px-5 mt-12'>
        <TouchableOpacity
            onPress={_ => this.props.navigation.navigate('TextSearchFlava')}
            className='bg-gray-500 mt-4'
            title='Search By Text'
        >
            <Text className='text-white text-xs'>
            	Search By Text
			</Text>
        </TouchableOpacity>
    </View>

	<ToasterLoader
		loading={this.state.loading}
		toast={this.state.toast}
		toast_message={this.state.toast_message}
		toast_loader={this.state.toast_loader}
	/>
    </>
    );
  }
}

const styles = StyleSheet.create({
  	container: {
		backgroundColor: '#494949',
		height: '100%',
  	},
  	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
  	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
});

export default ImageSearch;
