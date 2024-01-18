import React from 'react'
import { Fab, IconButton, Typography } from "@mui/material"
import MyDataTable from '../../components/datagrid/MyDataTable'
import { AddOutlined, DeleteOutlined } from "@mui/icons-material"
import axios from 'axios'
import {BACKEND_URL} from '../../AppConfigs'

const AdminUsersPage=props=>{
    const [PageData,setPageData]=React.useState(null)
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/admin/users`,{
            page,pagesize
        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                setPageData(response.data.data)
            }
        })
    }
    const headers=[
        {
            title:"Fullname"
        },
        {
            title:"Email"
        },
        {
            title:"Gender"
        },
        {
            title:"Allow"
        },
        {
            title:"Verified"
        },
        {
            title:"Delete",
            component:row=><IconButton><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={'h3'} >Users</Typography>
            <Fab sx={{margin:2}} color="primary" variant="extended" ><AddOutlined/>New Users</Fab>
            <MyDataTable pagedata={PageData&&PageData.pagedata} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumbers} page={PageData&&PageData.page} headers={headers} />
        </>
    )
}

export default AdminUsersPage