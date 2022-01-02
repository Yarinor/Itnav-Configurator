
import {
   FETCH_CS_RECORDS, UPDATE_CS_RECORDS
} from "../actions/types";

const csRecordsReducer =(state={}, action) =>{
    switch(action.type){
        case FETCH_CS_RECORDS:
            return action.payload;
        case UPDATE_CS_RECORDS:
            return {state,[action.payload]:action.payload}
        default:
            return state;
    }
}

export default csRecordsReducer;