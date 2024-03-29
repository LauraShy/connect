import React from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Camera } from "expo-camera";


export default class CustomActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
    };
  }

  // let user pick image from device's library
  imagePicker = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console,log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // let user take a photo with device's camera
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // get the location of the user by using GPS
  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }).catch((error) => {
          console.error(error);
        });
        const longitude = location.coords.longitude;
        const latitude = location.coords.latitude;
        if (location) {
          this.props.onSend({
            location: {
              longitude,
              latitude,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // upload images to firebase
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  // display action menu
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return;
          case 1:
            console.log('user wants to take a photo');
            return;
          case 2:
            console.log('user wants to get their location');
          default:  
        }
      },
    );
  };

  render() {
    return (
      <TouchableOpacity 
        accessible={true}
        accessibilityLabel='More options'
        accessibilityHint='You can choose to send an image or your geolocation.'
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};