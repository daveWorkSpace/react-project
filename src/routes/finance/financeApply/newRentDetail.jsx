import React from "react";
import { connect } from "dva";

class NewRentDetail extends React.Component{
  constructor() {
    super();
    this.state = {

    }
  }

  render(){
    return(
      <div>我是newRentDetail</div>
    )
  }
}

function mapStateToProps({employee}) {
  return {employee};
}
export default connect(mapStateToProps)(NewRentDetail);
