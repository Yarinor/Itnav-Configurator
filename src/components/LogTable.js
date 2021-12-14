import React from "react";
import {connect} from "react-redux";
import ReactTable from "./ReactTable";
import {saveLogRecordsSet} from "../actions";
import _ from "lodash";



class LogTable extends React.Component {




    render() {
            // const tableData = buildTableData(this.props.records);
            return (
                <div>

                    <ReactTable
                                props={this.props.props}
                               tableColumns={this.props.columns}
                                tableName={'Log'}
                                deletedItems={this.props.deletedItems}
                                addedItemsIds={this.props.addedItemsIds}
                                editedItemsIds={this.props.editedItemsIds}
                                stack={this.props.stack}
                                addedItemsIdsStack={this.props.addedItemsIdsStack}
                                editedItemsIdsStack={this.props.editedItemsIdsStack}
                                itemsDeletedStack={this.props.itemsDeletedStack}
                                actionsStack={this.props.actionsStack}
                                originalData={this.props.originalData}
                                lastPageVisited={this.props.lastPageVisited}
                    />
                </div>
            )
        }


}

export default LogTable;
//
// const columns =
//     [
//         {
//             Header: 'Table Actions',
//             id:1,
//             columns:[
//                 {
//                     Header: '',
//                     accessor: 'editButton',
//                     isEditable: false,
//                     width: "5%"
//
//                 },
//                 {
//                     Header: 'Application',
//                     accessor: 'Application',
//                     isEditable: false,
//                     width: "6%"
//
//                 },
//                 {
//                     Header: 'ConfigKey',
//                     accessor: 'ConfigKey',
//                     isEditable: true,
//                     width: "10%"
//                 },
//                 {
//                     Header: 'ConfigType',
//                     accessor: 'ConfigType',
//                     isEditable: true,
//                     width: "10%"
//                 },
//                 {
//                     Header: 'ConfigValue',
//                     accessor: 'ConfigValue',
//                     isEditable: true,
//                     width: "10%"
//                 },
//                 {
//                     Header: 'Description',
//                     accessor: 'Description',
//                     isEditable: true,
//                     width: "10%"
//                 },
//                 {
//                     Header: 'PossibleValues',
//                     accessor: 'PossibleValues',
//                     isEditable: true,
//                     width: "10%"
//                 },
//                 {
//                     Header: 'Section',
//                     accessor: 'Section',
//                     isEditable: true,
//                     width: "10%"
//                 },
//                 {
//                     Header: 'Subsection',
//                     accessor: 'Subsection',
//                     isEditable: true,
//                     width: "10%"
//                 },
//
//             ]
//         }
//     ]
//
// const buildTableData = (records) => {
//     const rowsArr = Object.values(_.mapKeys(records, 'Id'));
//     let rows;
//     if (!rowsArr.isEmpty) {
//         rows = rowsArr.map(element => ({...element, editButton: 'edit', isEditing: false}));
//     }









//     return {rows, columns}
//
// }

