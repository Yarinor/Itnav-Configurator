import React, {forwardRef, useImperativeHandle, useRef, useState, useEffect} from 'react'
import styled from 'styled-components'
import DisplayRowDropDownAction from "./DisplayRowDropDownAction";
import {useTable, usePagination} from 'react-table'
import {useSelector, useDispatch} from 'react-redux'
import {forEach} from "lodash/fp/_util";
import DisplayTableDropDownAction from "./DisplayTableDropDownAction";
import {
    deleteFromAwConfigRecordsSet,
    deleteFromCsRecordsSet,
    deleteFromLogRecordsSet, fetchAwConfigRecords, fetchCsRecords, fetchLogRecords, saveAwConfigRecordsSet,
    saveCsRecordsSet,
    saveLogRecordsSet, updateAwConfigStateObject,
    updateCsStateObject, updateLogStateObject
} from "../actions"
import {DELETE, SAVE, SAVE_LOG_RECORDS_SET} from "../actions/types";
import {connect} from "react-redux";

import {value} from "lodash/seq";
import {
    ACTIONS_STACK,
    ADDED_ITEMS_IDS,
    ADDED_ITEMS_IDS_STACK,
    DELETED_ITEMS,
    EDITED_ITEMS_IDS,
    EDITED_ITEMS_IDS_STACK,
    ITEMS_DELETED_STACK,
    LAST_PAGE_VISITED,
    STACK
} from "./types";
import _ from "lodash";
import Modal from "./Modal";
import {useParams} from "react-router-dom";
import history from "../history";





//Create an editable cell renderer
const Cell = ({
                  value: initialValue,
                  row: {index, original},
                  column: {id},
                  cell: {value},
                  handleClickEditRow,// This is a custom function that we supplied to our table instance
                  handleClickCancelEditRow,// This is a custom function that we supplied to our table instance
                  handleClickSaveEditRow,// This is a custom function that we supplied to our table instance
                  handleClickDeleteRow,// This is a custom function that we supplied to our table instance
                  setIsStackUpdate,
                  openDeleteModal,
                  setRowIndex,
                  setStack,
                  stack,
                  data
              }) => {
    // We need to keep and update the state of the cell normally
    const [cellValue, setCellValue] = React.useState(initialValue)


    let retObj = cellValue;
    if (value === 'edit') {
        switch (index) {
            default:
                if (original.isEditing) {
                    retObj = <>
                        <button className="cancel-button" onClick={() => handleClickCancelEditRow(data, value)}></button>
                        <button className="ok-button" onClick={() => {handleClickSaveEditRow(data, index, id, value)}}></button>
                    </>;
                } else {

                    retObj = <div className="d-inline-block">
                        <DisplayRowDropDownAction
                            handleClickEditRow={() => handleClickEditRow(index, data)}
                            handleClickDeleteRow={() =>{
                                setRowIndex(index);
                                openDeleteModal(index,data)
                            }
                            }
                            setIsStackUpdate={setIsStackUpdate}
                            stack={stack}
                            setStack={setStack}
                            data={data}

                        />


                    </div>;
                }


        }
    }


    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setCellValue(initialValue)
    }, [initialValue])


    return <div>{retObj}</div>
}

// Create an editable cell renderer
const EditableCell = ({
                          value: initialValue,
                          row: {index, original},
                          column: {id},
                          updateMyData, // This is a custom function that we supplied to our table instance,
                          updateToState,
                          isSavedClicked,
                          isCancelClicked,
                          resetClickFlags,
                          setIsStackUpdate,
                          data
                      }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    const onChange = e => {
        setValue(e.target.value)
    }


    let retObj = null;
    if (original.isEditing) {
        switch (index) {
            default:
                retObj = <input value={value} type="text" onChange={onChange}/>;
                break;
        }
    } else {
        switch (index) {
            default:
                retObj = <div>{value}</div>;
                break;
        }
    }


    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    //if Cancel is clicked we want to return to the initial value
    React.useEffect(() => {
        if (isCancelClicked) {
            setValue(initialValue)
            resetClickFlags();
        }
    }, [isCancelClicked])

    // if save is clicked we want to update our stack and also our data
    React.useEffect(() => {
        if (isSavedClicked) {
            setIsStackUpdate(true);
           updateMyData(index, id, value)

            resetClickFlags();
        }
    }, [isSavedClicked])

   // we return the appropriate rendered object for our cell
    return retObj
}




// Set our editable cell and Cell renderer as the default Cell renderer
const defaultColumn = {
    EditableCell: EditableCell,
    Cell: Cell,
}


// Be sure to pass our updateMyData and the skipPageReset option
function Table(
    {
        columns,
        data,
        stack,
        updateMyData,
        updateToState,
        updateToStateObject,
        handleClickEditRow,
        handleClickCancelEditRow,
        handleClickSaveEditRow,
        handleClickDeleteRow,
        resetClickFlags,
        skipPageReset,
        isSavedClicked,
        isCancelClicked,
        isUndoClicked,
        isDeleteClicked,
        isAddRowClicked,
        isEditClicked,
        isPageCountChanged,
        isFirstUndo,
        isStackUpdate,
        setisPageCountChanged,
        setIsSavedClicked,
        setIsStackUpdate,
        setIsEditClicked,
        setIsDeleteClicked,
        setIsUndoClicked,
        setIsAddRowClicked,
        setStack,
        undoChange,
        setIsCancelClicked,
        setIsFirstUndo,
        setLastPageVisited,
        setRowIndex,
        lastPageVisited,
        openDeleteModal

    }
) {
    // For this example, we're using pagination to illustrate how to stop
    // the current page from resetting when our data changes
    // Otherwise, nothing is different here.

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize},
    } = useTable(
        {
            columns,
            data,
            stack,
            defaultColumn,
            // use the skipPageReset option to disable page resetting temporarily
            autoResetPage: !skipPageReset,

            //These flags are used to trigger our useEffect functions when they change their values
            //We need them
            // so our app will know what to do when different functions are triggered
            isSavedClicked,
            isEditClicked,
            isCancelClicked,
            isDeleteClicked,
            isAddRowClicked,
            isPageCountChanged,
            isFirstUndo,
            lastPageVisited,
            isUndoClicked,


            // The following functions aren't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            updateMyData,
            updateToState,
            handleClickEditRow,
            handleClickCancelEditRow,
            handleClickSaveEditRow,
            handleClickDeleteRow,
            resetClickFlags,
            setisPageCountChanged,
            setIsSavedClicked,
            setIsDeleteClicked,
            setStack,
            setIsStackUpdate,
            setIsEditClicked,
            setIsUndoClicked,
            setIsAddRowClicked,
            setIsCancelClicked,
            undoChange,
            setIsFirstUndo,
            setLastPageVisited,
            setRowIndex,
            updateToStateObject,
            openDeleteModal,
        },
        usePagination
    )


 // The use effect function is used for Rendering the component

 // Here we trigger an update function for our undo stack.
 //This way our stack will always be updated with the last data object in our app
    React.useEffect(() => {
        let newStack;
        if (isStackUpdate) {
            const dataCopy = [...data]
            stack.push(dataCopy);
            newStack = stack;
            setStack(newStack);
            updateToStateObject(STACK, newStack);
            setIsStackUpdate(false);

        }
    }, [isStackUpdate])

    //When the save button is clicked we want to keep the user in the page which was last visited
    React.useEffect(() => {
        gotoPage(pageIndex);
        setIsSavedClicked(false);
    }, [isSavedClicked])

    //When we add a row we want to be in the last page so the user can see where the new row was added
    React.useEffect(() => {
        if(isAddRowClicked === true){
            for (let i = 0; i < pageOptions.length; i++) {
                nextPage();
                setLastPageVisited(i);
                updateToStateObject(LAST_PAGE_VISITED, i)
            }
        }
        setIsAddRowClicked(false);
    }, [isAddRowClicked])

//When undo,cancel,edit,delete is clicked and when the app is first rendered we want the user to stay in the last page which was visited
    React.useEffect(() => {
        gotoPage(lastPageVisited);
        setIsUndoClicked(false);
    }, [isUndoClicked])
    React.useEffect(() => {
        gotoPage(lastPageVisited);
        setIsCancelClicked(false);
    }, [isCancelClicked])
    React.useEffect(() => {
        gotoPage(lastPageVisited);
        setIsEditClicked(false);
    }, [isEditClicked])
    React.useEffect(() => {
        gotoPage(pageIndex);
        setIsDeleteClicked(false);
    }, [isDeleteClicked])

    React.useEffect(() => {
        gotoPage(lastPageVisited);
    }, [])

    React.useEffect(() => {
    }, [data.length])


    // Render the UI for our table
    return (
        <>
            <div className='table-wrapper'>
                <table {...getTableProps()}>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th width={column.width} {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td data-toggle="tooltip" title={cell.value}{...cell.getCellProps()}>{cell.column.isEditable ? cell.render('EditableCell') : cell.render('Cell')}</td>
                                })}
                            </tr>
                        )

                    })}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button onClick={() => {
                    gotoPage(0)
                    setLastPageVisited(0);
                    updateToStateObject(LAST_PAGE_VISITED, 0)
                }
                }
                        disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                {' '}
                <button onClick={() => {
                    previousPage()
                    setLastPageVisited(pageIndex -1);
                    updateToStateObject(LAST_PAGE_VISITED, pageIndex -1)
                }
                }
                        disabled={!canPreviousPage}>
                    {'<'}
                </button>
                {' '}
                <button onClick={() => {
                    nextPage()
                    setLastPageVisited(pageIndex + 1);
                    updateToStateObject(LAST_PAGE_VISITED, pageIndex + 1)

                }
                }
                        disabled={!canNextPage}>
                    {'>'}
                </button>
                {' '}
                <button onClick={() => {
                    gotoPage(pageCount - 1)
                    setLastPageVisited(pageCount - 1)
                    updateToStateObject(LAST_PAGE_VISITED, pageCount - 1)
                }
                }
                        disabled={!canNextPage}>
                    {'>>'}
                </button>
                {' '}
                <span>
          Page{' '}
                    <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
                <span>
          | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0

                        }}
                        style={{width: '100px'}}
                    />
        </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

const ReactTable = (props) => {
    // we use Memo as recommended by React table
    const columns = React.useMemo(
        () => props.tableColumns,
        []
    )
    // we initialize our variables with the values coming from redux state
    const appName = useSelector(state => state.selectedApplication);
    const logRecords = useSelector(state => state.logRecords);
    const logRecordsSet = useSelector(state => state.logRecordsSet);
    const csRecords = useSelector(state => state.csRecords);
    const csRecordsSet = useSelector(state => state.csRecordsSet);
    const awConfigRecords = useSelector(state => state.awConfigRecords);
    const awConfigRecordsSet = useSelector(state => state.awConfigRecordsSet);
    const tableName = props.tableName;

    //Depends on the kind of table we are on, we return the appropriate recordSet
    const getInitRecordSet = () => {
        switch (tableName) {
            case 'Log': {
                return logRecordsSet
                break;
            }
            case 'CS': {
                return csRecordsSet
                break;
            }
            case 'AW_CONFIG': {
                return awConfigRecordsSet
                break;
            }
            default:
                break;

        }
    }
    //Depends on the kind of table we are on, we return the appropriate Record
    const getInitRecords = () =>{
        switch (tableName) {
            case 'Log': {
                return logRecords
                break;
            }
            case 'CS': {
                return csRecords
                break;
            }
            case 'AW_CONFIG': {
                return awConfigRecords
                break;
            }
            default:
                break;

        }
    }




    const originalData = getInitRecords();
    const [data, setData] = React.useState(getInitRecordSet())

    // Local state variable
    const [rowIndex,setRowIndex] = React.useState(null);
    const [skipPageReset, setSkipPageReset] = React.useState(false)
    const [isSavedClicked, setIsSavedClicked] = React.useState(false)
    const [isEditClicked, setIsEditClicked] = React.useState(false)
    const [isCancelClicked, setIsCancelClicked] = React.useState(false)
    const [isDeleteClicked, setIsDeleteClicked] = React.useState(false)
    const [isUndoClicked, setIsUndoClicked] = React.useState(false)
    const [isAddRowClicked, setIsAddRowClicked] = React.useState(false)
    const [isPageCountChanged, setIsPageCountChanged] = React.useState(false)
    const [isStackUpdate, setIsStackUpdate] = React.useState(false)
    const [isFirstUndo, setIsFirstUndo] = React.useState(false)
    const[isDeleteModalOpen,setIsDeleteModalOpen] = React.useState(false);
    const [lastPageVisited, setLastPageVisited] = React.useState(props.lastPageVisited);
    const [deletedItems, setDeletedItems] = React.useState(props.deletedItems)
    const [addedItemsIds, setAddedItemsIds] = React.useState(props.addedItemsIds)
    const [editedItemsIds, setEditedItemsIds] = React.useState(props.editedItemsIds)
    const [stack, setStack] = React.useState(props.stack)
    const [addedItemsIdsStack, setAddedItemsIdsStack] = React.useState(props.addedItemsIdsStack)
    const [editedItemsIdsStack, setEditedItemsIdsStack] = React.useState(props.editedItemsIdsStack)
    const [itemsDeletedStack, setItemDeletedStack] = React.useState(props.itemsDeletedStack)
    const [actionsStack, setActionStack] = React.useState(props.actionsStack)

    let pageSizeFromChild;
;

// We have to define the dispatch hook in order to dispatch our action creators
    const dispatch = useDispatch()


// Updates our stateObject according to the table we are on
    const updateToStateObject = (key, value) => {
        switch (tableName) {
            case 'Log': {
                dispatch(updateLogStateObject({key, value}));
                break;
            }
            case 'CS': {
                dispatch(updateCsStateObject({key, value}));
                break;
            }
            case 'AW_CONFIG': {
                dispatch(updateAwConfigStateObject({key, value}));
                break;
            }
            default:
                break;

        }
    }

    // When we need to get our Records according to the table and app we are on
    //We call the appropriate action creator
    const getRecordsData = () => {
        switch (tableName) {
            case 'Log': {
                dispatch(fetchLogRecords(appName))
                break;
            }
            case 'CS': {

                dispatch(fetchCsRecords(appName))
                break;
            }
            case 'AW_CONFIG': {
                dispatch(fetchAwConfigRecords(appName))
                break;
            }
            default:
                break;
        }
    }

    //When we add, edit or delete row this function updates our recordSet
    const updateToState = (value, action) => {
        switch (tableName) {
            case 'Log': {
                if (action === SAVE) {
                    dispatch(saveLogRecordsSet(value));
                }
                if (action === DELETE) {
                    dispatch(deleteFromLogRecordsSet(value))
                }
                break;
            }
            case 'CS': {

                if (action === SAVE) {
                    dispatch(saveCsRecordsSet(value));
                }
                if (action === DELETE) {
                    ;
                    dispatch(deleteFromCsRecordsSet(value))
                }
                break;
            }
            case 'AW_CONFIG': {
                if (action === SAVE) {
                    dispatch(saveAwConfigRecordsSet(value));
                }
                if (action === DELETE) {
                    dispatch(deleteFromAwConfigRecordsSet(value))
                }
                break;
            }
            default:
                break;

        }
    }


    // This is the event handler we pass to our table in order for us to control what our edit button does
    const handleClickEditRow = (rowIndex, data, rowAddedFlag) => {;
        data = data.map((row, index) =>
            ({...row, isEditing: index === rowIndex})
        )
        setIsStackUpdate(true)
        setData(data);
        updateToState(data, SAVE);
        if (rowAddedFlag !== 1) {
            setIsEditClicked(true);
        }


    }

    //This is the event handler we pass to our table in order for us to control what our Cancel button does
    const handleClickCancelEditRow = (data) => {
        data = data.map((row) =>
            ({...row, isEditing: false})
        )
        setData(data);
        setIsCancelClicked(true);
        updateToState(data, SAVE);
    }
//This is the event handler we pass to our table in order for us to control what our Delete button does
    const handleClickDeleteRow = (rowIndex, data) => {


        let newData = [...data];
        let element = newData.splice(rowIndex, 1);

        if (new Object(...element).Sign != 1) {
            deletedItems.push(...element);
            setDeletedItems(deletedItems);
            updateToStateObject(DELETED_ITEMS, deletedItems);
            actionsStack.push('3');
            setActionStack(actionsStack);
            updateToStateObject(ACTIONS_STACK, actionsStack)
            itemsDeletedStack.push(data[rowIndex]);
            setItemDeletedStack(itemsDeletedStack)
            updateToStateObject(ITEMS_DELETED_STACK, itemsDeletedStack)
        }

        const addedItemFindResult = addedItemsIds.indexOf(new Object(...element).Id)
        const editedItemsFindResult = editedItemsIds.indexOf(new Object(...element).Id)
        if (addedItemFindResult > -1) {
            addedItemsIds.splice(addedItemFindResult, 1)
        }
        if (editedItemsFindResult > -1) {
            editedItemsIds.splice(editedItemsFindResult, 1)
        }

        setData(newData);
        updateToState(element, DELETE);
        setIsDeleteClicked(true);

    }

    // function that activate the delete modal
    const openDeleteModal = ()=>{
        setIsDeleteModalOpen(true);

    }
    //This is the event handler we pass to our table in order for us to control what our Save button does
    const handleClickSaveEditRow = (data, rowIndex) => {

        actionsStack.push('2');
        setActionStack(actionsStack);
        updateToStateObject(ACTIONS_STACK, actionsStack);
        let newData = [...data];
        if (!(addedItemsIds.includes(newData[rowIndex].Id)) && !(editedItemsIds.includes(newData[rowIndex].Id))) {
            editedItemsIdsStack.push(data[rowIndex].Id);
            setEditedItemsIdsStack(editedItemsIdsStack);
            updateToStateObject(EDITED_ITEMS_IDS_STACK, editedItemsIdsStack);
            editedItemsIds.push(newData[rowIndex].Id)
            setEditedItemsIds(editedItemsIds);
            updateToStateObject(EDITED_ITEMS_IDS, editedItemsIds)
        }
        newData = data.map((row, index) =>
            ({...row, isEditing: false})
        )


        setData(newData);
        updateToState(newData, SAVE);
        setIsSavedClicked(true);


    }

    // A Function that resets our flags from true to false
    const resetFlags = () => {
        setIsCancelClicked(false);
        setIsSavedClicked(false);
        setIsDeleteClicked(false);
    }



    // A function that compares our arrays
    const arrayCompare = (arr1, arr2) => {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    //A function that pops out the last array in the unto stack and updates our data with it
    const undoChange = (stack, data) => {
        const lastAction = actionsStack.pop();
        switch (lastAction) {
            case '1': {
                let addedItemFromStack = addedItemsIdsStack.pop();
                let addedItemIdFoundResult = addedItemsIds.indexOf(addedItemFromStack)
                if (addedItemIdFoundResult > -1) {
                    addedItemsIds.splice(addedItemIdFoundResult, 1)
                }
                break;
            }

            case '2': {
                let editedItemFromStack = editedItemsIdsStack.pop();
                let editedItemIdFoundResult = editedItemsIds.indexOf(editedItemFromStack)
                if (editedItemIdFoundResult > -1) {
                    editedItemsIds.splice(editedItemIdFoundResult, 1)
                }
                break;
            }
            case '3': {
                let deletedItemFromStack = itemsDeletedStack.pop();
                let deletedItemFoundResult = deletedItems.indexOf(deletedItemFromStack)
                if (deletedItemFoundResult > -1) {
                    deletedItems.splice(deletedItemFoundResult, 1)
                }
                break;
            }
            default: {
                break;
            }
        }


        if (stack.length >= 1) {
            const lastDataInStack = [...stack[stack.length - 1]];

            if (arrayCompare(data, lastDataInStack) === true) {
                stack.pop();
                updateToStateObject(STACK, stack)
                setIsFirstUndo(true)
            }
            if (stack.length === 0) {
                setData(originalData);
                updateToState(originalData, SAVE);
            } else {
                const element = stack.pop();
                setData(element);
                updateToState(element, SAVE);
            }
        } else {
            setData(originalData);
            updateToState(originalData, SAVE)
        }
        setIsUndoClicked(true)
    }

      // A function that adds a new row to the table
      const addNewRow = (data) => {
        actionsStack.push('1');
        setActionStack(actionsStack);
        updateToStateObject(ACTIONS_STACK, actionsStack)
        if(data.length !=0){
            addedItemsIds.push(data[data.length - 1].Id + 1)
            setAddedItemsIds(addedItemsIds);
            updateToStateObject(ADDED_ITEMS_IDS, addedItemsIds)
            addedItemsIdsStack.push(data[data.length - 1].Id + 1);
            setAddedItemsIdsStack(addedItemsIdsStack);
            updateToStateObject(ADDED_ITEMS_IDS_STACK, addedItemsIdsStack)
            const newData = data.concat
            ({
                Sign: 1,
                Id: data[data.length - 1].Id + 1,
                Application: data[data.length - 1].Application,
                Section: "",
                Subsection: "",
                ConfigKey: "",
                ConfigValue: "",
                ConfigType: "",
                PossibleValues: "",
                Description: "",
                editButton: "edit",
                isEditing: false
            })
            const arrLastIndex = data.length;
            setIsStackUpdate(true);
            setData(newData);
            updateToState(newData, SAVE)
            if (pageSizeFromChild <= newData.length && (newData.length - 1) % 10 === 0) {
                setIsPageCountChanged(true);
                handleClickEditRow(arrLastIndex, newData, 1);
            } else {
                handleClickEditRow(arrLastIndex, newData, 1);
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'auto'

                });
            }

            setIsAddRowClicked(true);
        }
        else {
            const newData = data.concat
            ({
                Sign: 1,
                Id: 0,
                Application: appName,
                Section: "",
                Subsection: "",
                ConfigKey: "",
                ConfigValue: "",
                ConfigType: "",
                PossibleValues: "",
                Description: "",
                editButton: "edit",
                isEditing: false
            })
            setIsStackUpdate(true);
            setData(newData);
            updateToState(newData, SAVE)
            addedItemsIds.push(0)
            setAddedItemsIds(addedItemsIds);
            updateToStateObject(ADDED_ITEMS_IDS, addedItemsIds)
            addedItemsIdsStack.push(0);
            setAddedItemsIdsStack(addedItemsIdsStack);
            updateToStateObject(ADDED_ITEMS_IDS_STACK, addedItemsIdsStack)
        }

    }
    // renders the buttons for our delete modal
    const renderButtonModalActions = () =>{
        return(
            <div className="actions">
                <button className="ui delete button" onClick={()=>{
                    handleClickDeleteRow(rowIndex,data)
                    setIsDeleteModalOpen(false);
                }
                }>Delete</button>
                <button className="ui button" onClick={()=>{
                    setIsDeleteModalOpen(false);
                }
                }>Cancel</button>
            </div>
        )
    }


    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)

        setData(old =>
            old.map((row, index) => {

                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )


    }

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset



    const compareArrays = (array1, array2) => {
        if (JSON.stringify(array1) === JSON.stringify(array2)) {
            return true;
        } else
            return false;


    }


// When appName changes we need to get the record data. We dont get the records if RecordSet was changed
    React.useEffect(() => {
        if (tableName === 'Log')
            if (compareArrays(logRecords, logRecordsSet) === true) {
                getRecordsData();
            }


    }, [appName])


    //Any time data changes we update our state
    React.useEffect(() => {
        updateToState(data, SAVE);
        setSkipPageReset(false)

    }, [data])



//     React.useEffect(() => {
//         if (compareArrays(logRecords, logRecordsSet) === true)
//             dispatch(saveLogRecordsSet(logRecords))
//     }, [logRecords])
    // React.useEffect(() => {
    //     if (compareArrays(csRecords, csRecordsSet) === true)
    //         dispatch(saveCsRecordsSet(csRecords))
    // }, [csRecords])
    // React.useEffect(() => {
    //     if (compareArrays(awConfigRecords, awConfigRecordsSet) === true)
    //         dispatch(saveAwConfigRecordsSet(awConfigRecords))
    // }, [awConfigRecords])

    // If the RecordsSet changes we want to update our table data with the new values
    React.useEffect(() => {
        if (tableName === 'Log' && compareArrays(data, logRecordsSet) === false)
            setData(logRecordsSet)
    }, [logRecordsSet])


    React.useEffect(() => {
        if (tableName === 'CS' && compareArrays(data, csRecordsSet) === false)
            setData(csRecordsSet)
    }, [csRecordsSet])


    React.useEffect(() => {
        if (tableName === 'AW_CONFIG' && compareArrays(data, awConfigRecordsSet) === false)
            setData(awConfigRecordsSet)
    }, [awConfigRecordsSet])


    React.useEffect(() => {
        window.addEventListener("beforeunload", (ev) => {

            ev.preventDefault();
            ev.returnValue = '';

        });
        window.addEventListener("unload", (ev) => {

            localStorage.clear();
        });
    }, [])



    return (
        <div className="outer-table-wrapper">
            <div className="t-header-opts">
                <div className="d-inline-block">
                    <DisplayTableDropDownAction
                        addNewRow={() => addNewRow(data)}
                        undoChange={() => undoChange(stack,data)}
                    />
                </div>
                <div className="d-inline-block"><span className='table-header'>Table Actions</span></div>
            </div>
            <Modal show={isDeleteModalOpen}
                   onDismiss={()=>setIsDeleteModalOpen(false)}
                   title={"Delete Record"}
                   content={"Are you sure you want to delete this record?"}
                   actions={renderButtonModalActions()}
                   isInputContent={false}

            />
            <Table
                columns={columns}
                data={data}
                stack={stack}
                setStack={setStack}
                setIsStackUpdate={setIsStackUpdate}
                setLastPageVisited={setLastPageVisited}
                isStackUpdate={isStackUpdate}
                updateMyData={updateMyData}
                updateToState={updateToState}
                updateToStateObject={updateToStateObject}
                handleClickEditRow={handleClickEditRow}
                handleClickCancelEditRow={handleClickCancelEditRow}
                handleClickSaveEditRow={handleClickSaveEditRow}
                handleClickDeleteRow={handleClickDeleteRow}
                setIsDeleteClicked={setIsDeleteClicked}
                setIsUndoClicked={setIsUndoClicked}
                isUndoClicked={isUndoClicked}
                isDeleteClicked={isDeleteClicked}
                isSavedClicked={isSavedClicked}
                setIsSavedClicked={setIsSavedClicked}
                isCancelClicked={isCancelClicked}
                isPageCountChanged={isPageCountChanged}
                resetClickFlags={resetFlags}
                skipPageReset={skipPageReset}
                setisPageCountChanged={setIsPageCountChanged}
                undoChange={undoChange}
                setIsFirstUndo={setIsFirstUndo}
                isFirstUndo={isFirstUndo}
                lastPageVisited={lastPageVisited}
                updateToStateObject={updateToStateObject}
                setIsCancelClicked={setIsCancelClicked}
                isEditClicked={isEditClicked}
                isAddRowClicked={isAddRowClicked}
                setIsAddRowClicked={setIsAddRowClicked}
                setIsEditClicked={setIsEditClicked}
                setRowIndex={setRowIndex}
                openDeleteModal={openDeleteModal}
            />

        </div>

    )
}




export default React.memo(ReactTable);

