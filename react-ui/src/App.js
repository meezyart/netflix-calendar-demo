import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import './App.css';
import Calendar from './Calender';


export const Routes = () => (
    <Router >
      <Switch>
        <Route exact path='/:month/:year' component={Calendar}/>
        <Route path='/' component={Calendar}/>
      </Switch>
    </Router>
)
class App extends Component {


  render() {
    return (
      <div className="App">
        <Routes/>
      </div>
    );
  }
}

export default App;
