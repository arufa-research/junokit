import {createContext} from "react";

export const UserContext = createContext({
    isLoggingIn: <boolean>false, 
    setIsLoggingIn: (status:boolean)=>{}
});
