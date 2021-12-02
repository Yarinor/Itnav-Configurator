import {
SELECT_APPLICATION
} from "../actions/types";


const selectedApplicationReducer = (state={}, action) =>{
    switch(action.type){
        case SELECT_APPLICATION:
            return action.payload
        default:
            return state;

    }
}

export default selectedApplicationReducer;