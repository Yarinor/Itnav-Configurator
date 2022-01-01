import records from "../apis/records";
import history from "../history";

import {
    UPDATE_LOG_RECORDS,
    FETCH_LOG_RECORDS,
    SAVE_LOG_RECORDS_SET,
    SAVE_CS_RECORDS_SET,
    UPDATE_CS_STATE_OBJECT,
    DELETE_FROM_LOG_RECORDS_SET,
    DELETE_FROM_CS_RECORDS_SET,
    UPDATE_LOG_STATE_OBJECT,
    DELETE_FROM_AW_CONFIG_RECORDS_SET,
    SAVE_AW_CONFIG_RECORDS_SET,
    UPDATE_AW_CONFIG_STATE_OBJECT,
    FETCH_CS_RECORDS,
    FETCH_AW_CONFIG_RECORDS,
    FETCH_APPLICATIONS,
    SELECT_APPLICATION,
    ADD_APPLICATION,
    RESET_LOG_STATE_OBJECT,
    RESET_AW_CONFIG_STATE_OBJECT,
    RESET_CS_STATE_OBJECT

} from "./types";
import _ from "lodash";


export const fetchApplications = () => async (dispatch,getState) => {
    const response = await records.get('/applications')
    dispatch({type: FETCH_APPLICATIONS, payload: JSON.parse(response.data)})

}

export const addApplication = application => {
    return {
        type: ADD_APPLICATION,
        payload: application
    }
}


export const selectApplication = application => {
    return {
        type: SELECT_APPLICATION,
        payload: application
    }
}


export const fetchLogRecords = (appName) => async (dispatch) => {
    const response = await records.get(`applications/${appName}/Log`);
    dispatch({type: FETCH_LOG_RECORDS, payload: buildRows(JSON.parse(response.data))})
}

export const postLogRecords = (appName,data) => async (dispatch) => {
 const response = await records.post(`applications/${appName}/Log`,data);
 console.log(response);
}

export const fetchCsRecords = (appName) => async (dispatch) => {
    const response = await records.get(`/applications/${appName}/ConnectionString`);
    //const response = await records.get('/records');
    dispatch({type: FETCH_CS_RECORDS, payload: buildRows(JSON.parse(response.data))})
}

export const fetchAwConfigRecords = (appName) => async (dispatch) => {
    const response = await records.get(`/applications/${appName}/AppSettings`);
    //const response = await records.get('/records');
    dispatch({type: FETCH_AW_CONFIG_RECORDS, payload: buildRows(JSON.parse(response.data))})
}




export const saveLogRecordsSet = recordSet => {
    return {
        type: SAVE_LOG_RECORDS_SET,
        payload: recordSet
        }
}
export const saveCsRecordsSet = recordSet => {
    return {
        type: SAVE_CS_RECORDS_SET,
        payload: recordSet
    }
}

export const saveAwConfigRecordsSet = recordSet => {
    return {
        type: SAVE_AW_CONFIG_RECORDS_SET,
        payload: recordSet
    }
}



export const deleteFromLogRecordsSet = record => {
    return {
        type:DELETE_FROM_LOG_RECORDS_SET,
        payload: record
    }
}


export const deleteFromCsRecordsSet = record => {
    console.log(record);
    return {
        type:DELETE_FROM_CS_RECORDS_SET,
        payload: record
    }
}

export const deleteFromAwConfigRecordsSet = record => {
    return {
        type:DELETE_FROM_AW_CONFIG_RECORDS_SET,
        payload: record
    }
}


export const updateLogStateObject = object => {
    return {
        type: UPDATE_LOG_STATE_OBJECT,
        payload: object
    }
}
export const resetLogStateObject = ()=> {
    return {
        type: RESET_LOG_STATE_OBJECT
    }
}
export const resetCsStateObject = ()=> {
    return {
        type: RESET_CS_STATE_OBJECT
    }
}

export const resetAwConfigStateObject = ()=> {
    return {
        type: RESET_AW_CONFIG_STATE_OBJECT
    }
}


export const updateCsStateObject = object => {
    return {
        type: UPDATE_CS_STATE_OBJECT,
        payload: object
    }
}

export const updateAwConfigStateObject = object => {
    return {
        type: UPDATE_AW_CONFIG_STATE_OBJECT,
        payload: object
    }
}



export const updateRecord = () => async (dispatch, getState) => {
    const response = await records.post('/records');

    dispatch({type:UPDATE_LOG_RECORDS, payload: response.data})

}


const buildRows = (data)=>{
    const rowsArr = Object.values(_.mapKeys(data, 'Id'));
    let rows;
        rows = rowsArr.map(element => ({...element, editButton: 'edit', isEditing: false}));
    return rows
}