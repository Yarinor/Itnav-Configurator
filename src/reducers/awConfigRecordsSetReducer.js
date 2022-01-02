import {
    SAVE_AW_CONFIG_RECORDS_SET,
    DELETE_FROM_AW_CONFIG_RECORDS_SET,
} from "../actions/types";



const awConfigRecordsSetReducer =(state = {}, action) =>{

    switch (action.type){
        case SAVE_AW_CONFIG_RECORDS_SET:
        {
            return action.payload
        }
        case DELETE_FROM_AW_CONFIG_RECORDS_SET:
        {
            const obj = Object.assign({},action.payload)
            delete state[obj['0'].Id]
            return state;
        }
        default:
            return state;
    }


}

export default awConfigRecordsSetReducer;