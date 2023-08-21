import React from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ImageBackground,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  Image,
  Picker,
} from 'react-native';

import URLS from '../utils/Url';
import HttpClient from '../utils/Api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ToasterLoader from '../utils/ToaserLoader';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import { TouchableOpacity } from 'react-native';


class AddFlava extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			user: null,
			loading: false,
			toast: false,
			toast_message: null,
			show: false,
			categories: [
				{
					id: 1,
					name: 'Coffee',
				},
			],
      		brands: ['afw', 'af'],
			name: '',
			category: '',
			brand: '',
			temp_file: '',
			brands: [],
      		selectedBrand: {
        		selectedBrand: null,
      		},
      		selectedCategory: {
        		selectedCategory: null,
      		},
			userBrand: null,
			brand_name: null,
   		};
  	}

  async componentDidMount() {
    	await HttpClient({
      		url: URLS.GET_BRANDS,
    	}).then(res => {
      		this.setState({
        		brands: res.data,
      		});
    	});

    	await HttpClient({
      		url: URLS.GET_CATEGORIES,
    	}).then(res => {
      		this.setState({
        		categories: res.data,
     		});
    	});
  	}

  	async selectFile() {
    	this.setState({
      		toast: true,
      		toast_message: 'Uploading Image ...',
      		toast_loader: true,
    	});

    	var options = {
      		title: 'Select Image',
			customButtons: [
				{
				name: 'customOptionKey',

				title: 'Choose file from Custom Option',
				},
			],
			storageOptions: {
				skipBackup: true,

				path: 'images',
			},
			includeBase64: true,
			maxWidth: 800,
			maxHeight: 800,
    	};

    	launchImageLibrary(options, async res => {
      		// console.log('Response = ', res);
      		if (res.didCancel) {
        		// console.log('User cancelled image picker');
      		} else if (res.error) {
        		// console.log('ImagePicker Error: ', res.error);
      		} else if (res.customButton) {
        		// console.log('User tapped custom button: ', res.customButton);
        		alert(res.customButton);
      		} else {
        		let source = res;
        		this.setState({
          			resourcePath: source,
        		});
        		let token = JSON.parse(await AsyncStorage.getItem('utk'));
        		RNFetchBlob.fetch(
          			'POST',
          			URLS.UPLOAD_FALAVA_IMG,
          			{
            			Authorization: `Bearer ${token}`,
            			'Content-Type': 'multipart/form-data',
            			// here's the body you're going to send, should be a BASE64 encoded string
            			// (you can use "base64"(refer to the library 'mathiasbynens/base64') APIs to make one).
            			// The data will be converted to "byte array"(say, blob) before request sent.
          			},
          			[
            			{
              				name: 'flava',
              				filename: 'flava.png',
              				data: this.state.resourcePath.assets[0].base64,
            			},
          			],
        		)
          		.then(res => {
            		// console.log(JSON.parse(res.data)['data'])
            		this.setState({
              			toast: false,
              			toast_loader: false,
              			temp_file: JSON.parse(res.data)['data'],
            		});
          		})
          		.catch(err => {
            		// error handling ..
          			console.log(err);
				});
      		}
    	});
  	}

  	async add_flava() {
    	// GET USER INFORMATION
    	if (this.state.name.length == 0) {
      		this.setState({
        		toast: true,
        		toast_message: 'All fields are required.',
        		toast_loader: false,
      		});
      		setTimeout(
        		_ =>
          		this.setState({
            		toast: false,
          		}),
        		2000,
      		);
      		return false;
    	}
    	await ImagePicker.openCropper({
      		path: this.props.route.params.file,
      		width: 300,
      		height: 300,
      		includeBase64: true,
    	}).then(async image => {
      	this.setState({
        	toast: true,
        	toast_message: 'Adding Flava ...',
        	toast_loader: true,
      	});
      	let token = JSON.parse(await AsyncStorage.getItem('utk'));
      	await RNFetchBlob.fetch(
        	'POST',
        	URLS.UPLOAD_FALAVA_IMG,
        	{
          		Authorization: `Bearer ${token}`,
          		'Content-Type': 'multipart/form-data',
          		// here's the body you're going to send, should be a BASE64 encoded string
          		// (you can use "base64"(refer to the library 'mathiasbynens/base64') APIs to make one).
          		// The data will be converted to "byte array"(say, blob) before request sent.
        	},
        	[{name: 'flava', filename: 'flava.png', data: image.data}],
      	).then(async res => {
        await HttpClient(
          	{
            	url: URLS.ADD_FALAVA,
            	data: {
              		name: this.state.name,
              		category: this.state.selectedCategory.value,
              		brand: this.state.selectedBrand.value,
              		thumb: JSON.parse(res.data)['data'],
              		brand_name: this.state.brand_name,
            	},
          	},
        'POST',
        ).then(async res => {
        	if (res.status == 200) {
            	this.setState({
              		toast_message: 'Flava Added!',
              		toast_loader: false,
              		toast: false,
            	});
            this.props.navigation.navigate('ShowFlava', {
              	item: res.data,
              	home: true,
            });
          	}
        });
    });
    });
    Keyboard.dismiss();
  	}	

  	render() {
    	return (
      		<SafeAreaView style={[styles.container]}>
        		<StatusBar barStyle={'light-content'} />
        			<KeyboardAvoidingView behavior={'position'}>
          				<ScrollView>
            				<View className='flex justify-center items-center px-3 w-full flex-row my-4'>
              					<View className='w-1/3 items-start'>
                					<TouchableOpacity
                  						className='border-0 bg-transparent p-0 flex items-center justify-start'
                  						title='Back'
                    					style={[{
                      						zIndex: 999,
                    					}]}
                  						borderRadius={0}
                  						onPress={_ => this.props.navigation.goBack()}
									>
                  						<Ionicons
                    						name={'chevron-back-outline'}
                    						size={30}
                    						color={'#fff'}
                  						/>
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
              					
								<Text className='text-xl text-center font-bold w-1/3'
                					style={[{
                    					color: '#fff',
                    					fontFamily: 'Baloo2-Bold',
                  					}]}
								>
                				ADD FLAVOR
              					</Text>
              					<View className='w-1/3 items-start'></View>
            				</View>
            				<View className='w-full flex flex-col px-5 mt-4'>
              					<View className='items-center w-full'>
                					<ImageBackground
                  						source={require('../assets/images/addflavabase.jpeg')}
                  						resizeMode={'contain'}
                  						className='h-72 w-64 relative flex items-center justify-center'
									>
                  						<Image
                    						className='w-full rounded-md h-64 w-48'
                    						resizeMode={'cover'}
                    						source={{
                      							uri:'data:image/png;base64,' +this.props.route.params.image,
                    						}}
                  						/>
                					</ImageBackground>
                				<View className='flex flex-col items-center justify-center my-10 mb-5'>
                  					<Text className='text-center text-2xl py-2 text-white font-bold'
                    					style={[{
                    						fontFamily: 'Baloo2-Bold',
                    					}]}
                    				>
                    				Add New Product
                  					</Text>
                				</View>
                			<TextInput
                  				placeholder="Name of the product"
                  				className='border-2 border-white rounded-md m-0 p-3 text-white'
								style={[
									{
									fontFamily: 'Baloo2-Bold',
									},
								]}
								hideUnderline={true}
								containerStyle={[className='w-full', {borderWidth: 0}]}
								onChangeText={text =>
									this.setState({
										name: text,
									})
								}
								color={'#fff'}
								placeholderTextColor={'#fff'}
                			/>

							<Picker
								value={this.state.selectedCategory}
								placeholder={'Select Category'}
								onChange={item => {
									this.setState({
									selectedCategory: item,
									});
								}}
								className='border-2 border-white rounded-md m-0 p-3 text-white'
								style={[{
									fontFamily: 'Baloo2-Bold',
								}]}
								hideUnderline={true}
								placeholderTextColor={'#fff'}
								containerStyle={[className='w-full', {borderWidth: 0}]}
								showSearch={true}
							>
                  			{this.state.categories.map((item, index) => {
                    		return (
								<Picker.Item
									key={index}
									value={item.id}
									label={item.name}
								/>
                    		);
                  		})}
               		</Picker>
                <Picker
					value={this.state.selectedBrand}
					placeholder={'Select Brand'}
					onChange={item => {
						this.setState({
							selectedBrand: item,
						});
					}}
					className='border-2 border-white rounded-md m-0 p-3 text-white'
					style={[{
						fontFamily: 'Baloo2-Bold',
						}]}
					hideUnderline={true}
					placeholderTextColor={'#fff'}
					containerStyle={[className='w-full', {borderWidth: 0}]}
					showSearch={true}>
                  	{this.state.brands.map((item, index) => {
						return (
						<Picker.Item
							key={index}
							value={item.id}
							label={item.name}
						/>
						);
                  	})}
                </Picker>

                {this.state.selectedBrand.value == 1 ? (
                  	<TextField
						placeholder="Type product brand name"
						className='border-2 border-white rounded-md m-0 p-3 text-white'
						style={[{
							fontFamily: 'Baloo2-Bold',
						}]}
						hideUnderline={true}
						containerStyle={[className='w-full', {borderWidth: 0}]}
						onChangeText={text =>
							this.setState({
								brand_name: text,
							})
						}
						color={'#fff'}
						placeholderTextColor={'#fff'}
                  	/>
                ) : null}
				<TouchableOpacity
					borderRadius={0}
					onPress={_ => this.add_flava()}
					className='w-full flex-col rounded-full'
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
                    ADD NEW PRODUCT
                  	</Text>
                </TouchableOpacity>
                {/* Category */}
            </View>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
        <ToasterLoader
			loading={this.state.loading}
			toast={this.state.toast}
			toast_message={this.state.toast_message}
			toast_loader={this.state.toast_loader}
        />
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#000',
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

export default AddFlava;
