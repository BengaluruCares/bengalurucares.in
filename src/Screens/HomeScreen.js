import React, { Component } from 'react';
import SearchBar from "material-ui-search-bar";

import '../Styling/HomeScreen.css';

class HomeScreen extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         value:null,
         otherValue:'Some other Value'
      };
    };
    doSomethingWith=(Something)=>{
        this.setState({
            otherValue:Something
        })
        console.log("Hi the state is", this.state)
    }
  render() {
    return (
      <div className="HomeScreenWhole">  
      <text className="HelloBangalore">
        Hi Bangalore
      </text>
      <SearchBar
    value={this.state.value}
    onChange={(newValue) => this.setState({ value: newValue })}
    onRequestSearch={() => this.doSomethingWith(this.state.value)}
    cancelOnEscape={true}
    placeholder='enter your pincode'
    className='SearchBar'
  />
      </div>
    );
  }
}

export default HomeScreen;
