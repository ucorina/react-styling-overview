import React, { Component } from 'react';
import './App.css';
import dataService from './services/dataService';
import LibrariesGrid from './components/LibrariesGrid';

let data = [];
let isDataLoaded = false;

class App extends Component {
  render() {
    return (
      <div>
        <div className='contentWrapper'>
          <header>
            <h1>React styling libraries overview</h1>
            <div>React styling libraries ordered by number of downloads and stars</div>
          </header>
          <div className='gridContainer'>
            <LibrariesGrid data={data} isLoading={!isDataLoaded} />
          </div>
          <a href="https://github.com/ucorina/react-styling-overview">
            <img style={{ position: 'absolute', top: 0, right: 0, border: 0}}
                 src="https://camo.githubusercontent.com/e7bbb0521b397edbd5fe43e7f760759336b5e05f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677265656e5f3030373230302e706e67"
                 alt="Fork me on GitHub"
                 data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png"
            />
          </a>
        </div>
        <footer>
          <p>Created by <a href='https://twitter.com/ucorina28' target='_blank' rel="noopener noreferrer">@ucorina28</a> | <a href='http://jsramblings.com' target='_blank' rel="noopener noreferrer">jsramblings.com</a></p>
        </footer>
      </div>
    );
  }

  componentDidMount() {
    dataService.getReactStylingLibraries().then(response => {
      isDataLoaded = true;
      data = response;
      this.forceUpdate();
    });
  }
}

export default App;
