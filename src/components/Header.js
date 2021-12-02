import React from "react";
import { Link } from 'react-router-dom';
import AppMenu from "./AppMenu";
import {connect} from "react-redux";
import {selectApplication} from "../actions";


class Header extends React.Component {

    // componentDidMount() {
    //     console.log(this.props.match.params.appName)
    // }

    render(){
        return (
            <div className="header">
                <div className="ui secondary menu">
                    <React.Fragment>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </React.Fragment>
                    <div className="item">
                        <Link className="logo" to ={`/Log/${this.props.selectedApplication}`} >
                            ITNAV-Configurator
                        </Link>
                    </div>
                    <React.Fragment>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    </React.Fragment>
                    <div className="item">
                        <Link className="link" to ={`/Log/${this.props.selectedApplication}`} >
                            Log |
                        </Link>
                    </div>
                    <div className="item">
                        <Link className="link" to={`/ConnectionString/${this.props.selectedApplication}`} >
                            Connection String |
                        </Link>
                    </div>
                    <div className="item">
                        <Link className="link" to={`/AppOrWebConfig/${this.props.selectedApplication}`} c>
                            App/WebConfig
                        </Link>
                    </div>
                </div>
            </div>

        )
    }

}


const mapStateToProps = (state) => {
    return {
        selectedApplication: state.selectedApplication


    }
}

export default connect(mapStateToProps, {
    selectApplication
})(Header);
