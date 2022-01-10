import React from 'react';
import { initializeApp } from 'firebase/app';
import { View, Text, Button, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { ImageBackground } from 'react-native-web';
import { Bubble, GiftedChat, SystemMessage } from 'react-native-gifted-chat';

const firebase = require('firebase');
const app = initializeApp(firebaseConfig);

// firebase configuration for chat
const firebaseConfig = {
  apiKey: "AIzaSyDoDZgLQ6llH5XmpE1Nj0R_qXQTvdD78IY",
  authDomain: "connect-app-5b29f.firebaseapp.com",
  projectId: "connect-app-5b29f",
  storageBucket: "connect-app-5b29f.appspot.com",
  messagingSenderId: "674826866650",
  appId: "1:674826866650:web:de489391c9b2fad8187ae3"
};

export default class Chat extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: 'Logging in...',
      user: {
        _id: '',
        name: '',
      }
    };
    // initializing firebase
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    // reference to firebase messages collection
    this.referenceChatMessages = firebase.firestore().collection('messages');
    // this.referenceMessageUser = null;
  }

  componentDidMount() {
    // sets the page title and adds users name to the nav 
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
      });
      // create reference to active user's messages
      this.referenceMessagesUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  // stop listening to auth and collection changes
  componentWillUnmount() {
		this.authUnsubscribe();
		this.unsubscribe();
	}

  // stores and adds new messages to database
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  // callback function for when user sends a message
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  // allows user to see new messages when database updates
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each doc
    querySnapshot.forEach((doc) => {
      // get the docs data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages: messages
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#808080'
          }
        }}
      />
    )
  }

  render() {
    // pulls background image selection from Start screen
    const { bgImg } = this.props.route.params;

    return (
      <View style={styles.container}>
        <ImageBackground
          source={bgImg}
          resizeMode='cover'
          style={styles.bgImg}>
          <View style={styles.chat}>  
              <GiftedChat
                renderBubble={this.renderBubble.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                  _id: 1,
                }}
              />
          </View>  
        </ImageBackground>
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImg: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  chat: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 8,
  }
});