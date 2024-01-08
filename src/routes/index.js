import React from 'react'
import {useRoutes} from 'react-router-dom'
import Loadable from './Loadable';

export default (props)=>{

    const routes=[
        {
            path:"/",
            element:Loadable(React.lazy(()=>import('../layouts/Default')))(props),
            children:[
                {
                    path:"",
                    element:Loadable(React.lazy(()=>import('../pages')))(props),
                }
            ]
        }
    ]
    return useRoutes(routes);
}