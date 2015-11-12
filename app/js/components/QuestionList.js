var React = require('react');
function clickUp(e){
  console.log(e);
}
module.exports = React.createClass({
  render:function(){
    var questions = this.props.questions;
    var that = this;
    var allQuestions = questions.map(function(q){
      return(
        <div className="media" key={q.key}>
          <div className="media-left" data-key={q.key}>
            <button className="btn btn-default" onclick="clickUp()">
              <span className="glyphicon glyphicon-chevron-up"></span>
              <span className="vote-count">{q.zan}</span>
            </button>
            <button className="btn btn-default" onClick={that.clickDown}>
              <span className="glyphicon glyphicon-chevron-down"></span>
            </button>
          </div>
          <div className="media-body">
            <h4 className="media-heading">{q.title}</h4>
            <p>{q.content}</p>
          </div>
        </div>
      );
    });
    
    return (
      <div id="questions" className="">            
        {allQuestions}
      </div>
    );
  }
})
