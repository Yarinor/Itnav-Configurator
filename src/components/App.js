import React from "react";
import {connect} from "react-redux";
import {
    fetchLogRecords,
    saveLogRecordsSet,
    saveCsRecordsSet,
    updateLogStateObject,
    updateCsStateObject,
    saveAwConfigRecordsSet, fetchAwConfigRecords, fetchCsRecords, fetchApplications, selectApplication, postLogRecords
} from "../actions";
import Header from "./Header";
import {BrowserRouter as Router, Route, Switch, useParams} from "react-router-dom";
import Table1 from "./LogTable";
import CSTable from "./CSTable";
import LogTable from "./LogTable";
import AWConfigTable from "./AWConfigTable";
import AppMenu from "./AppMenu";
import Modal from "./Modal";
import history from "../history";
import RecordDelete from "./Pages/RecordDelete";
import DisplayTableDropDownAction from "./DisplayTableDropDownAction";






class App extends React.Component {


    shouldComponentUpdate(nextProps) {
        // Rendering the component only if
        // passed props value is changed

        if (nextProps.selectedApplication !== this.props.selectedApplication) {
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.selectedApplication !== prevProps.selectedApplication) {
            this.props.fetchLogRecords(this.props.selectedApplication).then(() => {
                    this.props.saveLogRecordsSet(this.props.logRecords)
                }
            );
            this.props.fetchCsRecords(this.props.selectedApplication).then(() => {
                    this.props.saveCsRecordsSet(this.props.csRecords)
                }
            );
            this.props.fetchAwConfigRecords(this.props.selectedApplication).then(() => {
                    this.props.saveAwConfigRecordsSet(this.props.awConfigRecords)
                }
            );
        }
    }

    componentDidMount() {
        this.props.fetchApplications().then(() => {
                this.props.selectApplication(this.props.applications[3].Name)
            }
        ).then(() => {
                this.props.fetchLogRecords(this.props.selectedApplication).then(() => {
                        this.props.saveLogRecordsSet(this.props.logRecords)
                    }
                );
                this.props.fetchCsRecords(this.props.selectedApplication).then(() => {
                        this.props.saveCsRecordsSet(this.props.csRecords)
                    }
                );
                this.props.fetchAwConfigRecords(this.props.selectedApplication).then(() => {
                        this.props.saveAwConfigRecordsSet(this.props.awConfigRecords)
                    }
                );
            }
        );


    }


    // shouldComponentUpdate(nextProps) {
    //     if(nextProps.value !== this.props.logRecordsSet || nextProps.value !== this.props.csRecordsSet){
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    // }
    prepareDataForDb = (data, deletedItems, editedItemsIds) => {
        let newDeletedItemsArr;
        newDeletedItemsArr = deletedItems.map((row) =>
            ({...row, Sign: 3}))


        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < editedItemsIds.length; j++) {
                if (data[i].Id === editedItemsIds[j]) {
                    data[i].Sign = 2;
                }
            }
        }

        let dataForDb = newDeletedItemsArr;
        dataForDb = dataForDb.concat(data);

        dataForDb.map(element => (
                delete element["editButton"], delete element["isEditing"]
            )
        );
        dataForDb = dataForDb.sort(function (a, b) {
            return a.Id - b.Id;
        });

        return dataForDb;


    }


    finalizeData = () => {
        const LogTableFinalData = this.prepareDataForDb(this.props.logRecordsSet, this.props.logStateObject.deletedItems, this.props.logStateObject.editedItemsIds);
        const CsTableFinalData = this.prepareDataForDb(this.props.csRecordsSet, this.props.csStateObject.deletedItems, this.props.csStateObject.editedItemsIds);
        const AwConfigTableFinalData = this.prepareDataForDb(this.props.awConfigRecordsSet, this.props.awConfigStateObject.deletedItems, this.props.awConfigStateObject.editedItemsIds);
        this.props.postLogRecords(this.props.selectedApplication,LogTableFinalData);
        console.log(LogTableFinalData);
        console.log(CsTableFinalData);
        console.log(AwConfigTableFinalData);

    }


    render() {
        if(this.props.applications.length !=0){
            return (

                    <div className='app-wrapper'>
                        <Modal show={false}/>
                        <Router history={history}>
                            {/*applications={this.props.applications}*/}
                            <AppMenu />
                            <div className='page-wrapper'>
                                <Header className='header'/>
                                <br/><br/>
                                <Switch>
                                    <Route
                                        path='/:appName/Log'
                                        render={(props) => <LogTable
                                        {...props}
                                        props={props}
                                        columns={columns}
                                        records={this.props.logRecordsSet}
                                        deletedItems={this.props.logStateObject.deletedItems}
                                        addedItemsIds={this.props.logStateObject.addedItemsIds}
                                        editedItemsIds={this.props.logStateObject.editedItemsIds}
                                        stack={this.props.logStateObject.stack}
                                        addedItemsIdsStack={this.props.logStateObject.addedItemsIdsStack}
                                        editedItemsIdsStack={this.props.logStateObject.editedItemsIdsStack}
                                        itemsDeletedStack={this.props.logStateObject.itemsDeletedStack}
                                        actionsStack={this.props.logStateObject.actionsStack}
                                        lastPageVisited={this.props.logStateObject.lastPageVisited}
                                        originalData={this.props.logRecords}
                                    />}/>
                                    <Route
                                        path='/:appName/ConnectionString'
                                        render={(props) => <CSTable
                                        {...props}
                                        columns={columns}
                                        records={this.props.csRecordsSet}
                                        deletedItems={this.props.csStateObject.deletedItems}
                                        addedItemsIds={this.props.csStateObject.addedItemsIds}
                                        editedItemsIds={this.props.csStateObject.editedItemsIds}
                                        stack={this.props.csStateObject.stack}
                                        addedItemsIdsStack={this.props.csStateObject.addedItemsIdsStack}
                                        editedItemsIdsStack={this.props.csStateObject.editedItemsIdsStack}
                                        itemsDeletedStack={this.props.csStateObject.itemsDeletedStack}
                                        actionsStack={this.props.csStateObject.actionsStack}
                                        lastPageVisited={this.props.csStateObject.lastPageVisited}
                                        originalData={this.props.csRecords}
                                    />}/>
                                    <Route
                                        path='/:appName/AppOrWebConfig'
                                        render={(props) => <AWConfigTable
                                        {...props}
                                        columns={columns}
                                        records={this.props.awConfigRecordsSet}
                                        deletedItems={this.props.awConfigStateObject.deletedItems}
                                        addedItemsIds={this.props.awConfigStateObject.addedItemsIds}
                                        editedItemsIds={this.props.awConfigStateObject.editedItemsIds}
                                        stack={this.props.awConfigStateObject.stack}
                                        addedItemsIdsStack={this.props.awConfigStateObject.addedItemsIdsStack}
                                        editedItemsIdsStack={this.props.awConfigStateObject.editedItemsIdsStack}
                                        itemsDeletedStack={this.props.awConfigStateObject.itemsDeletedStack}
                                        actionsStack={this.props.awConfigStateObject.actionsStack}
                                        lastPageVisited={this.props.awConfigStateObject.lastPageVisited}
                                        originalData={this.props.awConfigRecords}
                                    />}/>
                                </Switch >

                                <button className='btn btn-primary save-button' onClick={() => this.finalizeData()}>Save
                                </button>
                            </div>
                        </Router>
                    </div>

            )
        }
        else{
            return <div>Loading...</div>
        }

    }


}


const mapStateToProps = (state) => {
    return {
        logRecords: Object.values(state.logRecords),
        csRecords: Object.values(state.csRecords),
        awConfigRecords: Object.values(state.awConfigRecords),
        logRecordsSet: Object.values(state.logRecordsSet),
        csRecordsSet: Object.values(state.csRecordsSet),
        awConfigRecordsSet: Object.values(state.awConfigRecordsSet),
        csStateObject: state.csStateObject,
        logStateObject: state.logStateObject,
        awConfigStateObject: state.awConfigStateObject,
        applications: Object.values(state.applications),
        selectedApplication: state.selectedApplication,

    }
}


const columns =
    [
        {
            Header: '',
            id: 1,
            columns: [
                {
                    Header: '',
                    accessor: 'editButton',
                    isEditable: false,
                    width: "5%"

                },
                {
                    Header: 'Application',
                    accessor: 'Application',
                    isEditable: false,
                    width: "6%"

                },
                {
                    Header: 'ConfigKey',
                    accessor: 'ConfigKey',
                    isEditable: true,
                    width: "10%"
                },
                {
                    Header: 'ConfigType',
                    accessor: 'ConfigType',
                    isEditable: true,
                    width: "10%"
                },
                {
                    Header: 'ConfigValue',
                    accessor: 'ConfigValue',
                    isEditable: true,
                    width: "10%"
                },
                {
                    Header: 'Description',
                    accessor: 'Description',
                    isEditable: true,
                    width: "10%"
                },
                {
                    Header: 'PossibleValues',
                    accessor: 'PossibleValues',
                    isEditable: true,
                    width: "10%"
                },
                {
                    Header: 'Section',
                    accessor: 'Section',
                    isEditable: true,
                    width: "10%"
                },
                {
                    Header: 'Subsection',
                    accessor: 'Subsection',
                    isEditable: true,
                    width: "10%"
                },

            ]
        }
    ]


export default connect(mapStateToProps, {
    fetchLogRecords,
    fetchAwConfigRecords,
    fetchCsRecords,
    saveCsRecordsSet,
    saveLogRecordsSet,
    saveAwConfigRecordsSet,
    fetchApplications,
    selectApplication,
    postLogRecords
})(App);



