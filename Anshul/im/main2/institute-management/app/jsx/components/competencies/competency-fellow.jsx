var React = require('react');
var EditableText = require('../common/editable-text');
let competencyStore = require('../../stores/competencyStore');

module.exports = React.createClass({
getInitialState: function() {
  return {edit: false}
},
  propTypes: {
  		onSelect: React.PropTypes.func
	},
    clickCompetency: function (){
    //  alert('inside selectCompetency');
      console.log(this.props.competency)
      this.props.onSelect(this.props.competency);
    },
    updateDescription: function (description){
      competencyStore.dispatch({
        type: 'post',
        description: description,
        competencyName: this.props.competency.competencyName
      })
    },
    clickEdit: function(){
      this.setState({
        edit: true
      });
    },
    editDone: function() {
      this.setState({
      edit: false
      })
      console.log('Inside editDone')
    },

    render: function () {
      var competency = this.props.competency;
      var priorityClass, boxClass;
      //console.log('IN Competency' + competency.competencyName)
      if(competency)
      {
        priorityClass = competency.developmentState === 'priority'?"fa fa-circle priority":
                competency.developmentState === 'strength'?"fa fa-thumbs-up":"fa";

        boxClass = competency.developmentState === 'priority'?"box box-warning":
                competency.developmentState === 'strength'?"box box-success":"box box-default";

                competency.priority?"box box-warning":"box box-success";
      }
      /* <div>  
                              {this.state.edit ? <Editform desc={competency.description} competencyName={competency.competencyName} onDone={this.editDone}/> : competency.description }
                              <div className="box-tools pull-right">
                                  <button className="btn btn-box-tool" onClick={this.clickEdit}>
                                  <i className="fa fa-pencil"></i>
                                  </button>
                              </div>
                          </div>
                           */
        return  <div className="box-header with-border" key = {competency.competencyName} 
                    onClick = {this.clickCompetency} className={boxClass} >
                  
                      <div className="box-header with-border">

                          <h3 className="box-title">{competency.competencyName} </h3>
                          <div className="box-title pull-right">
                              <i className={priorityClass}></i>
                          </div>  
                          <br/>
                           <EditableText value={competency.description} onUpdate={this.updateDescription}/>   
                      </div>    
                      
                  </div>
      }


})
