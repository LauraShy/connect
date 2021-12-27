import React from 'react';
import { View, Text, Button, ImageBackground, Image, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

import start_bg from '../assets/connect_start.png';
import connect_logo from '../assets/connect_logo.png';
import blue from '../assets/bg-blue.png';
import green from '../assets/bg-green.png';
import purple from '../assets/bg-purple.png';

export default class Start extends React.Component {

  state = {
    name: '',
    bgImg: start_bg,
  };

  setBgImage = (img) => {
    this.setState({ bgImg: img });
  };

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ImageBackground
          source={this.state.bgImg}
          resizeMode='cover'
          style={styles.bgImg}
        >
          <Image
              source={connect_logo}
              style={styles.connect_logo}
          />
          <View style={styles.box}>
            <View style={styles.input_box}>
              <Icon
                style={styles.iconStyle}
                name='user'
                size={30}
                color='#888'
              />
              <TextInput
                style={styles.input_text}
                onChangeText={(text) => this.setState({ name: text })}
                placeholder=' Enter your name...'
              />
            </View>
            <View style={styles.bg_box}>
              <Text>Choose Background Color</Text>
              <View style={styles.pickColor}>
                <TouchableOpacity onPress={() => this.setBgImage(start_bg)}>
                  <View style={styles.color1}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setBgImage(blue)}>
                  <View style={styles.color2}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setBgImage(purple)}>
                  <View style={styles.color3}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setBgImage(green)}>
                  <View style={styles.color4}></View>
                </TouchableOpacity>
              </View>
              <Button 
              color='black'
              title="Start Connecting"
              onPress={() => this.props.navigation.navigate('Chat', {
                name: this.state.name,
                bgImg: this.state.bgImg,
              })}
            />
            </View>
            </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  connect_logo: {
    flex: .6,
    width: '50%',
    height: 'auto',
    resizeMode: 'contain',
    marginTop: 80,
  },
  iconStyle: {
    marginLeft: 15,
    marginRight: 15,
    height: 25,
    width: 25,
    alignItems: 'center',
  },
  input_box: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    maxHeight: 50,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 0,
    marginBottom: 15,
  },
  input_text: {
    borderColor: 'white', //obviously not working
    marginRight: 15,
  },
  box: {
    backgroundColor: 'white',
    width: '85%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    height: 250,
    justifyContent: 'space-evenly',
    borderRadius: 20,
    margin: 20,
  },
  bg_box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  pickColor: {
    flex: .6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  color1: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#FF914D',
    marginRight: 5,
    marginLeft: 5,
  },
  color2: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#5B797E',
    marginRight: 5,
    marginLeft: 5,
  },
  color3: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#7E5B79',
    marginRight: 5,
    marginLeft: 5,
  },
  color4: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#7E9662',
    marginRight: 5,
    marginLeft: 5,
  },
});