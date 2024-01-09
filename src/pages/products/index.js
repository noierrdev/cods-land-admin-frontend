import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import { Fab, Typography,Button,IconButton } from "@mui/material";
import axios from 'axios'
import {BACKEND_URL} from '../../AppConfigs'
import {DeleteOutlined,AddOutlined} from '@mui/icons-material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Confirm from "../../components/general/Confirm";

const AdminProductsPage=props=>{
    const [PageData,setPageData]=React.useState(null);
    const [NewProduct,setNewProduct]=React.useState(false);
    const [DeleteProduct,setDeleteProduct]=React.useState(null);
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/shop/products/page`,{page,pagesize})
        .then(response=>{
            if(response.data.status==="success"){
                setPageData(response.data.data)
            }
        })
    }
    const deleteProduct=(product_id)=>{
        axios.delete(`${BACKEND_URL}/shop/products/${product_id}`)
        .then(response=>{
            if(response.data.status==="success"){
                setDeleteProduct(null);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    React.useEffect(()=>{
        if(!PageData)
            getPageData(0,10)
    },[])
    const headers=[
        {
            title:"Product Image",
            component:(row)=><img style={{width:"5vw"}} src={`data:${row.image&&row.image.mimetype};base64, ${row.image&&row.image.data}`} />
        },
        {
            title:"Product Name",
            body:"title"
        },
        {
            title:"Price",
            body:"price"
        },
        {
            title:"Count"
        },
        {
            title:"Created",
            component:row=><Typography>{row.createdAt&&row.createdAt.slice(0,10)}</Typography>
        },
        {
            title:"Delete",
            component:(row)=><IconButton onClick={e=>setDeleteProduct(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={`h3`} >Products</Typography>
            <Fab sx={{margin:1}} onClick={e=>setNewProduct(true)} variant="extended" color="primary" ><AddOutlined/>New Product</Fab>
            <MyDataTable headers={headers} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumbers} pagedata={PageData?PageData.pagedata:[]} onFetchData={(page,pagesize)=>console.log(page,pagesize)} />
            <Dialog
                open={NewProduct}
                onClose={e=>setNewProduct(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={e=>setNewProduct(false)}>Disagree</Button>
                <Button onClick={e=>setNewProduct(false)} autoFocus>
                    Agree
                </Button>
                </DialogActions>
            </Dialog>
            <Confirm open={DeleteProduct?true:false} onOk={()=>{deleteProduct(DeleteProduct)}} onCancel={e=>setDeleteProduct(null)} />
        </>
    )
}
export default AdminProductsPage