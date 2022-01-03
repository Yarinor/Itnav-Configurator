import React, { PureComponent } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import PropTypes from "prop-types";

/**
 * Reusable component for drop down menus
 */
export default class DropdownAction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
    };
  }

  // on drop down toggle
  dropDownToggle = () => {
    this.setState(
      (prevState) => ({ listOpen: !prevState.listOpen }),
      () => {
        this.agentItemMenuHandler();
      }
    );
  };

  agentItemMenuHandler = () => {
    if (this.props.cbIsOpen) {
      //call back to agent table -> agent item menu -> currently open -> stop socket data
      this.props.cbIsOpen(this.state.listOpen);
    }
  };

  render() {
    const {
      dropDownClassName,
      btnClassName,
      btnIcon,
      btnLabel,
      headerIcon,
      header,
      children,
    } = this.props;
    return (
      <Dropdown className={dropDownClassName} isOpen={this.state.listOpen} toggle={this.dropDownToggle}>
        <DropdownToggle
          tag="span"
          onClick={this.toggle}
          aria-expanded={this.state.listOpen}
        >
          <button className={btnClassName}>
            {btnIcon && <i className={btnIcon}></i>}
            {btnLabel && <span>{btnLabel}</span>}
          </button>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header>
            <div className={headerIcon}></div>
            {header}
          </DropdownItem>
          <DropdownItem divider />
          {/* Children are DropdownItem componenets */}
          {children}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

// Enforce the type of props to send to this component
DropdownAction.propTypes = {
  btnClassName: PropTypes.string,
  btnIcon: PropTypes.string,
  btnLabel: PropTypes.string,
  headerIcon: PropTypes.string,
  header: PropTypes.string,
  cbIsOpen: PropTypes.func,
  children: PropTypes.any,
};
