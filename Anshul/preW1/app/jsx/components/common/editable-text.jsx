var React = require('react');

module.exports = React.createClass({

  propTypes: {
  		onUpdate: React.PropTypes.func
	},

getInitialState: function () {
  return {
    edit: false
  }
},  

clickEdit: function() {
  this.setState({
    edit: true
  })
},

updateText: function(event) {
  console.log(event)
  event.preventDefault()
  
  var newValue = this.refs.textArea.value;
  
  if(newValue !== this.props.value)
    this.props.onUpdate(newValue)
  
  this.setState({
      edit: false
    })
},

render: function(){
  let currentValue = this.props.value;

  if(this.state.edit)
    return <form onSubmit = {this.updateText}>
            <div className="input-group">
              <input type="textarea" name="message" ref="textArea" placeholder={currentValue} className="form-control"/>
              <span className="input-group-btn">
                <input type="submit" className="btn btn-warning btn-flat" value = "Update"/>
              </span>
            </div>
          </form>
  else
    return <div>  
              {currentValue}
              <div className="box-tools pull-right">
                  <button className="btn btn-box-tool" onClick={this.clickEdit}>
                  <i className="fa fa-pencil"></i>
                  </button>
              </div>
            </div>        
}
});
