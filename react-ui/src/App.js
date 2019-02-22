import React, { Component } from 'react';
import './App.css';
import Calendar from './Calender';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      releases: null,
      fetching: true
    };
  }

 

  render() {
    return (
      <div className="App">
        <Calendar releases={this.state.releases}/>
      </div>
    );
  }
}

export default App;
