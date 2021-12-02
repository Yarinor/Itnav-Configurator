import React from "react";
import {connect} from "react-redux";
import ReactTable from "./ReactTable";
import {saveAwConfigRecordsSet} from "../actions";
import _ from "lodash";


class AWConfigTable extends React.Component {

    render() {
        return (
            <div>

                <ReactTable
                            selectedApplication={this.props.selectedApplication}
                            tableColumns={this.props.columns}
                            tableName={'AW_CONFIG'}
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

export default AWConfigTable




