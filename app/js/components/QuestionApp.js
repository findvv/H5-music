var React = require('react');
var AddButton = require('./AddButton.js');
var QuestionForm = require('./QuestionForm.js');
var QuestionList = require('./QuestionList.js');
module.exports = React.createClass({
  getInitialState:function(){
    var questions = [
    {
      key:0,
      title:'产品经理与程序员矛盾的本质是什么？',
      content:'理性探讨，请勿撕逼。产品经理的主要工作职责是产品设计。接受来自其他部门的需求，经过设计后交付研发。但这里有好些职责不清楚的地方。',
      zan:22
    },
    {
      key:1,
      title:'热爱编程是一种怎样的体验？',
      content:'别人对玩游戏感兴趣，我对写代码、看技术文章感兴趣；把泡github、stackoverflow、v2ex、reddit、csdn当做是兴趣爱好；遇到重复的工作，总想着能不能通过程序实现自动化；喝酒的时候把写代码当下酒菜，边喝边想边敲；不给工资我也会来加班；做梦都在写代码。',
      zan:12
    }
    ];
    return ({
      questions:questions,
      showForm:false
    });
  },
  clickButton:function(){
    this.setState({
      showForm:true
    });
  },
  changeQuestion:function(type,data){
    if (type==1) {
      var questions = this.state.questions
      data.key = questions.length;
      var newQuestions = questions;
      newQuestions.push(data);
      this.setState({
        questions:newQuestions
      });
    }
    if (type==2) {
      this.setState({
        showForm:false
      });
    }    
  },
	render:function(){
		return (
			<div>
				<div className="jumbotron text-center">
          <div className="container">
            <h1>React问答</h1>
            <AddButton clickButton={this.clickButton} />
          </div>
        </div>
        <div className="main container">
          <QuestionForm isShow={this.state.showForm} changeQuestion={this.changeQuestion}/>
          <QuestionList questions={this.state.questions}/>
        </div>
  	  </div>
		)
	}
})