import DropdownAction from "./DropDownAction";
import {DropdownItem} from "reactstrap";
import Modal from "./Modal";
import React from "react";

const DisplayRowDropDownAction = (props) => {
    const performDeleteAction = (e) =>{
        let newStack
        props.stack.push(props.data);
        newStack = props.stack;
        props.setStack(newStack);
        props.handleClickDeleteRow();

    }
    return (
      <DropdownAction
          dropDownClassName="d-inline-block"
        btnClassName="btn"
        btnIcon={`fas fa-ellipsis-v`}
        headerIcon="blueDots"
        header="Row Actions"
      >
        <DropdownItem onClick={props.handleClickEditRow} >
          <i className="pl-3 fas fa-edit" ></i>
          {" Edit Row "}    </DropdownItem>
        <DropdownItem onClick={performDeleteAction}>
          <i className="pl-3 far fa-trash-alt" style={{ color: "red" }}></i>
          {" Delete Row "}
        </DropdownItem>
      </DropdownAction>

    );
  };

export default DisplayRowDropDownAction;