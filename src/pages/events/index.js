import { Divider, IconButton, TextField, Typography ,Fab,Button, Tooltip,Paper} from "@mui/material";
import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import axios from 'axios'
import { BACKEND_URL } from "../../AppConfigs";
import { useSnackbar } from "notistack";
import { BlockOutlined, CheckOutlined, DeleteOutlined,AddOutlined,ListOutlined,ImageOutlined } from "@mui/icons-material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Confirm from "../../components/general/Confirm";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const AdminEventsPage=(props)=>{
    const [PageData,setPageData]=React.useState(null);
    const [DeleteEvent, setDeleteEvent]=React.useState(null);
    const snackbar=useSnackbar();
    const [ShowEvent,setShowEvent]=React.useState(null);
    const [EditEvent,setEditEvent]=React.useState(false);
    const refTitle=React.useRef(null);
    const refDescription=React.useRef(null);
    const refImage=React.useRef(null);
    const [LogoImage,setLogoImage]=React.useState(null);
    const navigate=useNavigate();
    useAuth()
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/events/page`,{page,pagesize},{
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
    const saveEvent=()=>{
        if(!refTitle.current.value) return snackbar.enqueueSnackbar("Input Title!",{variant:"error"})
        const myForm=new FormData();
        myForm.append('title',refTitle.current.value);
        myForm.append('description',refDescription.current.value);
        myForm.append("logo",LogoImage);
        axios.post(`${BACKEND_URL}/events/`,myForm,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                setEditEvent(false);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const deleteEvent=(order_id)=>{
        axios.delete(`${BACKEND_URL}/events/${order_id}`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Deleted successfully",{variant:'success'})
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const headers=[
        {
            title:"Title",
            component:row=><Typography>{row.title}</Typography>,
            tooltip:row=>row.description
        },
        {
            title:"Created",
            component:row=><div  >{row.createdAt.slice(0,10)}</div>
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteEvent(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={`h3`} >Events</Typography>
            <Fab sx={{margin:1}} onClick={e=>setEditEvent(true)} variant="extended" color="info" ><AddOutlined/>Add Event</Fab>
            <MyDataTable pagedata={PageData&&PageData.pagedata} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumber} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} headers={headers} />
            <Dialog
                open={EditEvent}
                onClose={e=>setEditEvent(false)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Event Edit</DialogTitle>
                <DialogContent>
                    <TextField
                    variant="outlined"
                    label="Title"
                    fullWidth
                    margin="normal"
                    inputRef={refTitle}
                    />
                    <TextField
                    variant="outlined"
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    inputRef={refDescription}
                    />
                    <Paper onClick={e=>refImage.current.click()} elevation={8}  sx={{padding:5,textAlign:"center"}} >
                        {LogoImage?(
                            <img style={{width:"80%"}} src={window.URL.createObjectURL(LogoImage)} />
                        ):(
                            <>
                            <ImageOutlined style={{fontSize:"10vw",color:"gray"}} />
                            <Typography component={`h5`} sx={{color:"gray"}} variant="h5" >Click to Upload Logo Image</Typography>
                            </>
                        )}
                    </Paper>
                    <input hidden accept="image/*" onChange={e=>setLogoImage(e.target.files[0])} type="file" ref={refImage} />
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" onClick={e=>setEditEvent(false)}>Cancel</Button>
                <Button variant="contained" onClick={e=>saveEvent()}>Save</Button>
                </DialogActions>
            </Dialog>
            <Confirm open={DeleteEvent?true:false} onOk={e=>deleteEvent(DeleteEvent)} onCancel={e=>setDeleteEvent(null)} />
        </>
    )
}
export default AdminEventsPage