var React = require('react')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      arr:[]
    }
  },
   handleClick: function(e) {
     var newArray = this.state.arr;
     newArray.push(e.target.value);
     this.setState({arr:newArray})

     var answer = this.state.arr[this.state.arr.length-1]
     //selectedOption.update().e.target.value;
     console.log('Latest '+this.state.arr[this.state.arr.length-1])
     console.log('Full Array '+JSON.stringify(newArray))

   },

  render: function() {
    if(this.props.submit=='true')
    {
      console.log('Latest '+this.state.arr[this.state.arr.length-1])
    }
  //  var defaultOptions = ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"]
    var answerOptions = this.props.question.answerChoices
    return (
      <div className="form-group">
        <p>{this.props.question.questionText}</p>
        <div className="options row">
          {answerOptions.map(function(ops, opsNum){
             return <div className="que-ops col-xs-3">
                      <input type="radio" name={this.props.num} value={"question"+(this.props.num +1) +": '"+ (ops)+"'"} id={"opt" + (this.props.num) + (opsNum)} onClick={this.handleClick}/>
                      <div className="check" ></div>
                       {/*{console.log("opt" + (this.props.num) + (opsNum))}*/}
                      <label htmlFor={"opt" + (this.props.num) + (opsNum)}>
                        {ops}
                        {/*{console.log(ops)}*/}
                      </label>
                    </div>
          }.bind(this))}
        </div>
      </div>
    )
  }
})
