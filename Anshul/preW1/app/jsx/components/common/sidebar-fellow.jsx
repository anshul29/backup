var React = require('react');
var userStore = require('../../stores/userStore');
var mainStore = require('../../stores/mainStore');
var Library = require('../links/library');
var Link = require('react-router').Link;

module.exports = React.createClass({
    getInitialState: function () {
      return {
        userDetails: {},
      }
    },
    componentDidMount: function () {
          userStore.dispatch({type: 'check'})
          userStore.subscribe(function () {
            let userDetails = userStore.getState()
            if(userDetails)
              this.setState({
                userDetails: userDetails
              })
            }.bind(this))
    },
    render: function () {
  		return <div>
      <aside className="main-sidebar">
        <section className="sidebar">
          <div className="user-panel">
            <div className="pull-left image">
              <img src={this.state.userDetails.pictureURL} className="img-circle" alt="User Image" />
            </div>
            <div className="pull-left info">
            <p>{this.state.userDetails.displayName}</p>
             Fellow 2016
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="header">MAIN NAVIGATION</li>
          <li className="active treeview">
            <a href="#">
              <i className="fa fa-dashboard"></i> <span>Home</span>
            </a>

          </li>
          <li className="treeview">
            <Link to="/competencies">
              <i className="fa fa-files-o"></i>
              <span>Competencies</span>
              <span className="label label-primary pull-right"></span>
            </Link>
          </li>
          <li>
            <Link to="/calendar">
              <i className="fa fa-calendar"></i> <span>Calendar</span>
              <small className="label pull-right bg-red">3</small>
            </Link>
          </li>
          <li className="treeview">
            <Link to="/surveys">
              <i className="fa fa-pie-chart"></i>
              <span>Survey</span>
            </Link>
          </li>
          <li className="treeview">
            <Link to="/library">
              <i className="fa fa-book"></i>
              <span>Library</span>
            </Link>
          </li>
          <li className="treeview">
            <Link to="/resources">
              <i className="fa fa-edit"></i> <span>Resources</span>
            </Link>
          </li>
        </ul>
      </section>
    </aside>
      </div>
  				}
})
