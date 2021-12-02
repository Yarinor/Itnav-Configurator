import _ from "lodash"
import {
    FETCH_LOG_RECORDS,
    UPDATE_LOG_RECORDS,
    SAVE_LOG_RECORDS_SET, UPDATE_AW_CONFIG_RECORDS, FETCH_AW_CONFIG_RECORDS
} from "../actions/types";
import {toJSON} from "lodash/seq";

const awConfigRecordsReducer =(state={}, action) =>{
    switch(action.type){
        case FETCH_AW_CONFIG_RECORDS:
            // return {...state,..._.mapKeys(action.payload, 'Id')};
            return action.payload;
        case UPDATE_AW_CONFIG_RECORDS:
            return {state,[action.payload]:action.payload}
        default:
            return state;
    }
}

export default awConfigRecordsReducer;