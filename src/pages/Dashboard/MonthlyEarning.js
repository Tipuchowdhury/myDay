import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

import ApexRadial from "./ApexRadial";

class MonthlyEarning extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    console.log(props);
  }

  render() {
    const { arrears } = this.props;
    return (
      <React.Fragment>
        {" "}
        <Card>
          <CardBody>
            <CardTitle className="mb-4 h4">Monthly Arrears</CardTitle>
            <Row>
              <Col sm="6">
                <p className="text-muted">This month</p>
                <h3>{Number(this.props.arrears).toFixed(2)} %</h3>
                {/* <p className="text-muted">
                  <span className="text-success me-2">
                    {" "}
                    12% <i className="mdi mdi-arrow-up"></i>{" "}
                  </span>{" "}
                  From previous period
                </p> */}
                <div className="mt-4">
                  <Link to="/propertylist" className="btn btn-info btn-sm">
                    View More <i className="mdi mdi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </Col>
              <Col sm="6">
                <div className="mt-4 mt-sm-0">
                  {this.props ? (
                    this.props.arrears ? (
                      <ApexRadial series={this.props?.arrears} />
                    ) : null
                  ) : null}
                </div>
              </Col>
            </Row>
            {/* <p className="text-muted mb-0">
              We craft digital, graphic and dimensional thinking.
            </p> */}
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default MonthlyEarning;
