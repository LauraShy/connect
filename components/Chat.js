import React from 'react';
import { View, Text, Button } from 'react-native';

export default class Chat extends React.Component {
  
  render() {
    let name = this.props.route.params.user;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Welcome!</Text>
      </View>
    );
  }
}