import React from 'react'
import { 
    Avatar, Fab, IconButton, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material"
import MyDataTable from '../../components/datagrid/MyDataTable'
import { AddOutlined, BlockOutlined, CheckOutlined, DeleteOutlined, CategoryOutlined, UploadOutlined, PlusOneOutlined, Delete, DownloadOutlined } from "@mui/icons-material"
import axios from 'axios'
import {BACKEND_URL} from '../../AppConfigs'
import Confirm from '../../components/general/Confirm'
import { useNavigate } from 'react-router-dom'

const AdminSubscribersPage=props=>{
    const [PageData,setPageData]=React.useState(null)
    const [DeleteCategory,setDeleteCategory]=React.useState(null)
    const [UploadModal,setUploadModal]=React.useState(false);
    const [AddModal,setAddModal]=React.useState(false);
    const [DeleteAllModal,setDeleteAllModal]=React.useState(false);
    const navigate=useNavigate();
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/subscribers/page`,{
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
            title:"",
            component:row=><Avatar src={`${BACKEND_URL}/auth/avatars/${row.email}`} ></Avatar>
        },
        {
            title:"Fullname",
            body:"fullname"
        },
        {
            title:"Email",
            body:"email"
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteCategory(row._id)} ><DeleteOutlined color='secondary' /></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={'h3'} >Subscribers</Typography>
            {/* <Fab sx={{margin:2}} color="primary" variant="extended" ><AddOutlined/>New Users</Fab> */}
            <div>
                <Fab sx={{margin:1}} onClick={e=>setAddModal(true)} variant="extended" color="warning" ><AddOutlined/>Add one</Fab>
                <Fab sx={{margin:1}} onClick={e=>setUploadModal(true)} variant="extended" color="primary" ><UploadOutlined/>Upload CSV</Fab>
                <Fab sx={{margin:1}} onClick={e=>setUploadModal(true)} variant="extended" color="success" ><DownloadOutlined/>Download CSV</Fab>
                <Fab sx={{margin:1}} onClick={e=>setDeleteAllModal(true)} variant="extended" color="secondary" ><DeleteOutlined/>Delete All</Fab>
            </div>
            <MyDataTable onFetchData={(page,pagesize)=>getPageData(page,pagesize)} pagedata={PageData&&PageData.pagedata} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumbers} page={PageData&&PageData.page} headers={headers} />
            <Confirm open={DeleteCategory?true:false} onOk={e=>setDeleteCategory(null)} onCancel={e=>setDeleteCategory(null)} />
            <Dialog
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                open={AddModal}
                onClose={e=>setAddModal(false)}
            >
                <DialogTitle>
                    Add subscriber
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                open={UploadModal}
                onClose={e=>setUploadModal(false)}
            >
                <DialogTitle>
                    Upload CSV
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
            <Confirm open={DeleteAllModal} onCancel={e=>setDeleteAllModal(false)} onOk={e=>{}} text={`Are you sure to delete all subscribers?`} />
        </>
    )
}

export default AdminSubscribersPage