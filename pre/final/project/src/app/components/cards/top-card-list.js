import React from 'react'
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';


module.exports = React.createClass({

  render () {
    return (
      <ListItem
        className={(this.props.className) || "col-sm-4"}
        disabled={true}
        leftAvatar={
          <Avatar
            className="avtar"
            icon={<FontIcon className={this.props.iconName}/>}
            backgroundColor = {this.props.bgColor}
            src={this.props.src}
          />
        }
      >
        {this.props.property} <span className="sub-text">{this.props.value}</span>
      </ListItem>
    )
  }
})
