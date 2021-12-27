
import axios from "axios";

export default axios.create({
    baseURL:'http://172.16.5.186/ItnvConfigurationGui/itnvconfig'
    //baseURL:'http://localhost:3001'
})