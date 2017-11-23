import React from "react";
import { connect } from "dva";

class IndexPage extends React.Component{
  constructor() {
    super();
    this.state = {

    }
  }

  render(){
    return(
      <div>我是newFinanceApply</div>
    )
  }
}

function mapStateToProps({employee}) {
  return {employee};
}
export default connect(mapStateToProps)(IndexPage);
