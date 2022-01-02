import {
    DELETE_FROM_CS_RECORDS_SET,
    SAVE_CS_RECORDS_SET
} from "../actions/types";



const csRecordsSetReducer = (state = {}, action) => {
    switch (action.type) {
        case SAVE_CS_RECORDS_SET: {
            return action.payload
        }
        case DELETE_FROM_CS_RECORDS_SET: {
            const obj = Object.assign({}, action.payload)
            delete state[obj['0'].Id]
            return state;
        }
        default:
            return state;
    }


}

export default csRecordsSetReducer;