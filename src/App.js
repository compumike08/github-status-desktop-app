import React, { Component } from 'react';
import Header from './components/common/Header';
import ReposContainer from './components/repos/ReposContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <ReposContainer/>
      </div>
    );
  }
}

export default App;
