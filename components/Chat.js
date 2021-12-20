import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native-web';

export default class Chat extends React.Component {
  
  render() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    const { bgImg } = this.props.route.params;

    return (
      <View style={styles.container}>
        <ImageBackground
          source={bgImg}
          resizeMode='cover'
          style={styles.bgImg}>
          <Text>Welcome!</Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'center',
  },
  bgImg: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'center',
  }
});