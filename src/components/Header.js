import React from "react";
import { Link } from 'react-router-dom';
import AppMenu from "./AppMenu";
import {connect} from "react-redux";
import {selectApplication} from "../actions";


class Header extends React.Component {

    render(){
        return (
            <div className="header">
                <div className="ui secondary menu">
                    <React.Fragment>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </React.Fragment>
                    <div className="item">
                        <Link className="logo" to ={`/${this.props.selectedApplication}/Log`} >
                            ITNAV-Configurator
                        </Link>
                    </div>
                    <React.Fragment>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    </React.Fragment>
                    <div className="item">
                        <Link className="link" to ={`/${this.props.selectedApplication}/Log`} >
                            Log |
                        </Link>
                    </div>
                    <div className="item">
                        <Link className="link" to={`/${this.props.selectedApplication}/ConnectionString`} >
                            Connection String |
                        </Link>
                    </div>
                    <div className="item">
                        <Link className="link" to={`/${this.props.selectedApplication}/AppOrWebConfig`} c>
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
