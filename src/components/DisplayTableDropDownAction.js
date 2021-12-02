import DropdownAction from "./DropDownAction";
import {DropdownItem} from "reactstrap";
import React from "react";

const DisplayRowDropDownAction = (props) => {

    return (
      <DropdownAction
          dropDownClassName="d-inline-block"
         btnClassName="table-btn"
        btnIcon="table-actions"
        headerIcon="blueDots"
        header="Table Actions"
      >
        {/* Edit record */}
        <DropdownItem onClick={props.addNewRow} >
          <i className="fas fa-plus" ></i>
          {" Add Row "}    </DropdownItem>
        {/* Delete record */}
        <DropdownItem onClick={props.undoChange}>
          <i className="fas fa-undo"></i>
          {" Undo Change "}
        </DropdownItem>
      </DropdownAction>

    );
  };

export default DisplayRowDropDownAction;