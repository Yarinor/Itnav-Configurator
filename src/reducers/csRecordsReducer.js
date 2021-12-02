import _ from "lodash"
import {
    FETCH_LOG_RECORDS,
    UPDATE_LOG_RECORDS,
    SAVE_LOG_RECORDS_SET, FETCH_CS_RECORDS, UPDATE_CS_RECORDS
} from "../actions/types";
import {toJSON} from "lodash/seq";

const csRecordsReducer =(state={}, action) =>{
    switch(action.type){
        case FETCH_CS_RECORDS:
            // return {...state,..._.mapKeys(action.payload, 'Id')};
            return action.payload;
        case UPDATE_CS_RECORDS:
            return {state,[action.payload]:action.payload}
        default:
            return state;
    }
}

export default csRecordsReducer;