import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import logRecordsReducer from "./logRecordsReducer";
import logRecordsSetReducer from "./logRecordsSetReducer";
import csRecordsSetReducer from "./csRecordsSetReducer";
import csStateObjectReducer from "./csStateObjectReducer";
import logStateObjectReducer from "./logStateObjectReducer";
import awConfigRecordsSetReducer from "./awConfigRecordsSetReducer";
import awConfigStateObjectReducer from "./awConfigStateObjectReducer";
import csRecordsReducer from "./csRecordsReducer";
import awConfigRecordsReducer from "./awConfigRecordsReducer";
import applicationsReducer from "./applicationsReducer";
import selectedApplicationReducer from "./selectedApplicationReducer";


export default combineReducers({
    logRecords: logRecordsReducer,
    csRecords: csRecordsReducer,
    awConfigRecords: awConfigRecordsReducer,
    logRecordsSet: logRecordsSetReducer,
    logStateObject:logStateObjectReducer,
    csRecordsSet: csRecordsSetReducer,
    csStateObject:csStateObjectReducer,
    awConfigRecordsSet:awConfigRecordsSetReducer,
    awConfigStateObject:awConfigStateObjectReducer,
    applications: applicationsReducer,
    selectedApplication: selectedApplicationReducer,
    form: formReducer
});

