import React from "react";
import ReactDOM from "react-dom";


const Modal = props =>{

    if(props.show === true){
        return ReactDOM.createPortal(
            <div onClick={()=>props.setIsDeleteModalOpen(false)} className="ui dimmer modals visible active">
                <div onClick={(e)=> e.stopPropagation()} className="ui modal visible active">
                    <div className="header">{props.title}</div>
                    <div className="content">
                         {props.content}
                    </div>
                    <div className="actions">
                        {props.actions()}
                    </div>
                </div>
            </div>,
            document.querySelector('#modal')
        );
    }
    else{
        return null;
    }
};

export default Modal;