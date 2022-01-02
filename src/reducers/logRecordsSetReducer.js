import {
    SAVE_LOG_RECORDS_SET,
    DELETE_FROM_LOG_RECORDS_SET,
} from "../actions/types";




const logRecordsSetReducer =(state = {}, action) =>{

    switch (action.type){
        case SAVE_LOG_RECORDS_SET:
        {

            return action.payload
        }
        case DELETE_FROM_LOG_RECORDS_SET:
        {
            const obj = Object.assign({},action.payload)
            delete state[obj['0'].Id]
            return state;
        }
        default:
            return state;
    }


}

export default logRecordsSetReducer;