import React from "react";
import ReactTable from "./ReactTable";



class LogTable extends React.PureComponent {




    render() {
            return (
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
            )
        }


}

export default LogTable;

