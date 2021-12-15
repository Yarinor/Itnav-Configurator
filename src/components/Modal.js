import React from "react";
import ReactDOM from "react-dom";


const Modal = props =>{
    const updateInput =(e) =>{
        props.getInputValue(e.target.value)
        document.querySelector(".modal-error-msg").classList.remove("msg-active");

    }

    const renderContent = (props)=>{
        if(props.isInputContent){
            return (
                <div>
                    {props.content}
                    &nbsp;&nbsp;
                        <input id='modalInputField' class="form-control" type="text" onChange={updateInput} />
                         <div className='modal-error-msg'>Error: app name already exists, it must be unqiue!</div>
                </div>
            )
        }
        else{
            return props.content
        }
    }

    if(props.show === true){
        return ReactDOM.createPortal(
            <div onClick={()=>props.onDismiss()} className="ui dimmer modals visible active">
                <div onClick={(e)=> e.stopPropagation()} className="ui modal visible active">
                    <div className="header">{props.title}</div>
                    <div className="content">
                        {renderContent(props)}
                    </div>
                    <div className="actions">
                        {props.actions}
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