var React = require('react')

module.exports = React.createClass({
  propTypes: {
      onAnswer: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      arr:[],
      option: ''
    }
  },

   handleChange: function(e) {
    this.props.onAnswer(this.props.name, e.currentTarget.value)
    this.setState({
      option: e.currentTarget.value
    })
   },

  render: function() {
    if(this.props.submit=='true')
    {
      console.log('Latest '+this.state.arr[this.state.arr.length-1])
    }
  //  var defaultOptions = ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"]
    //console.log(JSON.stringify(this.props.question))
    var answerOptions = this.props.question.answerChoices
    return (
      <div className="row questions">
        <div className="form-group">
          <p className="">{this.props.num} . {this.props.question.questionText}</p>
            <div className="question-options row">
              {answerOptions.map(function(ops, opsNum){
              return <div className="col-xs-3">
                        <p>
                          <input type="radio"
                           name={this.props.name}
                           value={ops}
                           onChange = {this.handleChange}
                           checked={this.state.option === ops} />
                            {ops}
                        </p>
                      </div>
            }.bind(this))}
            <hr style={{width:'98%'}}/>
          </div>
        </div>
      </div>
    )
  }
})
