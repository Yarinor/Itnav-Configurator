import React, {forwardRef, useImperativeHandle, useRef, useState, useEffect} from 'react'
import styled from 'styled-components'
import DisplayRowDropDownAction from "./DisplayRowDropDownAction";
import {useTable, usePagination} from 'react-table'
import {useSelector, useDispatch} from  'react-redux'
import {forEach} from "lodash/fp/_util";
import DisplayTableDropDownAction from "./DisplayTableDropDownAction";
import {saveCsRecordsSet, saveLogRecordsSet, updateCsStateObject} from "../actions"
import {SAVE_LOG_RECORDS_SET} from "../actions/types";
import {connect} from "react-redux";
import {value} from "lodash/seq";


const Styles = styled.div`
  padding: 1rem;


  table {
    table-layout: fixed;
    border-spacing: 0;
    border: 0.5px solid;
    border-color: #dee2e6;

    div {
      font-size: 1rem;
      font-family: Arial;
      padding: 0;
      margin: 0;
      border: 0;
    }

    td:nth-child(2) {
      border: none;
      border-bottom: 0.5px solid;
      border-color: #dee2e6;
    }

    thead {
      tr:nth-child(1) {
        th {
          div {
            span {
              color: black;
              font-size: x-large;
              text-align: right;
            }
          }
        }
      }
    
      


      tr:nth-child(2) {
        color: #2c5eb1;
        font-size: large;
        text-align: center;

        th:nth-child(2) {
          border-right: none;

        }
      }
    }

  }

  tr > td:nth-of-type(2) > div {
    font-weight: bold;
  }


  th,
  td {
    margin: 0;
    padding: 0.5rem;
    border-bottom: 0.5px solid;
    border-right: 0.5px solid;
    border-color: #dee2e6;

    input {
      text-align: left;
      direction: ltr;
    }
  }
}

.ok-button {
  background: white;
  margin: 2px
}

.cancel-button {
  background: white;
  margin: 2px;
}

td {
  height: 80px;
  text-align: center;

}

.pagination {
  padding: 0.5rem;
  justify-content: center;
}
`


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
                        <button className="cancel-button" onClick={() => handleClickCancelEditRow(data, value)}><i
                            className="close icon red"></i></button>
                        <button className="ok-button" onClick={() => handleClickSaveEditRow(data, index, id, value)}><i
                            className="check icon green"></i></button>
                    </>;
                } else {

                    retObj = <div className="d-inline-block">
                        <DisplayRowDropDownAction
                            handleClickEditRow={() => handleClickEditRow(index, data)}
                            handleClickDeleteRow={() => handleClickDeleteRow(index, data) }
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


    // // We'll only update the external data when the input is blurred
    // const onBlur = () => {
    //     updateMyData(index, id, value)
    //
    // }

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

    React.useEffect(() => {
        if (isCancelClicked) {
            setValue(initialValue)
            resetClickFlags();
        }
    }, [isCancelClicked])

    React.useEffect(() => {
        if (isSavedClicked) {
            setIsStackUpdate(true);
            updateMyData(index, id, value)

            resetClickFlags();
        }
    }, [isSavedClicked])


    return retObj
}


const Header = () => {
    return <div>id</div>
}


// Set our editable cell renderer as the default Cell renderer
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
        handleClickEditRow,
        handleClickCancelEditRow,
        handleClickSaveEditRow,
        handleClickDeleteRow,
        resetClickFlags,
        skipPageReset,
        isSavedClicked,
        isCancelClicked,
        isDeleteClicked,
        isPageCountChanged,
        isFirstUndo,
        isStackUpdate,
        setisPageCountChanged,
        setIsStackUpdate,
        setStack,
        getPageSize,
        undoChange,
        setIsFirstUndo

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
            isSavedClicked,
            isCancelClicked,
            isDeleteClicked,
            isPageCountChanged,
            isFirstUndo,


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
            getPageSize,
            setisPageCountChanged,
            setStack,
            setIsStackUpdate,
            undoChange,
            setIsFirstUndo
        },
        usePagination
    )
            getPageSize(pageSize);
            let newStack;

    React.useEffect(() => {
        if(isFirstUndo === true){
            for(let i=0; i< pageOptions.length; i++){
                nextPage();
                setIsFirstUndo(false);
        }
        }
    }, [isFirstUndo])

    React.useEffect(() => {
        if(isPageCountChanged){
            setisPageCountChanged(false);
        }
    }, [isPageCountChanged])

    React.useEffect(() => {
        if(isStackUpdate){
            const dataCopy= [...data]
            stack.push(dataCopy);
            newStack = stack;
            setStack(newStack);
            // for(let i=0; i< pageOptions.length; i++){
            //     nextPage();
            // }
            setIsStackUpdate(false);

        }
    }, [isStackUpdate])


    React.useEffect(() => {
        for(let i=0; i< pageOptions.length; i++){
            nextPage();
        }
    }, [data.length])



    // Render the UI for your table
    return (
        <>
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
                                    return <td {...cell.getCellProps()}>{cell.column.isEditable ? cell.render('EditableCell') : cell.render('Cell')}</td>
                                })}
                            </tr>
                        )

                })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                {' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                {' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                {' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
                            gotoPage(page)
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
    const columns = React.useMemo(
        () => props.tableColumns,
        []
    )

    // const columns =props.tableColumns;
    const [data, setData] = React.useState(() => props.tableRows)
    const [originalData] = React.useState(data)
    const tableName = props.tableName;
    const [skipPageReset, setSkipPageReset] = React.useState(false)
    const [isSavedClicked, setIsSavedClicked] = React.useState(false)
    const [isCancelClicked, setIsCancelClicked] = React.useState(false)
    const [isDeleteClicked, setIsDeleteClicked] = React.useState(false)
    const [isPageCountChanged, setisPageCountChanged ]= React.useState(false)
    const [stack, setStack]= React.useState(new Array())
    const [deletedItems, setdeletedItems ]= React.useState(new Array())
    const [addedItemsIds, setAddedItemsIds ]= React.useState(new Array())
    const [editedItemsIds, setEditedItemsIds ]= React.useState(new Array())
    const [isStackUpdate,setIsStackUpdate] = React.useState(false)
    const [isFirstUndo, setIsFirstUndo] = React.useState(false)
    const [addedItemsIdsStack, setAddedItemsIdsStack ]= React.useState(new Array())
    const [editedItemsIdsStack, setEditedItemsIdsStack ]= React.useState(new Array())
    const[itemsDeletedStack,setItemDeletedStack] =React.useState(new Array())
    const[actionsStack,setActionStack] =React.useState(new Array())
    let pageSizeFromChild;


    useSelector(state => state.logRecordsSet);
    const dispatch = useDispatch()


    //
    console.log('===========================================================')
    console.log('data');
    console.log(data);
    // console.log('addedItemsIds');
    // console.log(addedItemsIds);
    // console.log('editedItemsIds');
    // console.log(editedItemsIds);
    // console.log('itemsDeleted');
    // console.log(deletedItems);
    //
    // console.log('***********************************************************')
    // console.log('actionsStack');
    // console.log(actionsStack);
    // console.log('addedItemsIdsStack');
    // console.log(addedItemsIdsStack);
    // console.log('editedItemsIdsStack');
    // console.log(editedItemsIdsStack);
    // console.log('itemsDeletedStack');
    // console.log(itemsDeletedStack);




    props.tableColumns[0].Header = (data) => {
        return (
            <div className="d-inline-block">
                <div className="d-inline-block">
                    <DisplayTableDropDownAction
                    addNewRow={() =>addNewRow(data.data)}
                    undoChange={()=>undoChange(stack,data.data)}
                    />
                </div>
                <div className="d-inline-block"><span>Table Actions</span></div>
            </div>


        )

    }

    const updateToState2 = (key,value) => {
        switch (tableName){
            case 'Log':
            {
                dispatch(updateCsStateObject({key:key,value:value}));
                break;
            }
            case 'CS':
            {
                dispatch(updateCsStateObject({key:key,value:value}));
                break;
            }
            default:
                break;

        }
    }

    const updateToState = (data) => {

        switch (tableName){
            case 'Log':
            {
                dispatch(saveLogRecordsSet(data));
                break;
            }
            case 'CS':
            {
                dispatch(saveCsRecordsSet(data));
                break;
            }
            default:
                break;

        }
    }

    const checkData = (props,data,deletedItems,editedItemsIds)=> {
        let newDeletedItemsArr;
        newDeletedItemsArr = deletedItems.map((row) =>
                 ({...row,Sign: 3 }))


       for(let i = 0 ; i < data.length; i++)
       {
           for(let j = 0 ; j < editedItemsIds.length; j++){
               if(data[i].Id === editedItemsIds[j]){
                   data[i].Sign = 2;
               }
           }
       }

    let dataForDb = newDeletedItemsArr;
        dataForDb = dataForDb.concat(data);

        dataForDb = dataForDb.sort(function(a, b) {
            return a.Id - b.Id;
        });

       console.log('data for db:')
        console.log((dataForDb));
        console.log('props:')
        console.log(props);

        }









    // This is the event handler we pass to our table in order for us to control what our edit button does
    const handleClickEditRow = (rowIndex, data) => {

        data = data.map((row, index) =>
            ({...row, isEditing: index === rowIndex})
        )
         setIsStackUpdate(true)
        setData(data);
        updateToState(data);

    }

    //This is the event handler we pass to our table in order for us to control what our Cancel button does
    const handleClickCancelEditRow = (data) => {
        data = data.map((row) =>
            ({...row, isEditing: false})
        )
        setData(data);
        setIsCancelClicked(true);
        updateToState(data);
    }

    const handleClickDeleteRow = (rowIndex, data) => {
        // if(!(deletedItems.includes(newData[rowIndex].Id))){
        //     deletedItems.push(newData[rowIndex].Id);
        //     setdeletedItemsIds(deletedItems);
        //     console.log(deletedItems);
        // }
        // newData = data.map((row,index) =>
        //     ({...row,Sign: index === rowIndex ? 3 : row.Sign })
        // )

        let newData = [...data];
        let element = newData.splice(rowIndex, 1);

        if(new Object(...element).Sign != 1){
            deletedItems.push(...element);
            setdeletedItems(deletedItems);
            actionsStack.push('3');
            setActionStack(actionsStack);
            itemsDeletedStack.push(data[rowIndex]);
            setItemDeletedStack(itemsDeletedStack)
        }

        const addedItemFindResult = addedItemsIds.indexOf(new Object(...element).Id)
        const editedItemsFindResult = editedItemsIds.indexOf(new Object(...element).Id)
        if(addedItemFindResult > -1){
            addedItemsIds.splice(addedItemFindResult, 1)
        }
        if(editedItemsFindResult > -1){
            editedItemsIds.splice(editedItemsFindResult, 1)
        }

        setData(newData);
        updateToState(newData);

    }
    const handleClickSaveEditRow = (data, rowIndex, id, value, isSavedClicked) => {
        actionsStack.push('2');
        setActionStack(actionsStack);
        let newData= [...data];
        if(!(addedItemsIds.includes(newData[rowIndex].Id))&&!(editedItemsIds.includes(newData[rowIndex].Id))){
            editedItemsIdsStack.push(data[rowIndex].Id);
            setEditedItemsIdsStack(editedItemsIdsStack);
            editedItemsIds.push(newData[rowIndex].Id)
            setEditedItemsIds(editedItemsIds);
            console.log(editedItemsIds);
        }
            newData = data.map((row,index) =>
                ({...row, isEditing: false })
            )


        // newData = data.map((row) =>
        //     ({...row, isEditing: false})
        // )
        setData(newData);
        updateToState(newData);
        setIsSavedClicked(true);


    }
    const resetFlags = () => {
        setIsCancelClicked(false);
        setIsSavedClicked(false);
        setIsDeleteClicked(false);
    }


    const getPageSize = (pageSize)=>{
        pageSizeFromChild = pageSize;

    }

    const arrayCompare = (arr1,arr2) => {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    const undoChange = (stack,data) =>{
        let lastAction = actionsStack.pop();
        switch (lastAction){
            case '1':
            {
                let addedItemFromStack = addedItemsIdsStack.pop();
                let addedItemIdFoundResult = addedItemsIds.indexOf(addedItemFromStack)
                if(addedItemIdFoundResult > -1){
                    addedItemsIds.splice(addedItemIdFoundResult, 1)
                }
                break;
            }

            case '2':
            {
                let editedItemFromStack = editedItemsIdsStack.pop();
                let editedItemIdFoundResult = editedItemsIds.indexOf(editedItemFromStack)
                if(editedItemIdFoundResult > -1){
                    editedItemsIds.splice(editedItemIdFoundResult, 1)
                }
                break;
            }
            case '3':
            {
                let deletedItemFromStack = itemsDeletedStack.pop();
                let deletedItemFoundResult = deletedItems.indexOf(deletedItemFromStack)
                if(deletedItemFoundResult > -1){
                    deletedItems.splice(deletedItemFoundResult, 1)
                }
                break;
            }
            default:
            {
                break;
            }
        }


        if(stack.length >= 1 ) {
            const lastDataInStack = [...stack[stack.length-1]];

            if(arrayCompare(data,lastDataInStack)===true){
                stack.pop();
                setIsFirstUndo(true)
            }
            if(stack.length === 0){
                setData(originalData);
            }
            else{
                const element = stack.pop();
                setData(element);
            }
        }
        else{
            setData(originalData);
        }
    }

    const addNewRow = (data)=>{
        actionsStack.push('1');
        setActionStack(actionsStack);
        addedItemsIds.push(data[data.length-1].Id + 1)
        setAddedItemsIds(addedItemsIds);
        addedItemsIdsStack.push(data[data.length-1].Id + 1);
        setAddedItemsIdsStack(addedItemsIdsStack);
        const newData = data.concat
        ({
            Sign: 1,
            Id: data[data.length-1].Id + 1,
            Application: data[data.length-1].Application,
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
        if(pageSizeFromChild <= newData.length && (newData.length -1) % 10 === 0){
            setisPageCountChanged(true);
            handleClickEditRow(arrLastIndex , newData);
        }
        else{
            handleClickEditRow(arrLastIndex , newData);
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'auto'
                /* you can also use 'auto' behaviour
                   in place of 'smooth' */

            });
        }

    }

    const save = ()=> {
        checkData(props,data,deletedItems,editedItemsIds);
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
    React.useEffect(() => {
        updateToState(data);
        setSkipPageReset(false)

    }, [data])

    React.useEffect(() => {
        window.addEventListener("beforeunload", (ev) =>
        {

            ev.preventDefault();
            ev.returnValue = '';

        });
        window.addEventListener("unload", (ev) =>
        {

            localStorage.clear();
        });
    }, [])





    // Let's add a data resetter/randomizer to help
    // illustrate that flow...
    const resetData = () => setData(originalData)




    return (
        <Styles>
            <Table
                getPageSize={getPageSize}
                columns={columns}
                data={data}
                stack={stack}
                setStack={setStack}
                setIsStackUpdate={setIsStackUpdate}
                isStackUpdate={isStackUpdate}
                updateMyData={updateMyData}
                updateToState = {updateToState}
                handleClickEditRow={handleClickEditRow}
                handleClickCancelEditRow={handleClickCancelEditRow}
                handleClickSaveEditRow={handleClickSaveEditRow}
                handleClickDeleteRow={handleClickDeleteRow}
                isDeleteClicked={isDeleteClicked}
                isSavedClicked={isSavedClicked}
                isCancelClicked={isCancelClicked}
                isPageCountChanged ={isPageCountChanged}
                resetClickFlags={resetFlags}
                skipPageReset={skipPageReset}
                setisPageCountChanged ={setisPageCountChanged}
                undoChange={undoChange}
                setIsFirstUndo={setIsFirstUndo}
                isFirstUndo= {isFirstUndo}

            />
            <button onClick={() => save()}/>
        </Styles>
    )

}





export default ReactTable;