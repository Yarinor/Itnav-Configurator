import { fallDown as Menu } from 'react-burger-menu'
import React from "react";
import {connect} from "react-redux";
import {
    selectApplication, addApplication, resetLogStateObject, resetCsStateObject, resetAwConfigStateObject
} from "../actions";
import {Link, Redirect} from "react-router-dom";
import Modal from "./Modal";
import history from "../history";



class AppMenu extends React.Component {


    constructor(props) {
        super(props);
        this.getInputValue = this.getInputValue.bind(this)
        this.checkLinks = this.checkLinks.bind(this)
        this.checkInput =this.checkInput.bind(this)
        this.state = {
            isOpen: false,
            isAddAppModalOpen:false,
            isWarnAppModalOpen:false,
            inputValue:'',
            searchValue:'',
            appToNav:''
        };
    }



    ArrangeAppsAlphabetically() {
        let appsArrayObject = {A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K : [], L : [], M: [], N : [], O : [], P : [], Q : [], R :[] , S : [], T : [], U : [], V : [], W : [], X : [], Y : [], Z : []};
    for(let i = 0 ; i < this.props.applications.length; i++) {
         const appNameFromProps = this.props.applications[i].Name;
         const appName = appNameFromProps.charAt(0).toUpperCase() + appNameFromProps.slice(1);
         const firstLetterOfApp = appName.charAt(0);
        appsArrayObject[firstLetterOfApp].push(appName);
    }
    return appsArrayObject
}


     handleOnOpen() {
         document.querySelector(".bm-menu-wrap").classList.add("open-sidebar");
         document.querySelector(".page-wrapper").classList.add("page-wrapper-sidebar-open");
        // document.querySelector(".t-header-opts").classList.add("sidebar-open");
        this.setState({
            isOpen: true
        })
    }

    handleOnClose () {
        document.querySelector(".bm-menu-wrap").classList.remove("open-sidebar");
        document.querySelector(".page-wrapper").classList.remove("page-wrapper-sidebar-open");
        //document.querySelector(".t-header-opts").classList.remove("sidebar-open");
        this.setState({
            isOpen: false
        })

    }

    handleOnAddModuleOpen(){
        this.setState({isAddAppModalOpen:true});
    }

    handleOnAddModuleClose(){
        this.setState({isAddAppModalOpen:false});
    }

    handleOnWarnModuleOpen(){
        this.setState({isWarnAppModalOpen:true});
    }

    handleOnWarnModuleClose(){
        this.setState({isWarnAppModalOpen:false});
    }

    getInputValue (value) {
        this.setState({inputValue:value});
    }
    checkInput(value,closeFunc){
        let found =0;
        for(let i = 0; i < this.props.applications.length ; i++){
            if(value.toLowerCase() === this.props.applications[i].Name.toLowerCase()){
                found=1;
                break;
            }
        }
        if(found === 1){
            document.querySelector(".modal-error-msg").classList.add("msg-active");
        }
        else{

            closeFunc()
            this.props.resetLogStateObject();
            this.props.resetCsStateObject();
            this.props.resetAwConfigStateObject();
            this.props.addApplication(this.state.inputValue);
            this.props.selectApplication(this.state.inputValue)
            history.push(`/${this.state.inputValue}/Log`);
            }
        }


    renderButtonAddModalActions (closeFunc){
        return(
            <div>
                <div className="actions">
                    <button className="ui primary button" onClick={()=>{
                        this.checkInput(this.state.inputValue,closeFunc);
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
    renderButtonWarnModalActions (closeFunc){
        return(
            <div>
                <div className="actions">
                    <button className="ui primary button" onClick={()=>{
                        this.props.resetLogStateObject();
                        this.props.resetCsStateObject();
                        this.props.resetAwConfigStateObject();
                        this.props.selectApplication(this.state.appToNav)
                        this.handleOnClose();
                        closeFunc();
                        history.push(`/${this.state.appToNav}/Log`);
                        //return <Redirect to={`/${this.state.appToNav}/Log`}/>

                    }
                    }>Ok</button>
                    <button className="ui button" onClick={()=>{
                        closeFunc()
                        this.handleOnClose();
                    }
                    }>Cancel</button>
                </div>
            </div>
        )
    }

    checkLinks(links){
        if(this.state.searchValue !== '' && links.length=== 0){
            links.push(<div className='search notification'>No results found</div>)
        }
            return links;

    }

    handleClickLink(app){
        console.log(app);
        this.setState({
            isWarnAppModalOpen: true,
            appToNav:app
        })
    }












    render () {
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        let links =[];
        if(this.props.applications.length != 0) {

            let appsObject = this.ArrangeAppsAlphabetically();
            let keys = Object.keys(appsObject)
            for(let i = 0 ; i < keys.length ; i++) {
                if(appsObject[keys[i]].length != 0){
                    const arr = appsObject[keys[i]];
                    if(this.state.searchValue != ''){
                        let regex =new RegExp(`^${this.state.searchValue}`,'i')
                        for(let j = 0; j < appsObject[keys[i]].length; j ++){
                            let found = regex.test(arr[j])
                            if(found){
                                links.push( <Link
                                        key={j}
                                        to={`/Log/${arr[j]}`}
                                        id="home" className="menu-item"
                                        onClick={(e)=> {
                                            e.preventDefault();
                                            this.handleClickLink(arr[j]);
                                        }
                                        }>
                                        {arr[j]}
                                    </Link>,
                                );
                            }
                        }
                    }
                    else{
                        links.push(
                            <u key={i} className="menu-letter"> &nbsp;&nbsp;&nbsp;&nbsp;{keys[i]}&nbsp; &nbsp;&nbsp;&nbsp;</u>

                        )
                        for(let j = 0; j < appsObject[keys[i]].length; j ++){
                            links.push( <Link
                                    key={j}
                                    to={`/Log/${arr[j]}`}
                                    id="home" className="menu-item"
                                    onClick={(e)=> {
                                        e.preventDefault();
                                        this.handleClickLink(arr[j]);
                                    }
                                    }>
                                    {arr[j]}
                                </Link>,
                            );
                        }
                    }

                }

            }


            return (
                <div>
                <Modal
                    show={this.state.isAddAppModalOpen}
                    onDismiss={()=>this.handleOnAddModuleClose()}
                    title={"Add a new app"}
                    content={"Please enter a new app name:"}
                    actions={this.renderButtonAddModalActions(()=>this.handleOnAddModuleClose())}
                    isInputContent={true}
                    getInputValue={this.getInputValue}
                />
                    <Modal
                        show={this.state.isWarnAppModalOpen}
                        onDismiss={()=>this.handleOnWarnModuleClose()}
                        title={"Warning"}
                        content={"Changes may not be saved. Are you sure you want to change apps?"}
                        actions={this.renderButtonWarnModalActions(()=>this.handleOnWarnModuleClose())}
                        isInputContent={false}
                    />
                    <div className='menu-outer-container'>
                        <Menu onOpen={ ()=> this.handleOnOpen() } onClose={ () => this.handleOnClose() } isOpen={this.state.isOpen} >
                               <button className='side-menu-add-button' onClick={
                                   () => {
                                       this.handleOnAddModuleOpen()
                                       this.handleOnClose()
                                   }
                               } >
                                   <i className='fas fa-plus'></i>
                                   &nbsp;
                                   Add App
                               </button>
                            <br/>
                            <div className='d-inline-block'><i className='fas fa-search'></i> &nbsp;</div>
                            <div className='d-inline-block'><input className='form-control' onChange={e=> this.setState({searchValue:e.target.value})}/></div>
                            <br/><br/>
                            {this.checkLinks(links)}
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
    selectApplication,addApplication,resetLogStateObject,resetCsStateObject,resetAwConfigStateObject
})(AppMenu);


