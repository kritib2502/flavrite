import { Text, View, Button, Alert } from 'react-native'
import React  from 'react'

import {launchCameraAsync, useCameraPermissions, PermissionStatus} from 'expo-image-picker';

export default function  GoogleTest () {

    const [cameraPermissionInformation, requestPermission] = useCameraPermissions()

    async function verifyPermissions() {
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
          const permissionResponse = await requestPermission()

          return permissionResponse.granted
        }

        if(cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert('Insufficient Permissions! You need to grant camera permissions to use this app.', [{text: 'Okay'}])
    }
    }
    async function takeImageHandler() {
        const hasPermission = await verifyPermissions()
        if (!hasPermission) {
            return;
        }
        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
          })
          console.log(image)
    }

    return (
      <View>
        <View></View>
        <Button title="Take Image" onPress={takeImageHandler} />
      </View>
    )
}