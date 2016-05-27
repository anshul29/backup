import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
var AppBarExampleIcon = require('./app-bar').default;
import AppBar from 'material-ui/AppBar';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.state = {
      open: false,
    };
  }

  handleToggle () {
    this.setState({
      open: !this.state.open,
    });
  }

  handleClose (){
    this.setState({
      open: false,
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title="Student Portfolio"
          className="title-page"
          iconElementLeft = {
            <IconButton
              onTouchTap={this.handleToggle}
            ><NavigationMenu /></IconButton>
          }
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onTouchTap={this.handleClose}>My Class</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Student portfolio</MenuItem>
        </Drawer>
      </div>
    );
  }
}
