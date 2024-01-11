import React from 'react'
import {useNavigate, useRoutes, matchRoutes} from 'react-router-dom'
import Loadable from './Loadable';
import axios from 'axios'
import { BACKEND_URL } from '../AppConfigs';
import {useSelector,useDispatch} from 'react-redux'
import {authSuccess} from '../store/reducers/auth.reducer'
export default (props)=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const routes=[
        {
            path:"/",
            element:Loadable(React.lazy(()=>import('../layouts/Default')))(props),
            children:[
                {
                    path:"",
                    element:Loadable(React.lazy(()=>import('../pages/index')))(props),
                },
                {
                    path:"auth/signin",
                    element:Loadable(React.lazy(()=>import('../pages/auth/signin')))(props),
                }
            ]
        },
        {
            path:"/admin",
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
                    auth:true,
                    element:Loadable(React.lazy(()=>import('../pages/products')))(props),
                },
                {
                    path:"products/categories",
                    element:Loadable(React.lazy(()=>import('../pages/products/categories')))(props),
                },
                {
                    path:"orders",
                    element:Loadable(React.lazy(()=>import('../pages/orders')))(props),
                },
            ]
        }
        
    ]
    // console.log(matchRoutes(routes,window.location.pathname))
    if(sessionStorage.getItem('token'))
    axios.get(`${BACKEND_URL}/auth/verify`,{
        headers:{
            token:sessionStorage.getItem("token")
        }
    })
    .then(response=>{
        if(response.data.status=="success"){
            dispatch(authSuccess(response.data.data))
        }
    })
    return useRoutes(routes);
}