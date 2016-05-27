import React from 'react';
import AppBar from 'material-ui/AppBar';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';

const AppBarExampleIcon = () => (
  <AppBar
    title="Student Portfolio"
    className="title-page"
    iconElementLeft = {
      <IconButton ><NavigationMenu /></IconButton>
    }
  />
);

export default AppBarExampleIcon;
