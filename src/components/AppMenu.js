import { fallDown as Menu } from 'react-burger-menu'
import React from "react";
import {connect} from "react-redux";
import {
  selectApplication
} from "../actions";
import {Link} from "react-router-dom";

class AppMenu extends React.Component {


    constructor(props) {
        super(props);
        this.state = {isOpen: false};
    }



 componentDidMount() {

 }

     handleOnOpen() {
         document.querySelector(".bm-menu-wrap").classList.add("open-sidebar");
         document.querySelector(".page-wrapper").classList.add("page-wrapper-sidebar-open");
        this.setState({
            isOpen: true
        })
    }

    handleOnClose () {
        document.querySelector(".bm-menu-wrap").classList.remove("open-sidebar");
        document.querySelector(".page-wrapper").classList.remove("page-wrapper-sidebar-open");
        this.setState({
            isOpen: false
        })

    }

    showSettings (event) {
        event.preventDefault();
    }



    render () {
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        let links =[];
        if(this.props.applications.length != 0) {
            for(let i = 0 ; i < this.props.applications.length; i++){
                links.push( <Link
                    key={i}
                    to={`/Log/${this.props.applications[i].Name}`}
                    id="home" className="menu-item"
                    onClick={(e)=> {
                        this.props.selectApplication(this.props.applications[i].Name)
                         // setTimeout(() => {  window.location.replace(`/Log/${this.props.applications[i].Name}`); }, 2000);
                       }
                    }>
                    {this.props.applications[i].Name}
                </Link>);
            }

            return (

                        <div className='menu-outer-container'>
                        <Menu onOpen={ ()=> this.handleOnOpen() } onClose={ () => this.handleOnClose() } isOpen={this.state.isOpen} >
                            {links}
                        </Menu>
                        </div>


            );
        }
        else
            return (
                <div>Loading...</div>
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
})(AppMenu);


