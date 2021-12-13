import { fallDown as Menu } from 'react-burger-menu'
import React from "react";
import {connect} from "react-redux";
import {
    selectApplication, addApplication
} from "../actions";
import {Link} from "react-router-dom";
import CustomScroll from "react-custom-scroll";
import Modal from "./Modal";



class AppMenu extends React.Component {


    constructor(props) {
        super(props);
        this.getInputValue = this.getInputValue.bind(this)
        this.state = {
            isOpen: false,
            isAddAppModalOpen:false,
            inputValue:''
        };
    }



    ArrangeAppsAlphabetically() {
        let appsArrayObject = {A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K : [], L : [], M: [], N : [], O : [], P : [], Q : [], R :[] , S : [], T : [], U : [], V : [], W : [], X : [], Y : [], Z : []};
    for(let i = 0 ; i < this.props.applications.length; i++) {
         const firstLetterOfApp = this.props.applications[i].Name.charAt(0);
       appsArrayObject[firstLetterOfApp].push(this.props.applications[i].Name);
    }
    return appsArrayObject
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

    handleOnModuleOpen(){
        this.setState({isAddAppModalOpen:true});
    }

    handleOnModuleClose(){
        this.setState({isAddAppModalOpen:false});
    }

    getInputValue (value) {
        this.setState({inputValue:value});
    }

    renderButtonModalActions (closeFunc){
        return(
            <div>
                <div className="actions">
                    <button className="ui primary button" onClick={()=>{
                        closeFunc()
                        this.props.addApplication(this.state.inputValue);
                    }
                    }>Ok</button>
                    <button className="ui button" onClick={()=>{
                        closeFunc()
                    }
                    }>Cancel</button>
                </div>
            </div>
        )
    }









    render () {
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling


        let links =[];
        if(this.props.applications.length != 0) {

            let appsObject = this.ArrangeAppsAlphabetically();
            let keys = Object.keys(appsObject)
            for(let i = 0 ; i < keys.length ; i++) {
                if(appsObject[keys[i]].length != 0){
                    links.push(
                        <u key={i} className="menu-letter"> &nbsp;&nbsp;&nbsp;&nbsp;{keys[i]}&nbsp; &nbsp;&nbsp;&nbsp;</u>

                    )
                    const arr = appsObject[keys[i]];
                    for(let j = 0; j < appsObject[keys[i]].length; j ++){
                        links.push( <Link
                                key={j}
                                to={`/Log/${arr[j]}`}
                                id="home" className="menu-item"
                                onClick={(e)=> {
                                    this.props.selectApplication(arr[j])
                                    this.handleOnClose();
                                }
                                }>
                                {arr[j]}
                            </Link>,
                        );
                    }
                }

            }


            return (
                <div>
                <Modal
                    show={this.state.isAddAppModalOpen}
                    onDismiss={()=>this.handleOnModuleClose()}
                    title={"Add a new app"}
                    content={"Please enter a new app name:"}
                    actions={this.renderButtonModalActions(()=>this.handleOnModuleClose())}
                    isInputContent={true}
                    getInputValue={this.getInputValue}
                />
                    <div className='menu-outer-container'>
                        <Menu onOpen={ ()=> this.handleOnOpen() } onClose={ () => this.handleOnClose() } isOpen={this.state.isOpen} >
                               <button className='side-menu-add-button' onClick={
                                   () => {
                                       this.handleOnModuleOpen()
                                       this.handleOnClose()
                                   }
                               } >
                                   <i className='fas fa-plus'></i>
                                   &nbsp;
                                   Add App
                               </button>
                            {links}
                        </Menu>
                    </div>
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
        selectedApplication: state.selectedApplication,
        applications: Object.values(state.applications),


    }
}

export default connect(mapStateToProps, {
    selectApplication,addApplication
})(AppMenu);


