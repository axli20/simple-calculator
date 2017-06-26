//SimpleCalculator.js

import React, { Component } from 'react';
import {
  Text,
  AppRegistry,
  View
} from 'react-native';

//Imports
import Style from './Style';
import InputButton from './InputButton';

//Defining input buttons
const inputButtons = [
    ['CE', '+/-'],
    [1, 2, 3, '/'],
    [4, 5, 6, '*'],
    [7, 8, 9, '-'],
    [0, '.', '=', '+']
];

class SimpleCalculator extends Component {

  constructor(props){
      super(props);

      this.state = {
          afterDecimal: false,
          decimalPlace: 10,
          previousValue: 0,
          inputValue: 0,
          selectedSymbol: null
      }
  }

  /**
   * For each row in 'inputButtons', create a row View and add create an InputButton for each input in row.
   */
  _renderInputButtons() {
      let views = [];

      for(var r = 0; r < inputButtons.length; r++){
          let row = inputButtons[r];

          let inputRow = [];
          for(var i = 0; i < row.length; i++){
              let input = row[i];

              inputRow.push(
                  <InputButton
                      value={input}
                      highlight={this.state.selectedSymbol === input}
                      onPress={this._onInputButtonPressed.bind(this, input)}
                      key={r + "-" + i} />
              );
          }

          views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>);
      }

      return views;
  }

  _onInputButtonPressed(input) {
      switch (typeof input) {
          case 'number':
              return this._handleNumberInput(input)
          case 'string':
              return this._handleStringInput(input)
      }
  }

  _handleNumberInput(num) {
      let inputValue = this.state.afterDecimal ? this.state.inputValue + (num / this.state.decimalPlace): (this.state.inputValue * 10) + num;
      let decimalPlace = this.state.decimalPlace;

      if(this.state.afterDecimal) decimalPlace *= 10;

      this.setState({
        inputValue: inputValue,
        decimalPlace: decimalPlace
      })
  }

  _handleStringInput(str) {
      switch(str) {
          case '/':
          case '*':
          case '+':
          case '-':
              this.setState({
                  selectedSymbol: str,
                  previousValue: this.state.inputValue,
                  inputValue: 0,
                  afterDecimal: false,
                  decimalPlace: 10,
              });
              break;

          case 'CE':
              this.setState({
                  inputValue: 0,
                  previousValue: 0,
                  afterDecimal: false,
                  decimalPlace: 10
              });
          case '=':
              let symbol = this.state.selectedSymbol,
                  inputValue = this.state.inputValue,
                  previousValue = this.state.previousValue;

              if(!symbol) {
                  return;
              }

              this.setState({
                  previousValue: 0,
                  inputValue: eval(previousValue + symbol + inputValue),
                  selectedSymbol: null,
                  decimalPlace: 10,
                  afterDecimal: false,
              });
          case '.':
              this.setState({
                  afterDecimal: true
              });
              break;
      }
  }

  render() {
    return (
        <View style={Style.rootContainer}>
          <View style={Style.displayContainer}>
              <Text style={Style.displayText}>{this.state.inputValue}</Text>
          </View>
          <View style={Style.inputContainer}>
              {this._renderInputButtons()}
          </View>
        </View>
    )
  }
}

AppRegistry.registerComponent('SimpleCalculator', () => SimpleCalculator);
