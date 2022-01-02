
import {
 UPDATE_AW_CONFIG_RECORDS, FETCH_AW_CONFIG_RECORDS
} from "../actions/types";

const awConfigRecordsReducer =(state={}, action) =>{
    switch(action.type){
        case FETCH_AW_CONFIG_RECORDS:
            return action.payload;
        case UPDATE_AW_CONFIG_RECORDS:
            return {state,[action.payload]:action.payload}
        default:
            return state;
    }
}

export default awConfigRecordsReducer;