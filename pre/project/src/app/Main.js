/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */

import React from 'react'
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopFixedCard from './components/cards/top-card'
import StudentCard from './components/cards/student-card'
// var TopFixedCard = require('./components/cards/top-card').default


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  }
});
class Main extends React.Component {

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div><TopFixedCard /></div>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div><StudentCard /></div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default Main;
