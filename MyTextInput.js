import React, { Component } from 'react';
import { TextInput } from 'react-native';

export default class MyTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: ''};
  }

  render() {
    return (
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({text})}
        placeholder='Nombre'
        onSubmitEditing={}
      />
    );
  }
}