var React = require('react');
module.exports = React.createClass({
  componentDidUpdate  :function(){
    this.refs.myInput.focus();
  },
  cancer:function(e){
    e.preventDefault();
    this.refs.myInput.value = "";
    this.refs.myArea.value = "";
    this.props.changeQuestion(2);
  },
  add:function(e){
    e.preventDefault();
    var title = this.refs.myInput.value,
        content = this.refs.myArea.value;
    if (title == "") {alert('请输入题目');return;}
    if (content == "") {alert('请输入内容');return;}
    var data = {
      title:title,
      content:content,
      zan:0
    }
    this.refs.myInput.value = "";
    this.refs.myArea.value = "";
    this.props.changeQuestion(1,data);
  },
  render:function(){
    var styleObj={
      display: this.props.isShow ? 'block': 'none'
    }
    return (
      <form name="addQuestion" className="clearfix" style={styleObj}>
        <div className="form-group">
          <label htmlFor="qtitle">问题</label>
          <input type="text" className="form-control" id="qtitle" placeholder="您的问题的标题" ref="myInput" />
        </div>
        <textarea className="form-control" rows="3" placeholder="问题的描述" ref="myArea"></textarea>
        <button className="btn btn-success pull-right" onClick={this.add}>确认</button>
        <button className="btn btn-default pull-right" onClick={this.cancer}>取消</button>
      </form>
    );
  }
});