import { Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import axios from 'axios'
import { BACKEND_URL } from "../../AppConfigs";
import { useSnackbar } from "notistack";
import { DeleteOutlined } from "@mui/icons-material";
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

const AdminOrdersPage=props=>{
    const [PageData,setPageData]=React.useState(null);
    const [DeleteOrder,setDeleteOrder]=React.useState(null);
    const [ShowOrder,setShowOrder]=React.useState(null);
    const snackbar=useSnackbar()
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/shop/orders/page`,{page,pagesize},{
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
    const deleteOrder=(order_id)=>{
        axios.delete(`${BACKEND_URL}/shop/orders/${order_id}`,{
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
            title:"Buyer",
            component:row=><div onClick={e=>setShowOrder(row)} ><Typography>{row.user.fullname}</Typography><p>{row.user.email}</p></div>
        },
        {
            title:"Total Price",
            component:row=><div onClick={e=>setShowOrder(row)} >{row.price+" USD $"}</div>
        },
        {
            title:"Amount Of Products",
            component:row=><div onClick={e=>setShowOrder(row)} >{row.products.length}</div>
        },
        {
            title:"Ordered Date",
            component:row=><div onClick={e=>setShowOrder(row)} >{row.createdAt.slice(0,10)}</div>
        },
        {
            title:"Status",
            component:row=><div onClick={e=>setShowOrder(row)} >{row.status?row.status:""}</div>
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteOrder(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={`h3`} >Orders</Typography>
            <MyDataTable pagedata={PageData&&PageData.pagedata} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumber} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} headers={headers} />
            <Dialog
                open={ShowOrder?true:false}
                onClose={e=>setShowOrder(null)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Order Detail</DialogTitle>
                <DialogContent>
                    
                    {ShowOrder&&(
                        <>
                            <Typography>Buyer: {ShowOrder.user.fullname} {ShowOrder.user.email}</Typography>
                            <List>
                                {ShowOrder.products.map((oneProduct,index)=>{
                                    return (
                                        <ListItem key={index} >
                                            <ListItemAvatar>
                                                <img style={{width:"10vh"}} src={oneProduct.product.image_url?oneProduct.product.image_url:`${BACKEND_URL}/shop/products/${oneProduct.product._id}/image`} />
                                            </ListItemAvatar>
                                            <ListItemText sx={{marginLeft:2}} primary={oneProduct.product.title+" X "+oneProduct.count} secondary={
                                                oneProduct.product.price+" X "+oneProduct.count+" = "+(Number(oneProduct.product.price)*Number(oneProduct.count)+" USD $")
                                                } >
                                            </ListItemText>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </>
                    )}
                    <Divider/>
                    <Typography component={`h3`} variant="h3" >Total: {ShowOrder&&ShowOrder.price} USD $</Typography>
                    <Typography component={`h5`} variant="h5">{ShowOrder&&ShowOrder.createdAt.slice(0,10)}</Typography>
                </DialogContent>
                <DialogActions>
                {/* <Button variant="outlined" onClick={e=>setShowOrder(false)}>Cancel</Button> */}
                {/* <Button variant="contained" onClick={e=>saveProduct()}>Save</Button> */}
                </DialogActions>
            </Dialog>
            <Confirm open={DeleteOrder?true:false} onOk={e=>deleteOrder(DeleteOrder)} onCancel={e=>setDeleteOrder(null)} />
        </>
    )
}
export default AdminOrdersPage;