import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { FormLabel, FormInput, CheckBox, Button,FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class FormTermo extends Component {
  constructor(props) {
    super(props);
    this.state = { nombre: '', 
                   descripcion:'',
                   checkedTermo:false,
                   checkedYerbera:false,
                   checkedMate:false,
                   checkedAzucarera:false,
                   requiredNombre:false,
                   nombreRepetido:false,
                   checkedCompleto:false};
  }

  comprobarNombre(nombre){
    var myThis = this;
      fetch('https://termoslp.herokuapp.com/findName?nombre='+nombre).then(function(response) {
                console.log('done', response);
                if(response.status != 201){
                  myThis.setState({nombreRepetido:true});
                }else{
                  myThis.setState({requiredNombre:false});
                  myThis.setState({nombreRepetido:false});
                  myThis.props.callback(myThis.state);
                }
              });
  }


  onSubmitPress(){
    console.log("-----------Entro al callback en FormTermo "+this.state);
    if(this.state.nombre !=''){
      this.comprobarNombre(this.state.nombre);
    }
    if (this.state.nombre == '')
      this.setState({requiredNombre:true});
  }


  render() {
    return (
  
      <View>
        <FormLabel labelStyle={{fontSize:20, fontWeight:'bold'}}> Nombre</FormLabel>
        <FormInput inputStyle={{fontSize:20,color:'black'}} onChangeText={(text) => this.setState({nombre:text})}/> 
        
        {this.state.requiredNombre ?
        (<FormValidationMessage>Este campo es requerido</FormValidationMessage>
        ) : null
        }

        {this.state.nombreRepetido ?
        (<FormValidationMessage>El nombre del pedido ya existe. Ingrese un nombre válido</FormValidationMessage>
        ) : null
        }

        <FormLabel labelStyle={{fontSize:20, fontWeight:'bold'}}>Descripcion</FormLabel>
        <FormInput inputStyle={{fontSize:20,color:'black'}} multiline = {true}
         numberOfLines = {6} maxLength={220}  textAlignVertical={'top'} onChangeText={(text) => this.setState({descripcion:text})}/>


        <CheckBox
          title='Combo completo'
          checked={this.state.checkedCompleto}
          onPress={() => this.setState({checkedCompleto: !this.state.checkedCompleto})}
        />

        <CheckBox
          title='Termo'
          checked={this.state.checkedTermo}
          onPress={() => this.setState({checkedTermo: !this.state.checkedTermo})}
        />
        <CheckBox
          title='Mate'
          checked={this.state.checkedMate}
          onPress={() => this.setState({checkedMate: !this.state.checkedMate})}
        />
        <CheckBox
          title='Yerbera'
          checked={this.state.checkedYerbera}
          onPress={() => this.setState({checkedYerbera: !this.state.checkedYerbera})}
        />

        <CheckBox
          title='Azucarera'
          checked={this.state.checkedAzucarera}
          onPress={() => this.setState({checkedAzucarera: !this.state.checkedAzucarera})}
          />

        <View style={{alignItems: 'center',marginBottom: 5,marginTop:5}}>
          <Button
          textStyle={{ fontWeight: 'bold' }}
          buttonStyle={{
            backgroundColor: "orange",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
            title='ENVIAR PEDIDO'
            text='ENVIAR PEDIDO'
            onPress={() => this.onSubmitPress()}
          />
        </View>
        </View>
 
    );
  }
}