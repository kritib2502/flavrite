import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import Constants from 'expo-constants';
export default function CameraView() {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef(null);
    let stringImageUri = "";

    useEffect(() => {
        (async () => {
			MediaLibrary.requestPermissionsAsync();
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);


    if (hasCameraPermission === false) {
      	return <Text>No access to camera</Text>;
    }

    const cropImage = async () => {
      	try {
			const manipResult = await manipulateAsync(
				image,
				[{ resize: { width: 800, height: 600 } }],
				[{ crop: { originX: 0, originY: 0, width: 200, height: 200 } }],
				{ compress: 1, format: SaveFormat.PNG }
			);
			setImage(manipResult.uri);
		} catch (e) { 
			console.log(e);
		}
    }


    return (
        <View style={styles.container}>
          	{!image ? (
				<Camera
					style={styles.camera}
					type={type}
					ref={cameraRef}
					flashMode={flash}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingHorizontal: 30,
						}}
					>
                    	<TouchableOpacity
							onPress={() => {
								setType(
									type === Camera.Constants.Type.back
										? Camera.Constants.Type.front
										: Camera.Constants.Type.back
								);
							}}>
                    		<Text> Flip </Text>
                		</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								setFlash(
									flash === Camera.Constants.FlashMode.off
										? Camera.Constants.FlashMode.on
										: Camera.Constants.FlashMode.off
								);
							}}>
							<Text> Flash </Text>
						</TouchableOpacity>
              		</View>
            	</Camera>
          	) : (
            	<Image source={{ uri: image }} style={styles.camera} />
          	)}
      		<View style={styles.controls}>
        		{image ? (
          			<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingHorizontal: 50,
						}}
          			>
						<TouchableOpacity
							onPress={() => {    
								setImage(null);
							}}>
							<Text> Clear </Text>
						</TouchableOpacity>


						<TouchableOpacity
							onPress={async () => {
								if (image) {    
									await MediaLibrary.saveToLibraryAsync(image);
								}
							}}>
							<Text> Save </Text>
						</TouchableOpacity>
        			</View>
        		) : (
        	<View>
        <TouchableOpacity
			onPress={async () => {  
				if (cameraRef) {   
					let photo = await cameraRef.current.takePictureAsync();
					console.log(photo);
					setImage(photo.uri);
				}
			}}>
			<Text> Take </Text>
    	</TouchableOpacity>
    	</View>
    )}
    </View>
    </View>
    );
}
    
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		paddingTop: Constants.statusBarHeight,
		backgroundColor: '#000',
		padding: 8,
	},
	controls: {
		flex: 0.5,
		backgroundColor: 'white',
	},
	button: {
		height: 40,
		borderRadius: 6,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#E9730F',
		marginLeft: 10,
	},
	camera: {
		flex: 5,
		borderRadius: 20,
	},
	topControls: {
		flex: 1,
		backgroundColor: 'transparent',
		zIndex: 100,
		color: 'white',
	},
});
