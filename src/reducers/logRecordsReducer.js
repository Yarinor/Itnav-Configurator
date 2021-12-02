import _ from "lodash"
import {
    FETCH_LOG_RECORDS,
    UPDATE_LOG_RECORDS,
} from "../actions/types";
import {toJSON} from "lodash/seq";

const logRecordsReducer =(state={}, action) =>{
    switch(action.type){
        case FETCH_LOG_RECORDS:
            // return {...state,..._.mapKeys(action.payload, 'Id')};
            return action.payload;
        case UPDATE_LOG_RECORDS:
            return {state,[action.payload]:action.payload}
        default:
            return state;
    }
}

export default logRecordsReducer;