var React = require('react')
var ReactRouter = require('react-router')
var Link = require('react-router').Link

var userStore = require('../../stores/userStore')
var mainStore = require('../../stores/mainStore')

var Library = require('../links/library')
var SidebarItem = require('./sidebar-item')

module.exports = React.createClass({

    getInitialState: function () {
      return {
        userDetails: {},
        menuList: [
          {iconClass:"fa fa-home", name:"Home", url:"/home"},
          {iconClass:"fa fa-files-o", name:"Competencies", url:"/competencies"},
          {iconClass:"fa fa-pie-chart", name:"Surveys", url:"/surveys"},
          // {iconClass:"fa fa-calendar", name:"Calendar", url:"/calendar", count:"3"},
          {iconClass:"fa fa-book", name:"Library", url:"/library"},
          {iconClass:"fa fa-edit", name:"Resources", url:"/resources"}
        ],
        selectedItem: 'Home'
      }
    },
    componentDidMount: function () {
      var userDetails = userStore.getState()
      if(userDetails)
        this.setState({
          userDetails: userDetails
        })
      else{
        userStore.dispatch({type: 'check'})
        userStore.subscribe(function () {
          userDetails = userStore.getState()
          if(userDetails)
            this.setState({
              userDetails: userDetails
            })
          }.bind(this))
      }
    },
    selectItem: function(itemName){
      this.setState({
          selectedItem: itemName
      })
    },
    render: function () {

      var menuList = this.state.menuList.map(item => {
          return <SidebarItem key={item.name} item={item} active={item.url === this.props.pathname}/>
      })

      return <div>
      <aside className="main-sidebar">
        <section className="sidebar">
          <div className="user-panel">
            <div className="pull-left image">
              <img src={this.state.userDetails.pictureURL} className="img-circle" alt="User Image" />
            </div>
            <div className="pull-left info">
            <p>{this.state.userDetails.displayName}</p>
             {(function (self) {
                // if(self.state.userDetails.role === 'fellow')
                //   return <div>Fellow 2016</div>
                // else
                  return <div>{self.state.userDetails.title}</div>

              })(this)}
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="header">INSTITUTE 1</li>
           {menuList}
        </ul>
      </section>
    </aside>
      </div>
    }

})
