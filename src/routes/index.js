import React from 'react'
import {useRoutes} from 'react-router-dom'
import Loadable from './Loadable';

export default (props)=>{
    const routes=[
        {
            path:"/",
            element:Loadable(React.lazy(()=>import('../layouts/Frame')))(props),
            children:[
                {
                    path:"dashboard",
                    element:Loadable(React.lazy(()=>import('../pages/dashboard')))(props),
                },
                {
                    path:"users",
                    element:Loadable(React.lazy(()=>import('../pages/users')))(props),
                },
                {
                    path:"products",
                    element:Loadable(React.lazy(()=>import('../pages/products')))(props),
                },
            ]
        },
    ]
    return useRoutes(routes);
}