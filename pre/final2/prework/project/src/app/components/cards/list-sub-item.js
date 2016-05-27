import React from 'react'
import ListItem from 'material-ui/List/ListItem';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import {transparent} from 'material-ui/styles/colors';
module.exports = React.createClass({

  render () {
    return (
      <ListItem
        className="list-sub-item col-lg-3 col-sm-4"
        disabled={true}
        leftAvatar={
          <Avatar
            className="avtar"
            icon={<FontIcon className="" />
          }
        backgroundColor={transparent}
          />
        }
      >
        {this.props.property} <span className="sub-text">{this.props.value}</span>

      </ListItem>
    )
  }
})
