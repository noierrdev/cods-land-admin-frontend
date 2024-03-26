import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import { Fab, Typography,Button,IconButton, Paper, MenuItem, Divider, FormControl, FormControlLabel,Checkbox, Grid } from "@mui/material";
import axios from 'axios'
import {BACKEND_URL} from '../../AppConfigs'
import {DeleteOutlined,AddOutlined,CloudUploadOutlined,CancelOutlined, ImageOutlined, TableChartOutlined, DownloadOutlined, CheckOutlined, BlockOutlined} from '@mui/icons-material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Confirm from "../../components/general/Confirm";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useSnackbar } from "notistack";
import querystringify from 'querystringify'
import { useLocation, useNavigate, useNavigation} from 'react-router-dom'
import useAuth from "../../hooks/useAuth";

const AdminProductsPage=props=>{
    const [PageData,setPageData]=React.useState(null);
    const [NewProduct,setNewProduct]=React.useState(false);
    const [DeleteProduct,setDeleteProduct]=React.useState(null);
    const [ProductImage,setProductImage]=React.useState(null);
    const [AllCategories, setAllCategories]=React.useState(null);
    const [UploadFile,setUploadFile]=React.useState(false)
    const [ProductFile,setProductFile]=React.useState(null);
    const [DeleteAll,setDeleteAll]=React.useState(false);
    const [ShowProduct,setShowProduct]=React.useState(null);
    const snackbar=useSnackbar();
    const refTitle=React.useRef(null);
    const refDescription=React.useRef(null);
    const refPrice=React.useRef(null);
    const refPublic=React.useRef(null);
    const refCategory=React.useRef(null);
    const refCategory_1=React.useRef(null);
    const refCategory_2=React.useRef(null);
    const refCategory_3=React.useRef(null);
    const refLength=React.useRef(null);
    const refWidth=React.useRef(null);
    const refHeight=React.useRef(null);
    const refWeight=React.useRef(null);
    const refImage=React.useRef(null);
    const refCSV=React.useRef(null)
    const {search}=useLocation()
    const navigate=useNavigate()
    // useAuth()
    
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/shop/products/page`,{
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
    const deleteProduct=(product_id)=>{
        axios.delete(`${BACKEND_URL}/shop/products/${product_id}`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Deleted Successfully",{variant:"success"})
                setDeleteProduct(null);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const switchPublic=(product_id,value)=>{
        axios.put(`${BACKEND_URL}/shop/products`,{
            id:product_id,
            public:value==true?false:true
        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Updated Successfully",{variant:"success"})
                setDeleteProduct(null);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const saveProduct=()=>{
        if(!refTitle.current.value) return snackbar.enqueueSnackbar("Input Title!",{variant:"error"})
        if(!refDescription.current.value) return snackbar.enqueueSnackbar("Input Description!",{variant:"error"});
        if(!refPrice.current.value) return snackbar.enqueueSnackbar("Input Price!",{variant:"error"})
        if(!ProductImage) return snackbar.enqueueSnackbar("Select Product Image!",{variant:"error"})
        const myForm=new FormData();
        myForm.append('title',refTitle.current.value);
        myForm.append('description',refDescription.current.value);
        // myForm.append('category',refCategory.current.value);
        myForm.append('category_1',refCategory_1&&refCategory_1.current.value);
        myForm.append('category_2',refCategory_2&&refCategory_2.current.value);
        myForm.append('category_3',refCategory_3&&refCategory_3.current.value);
        myForm.append('price',refPrice.current.value);
        myForm.append('length',refLength.current.value);
        myForm.append('width',refWidth.current.value);
        myForm.append('height',refHeight.current.value);
        myForm.append('weight',refWeight.current.value);
        myForm.append('public',refPublic.current.checked);
        myForm.append('image',ProductImage);
        axios.post(`${BACKEND_URL}/shop/products`,myForm,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                setNewProduct(false);
                refTitle.current.value="";
                refDescription.current.value="";
                refPrice.current.value="";
                refWidth.current.value="";
                refLength.current.value="";
                refHeight.current.value="";
                refWeight.current.value="";
                setProductImage(null)
                getPageData(PageData.page,PageData.pagesize);
                snackbar.enqueueSnackbar("Saved successfully",{variant:"success"})
            }
        })
    }
    React.useEffect(()=>{
        axios.get(`${BACKEND_URL}/shop/categories`)
        .then(response=>{
            if(response.data.status==="success"){
                setAllCategories(response.data.data)
            }
        });
    },[])
    const uploadCSV=()=>{
        if(!ProductFile) return;
        const myForm=new FormData();
        myForm.append('csv',ProductFile)
        axios.post(`${BACKEND_URL}/admin/upload-csv`,myForm,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            console.log(response)
        })
    }
    const headers=[
        {
            title:"Product Image",
            component:(row)=>row.image_url?<img style={{width:"5vw"}} onClick={e=>setShowProduct(row)} src={row.image_url} />:<img style={{width:"5vw"}} onClick={e=>setShowProduct(row)} src={`${BACKEND_URL}/shop/products/${row._id}/image`} />,
            tooltip:row=>row.description
        },
        {
            title:"Product Name",
            component:row=><div onClick={e=>setShowProduct(row)} ><Typography>{row.title}</Typography></div>,
            tooltip:row=>row.description
        },
        {
            title:"Price",
            component:row=><Typography>{row.price&&"$ "+(row.price.toFixed(2).toLocaleString('en-US'))}</Typography>
        },
        {
            title:"Public",
            component:row=>{return <IconButton onClick={e=>switchPublic(row._id,row.public)} >{row.public?<CheckOutlined color="primary" />:<BlockOutlined color="secondary" />}</IconButton>}
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
            <div>
                <Fab sx={{margin:1}} onClick={e=>setNewProduct(true)} variant="extended" color="primary" ><AddOutlined/>New Product</Fab>
                <Fab sx={{margin:1}} onClick={e=>setUploadFile(true)} variant="extended" color="info" ><CloudUploadOutlined/> Upload CSV</Fab>
                <Fab sx={{margin:1}} color="secondary" variant="extended" ><DeleteOutlined />&nbsp;Delete All</Fab>
                <Fab sx={{margin:1}} color="success" variant="extended" ><DownloadOutlined />&nbsp;Download CSV</Fab>
            </div>
            <MyDataTable headers={headers} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumbers} pagedata={PageData?PageData.pagedata:[]} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} />
            <Dialog
                open={NewProduct}
                onClose={e=>setNewProduct(false)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Product Detail Edit</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="normal"
                    label="Product Name"
                    fullWidth
                    variant="outlined"
                    inputRef={refTitle}
                />
                {AllCategories&&(
                    <>
                    <TextField
                        margin="normal"
                        label="Product Category"
                        fullWidth
                        select
                        inputRef={refCategory_1}
                        variant="outlined"
                        defaultValue={""}
                    >
                        <MenuItem  value={""} >
                            
                        </MenuItem>
                        {AllCategories&&AllCategories.map((oneCategory,index)=>{
                            return (
                                <MenuItem key={index} value={oneCategory._id} >
                                    {oneCategory.title}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    <TextField
                        margin="normal"
                        label="Product Category"
                        fullWidth
                        select
                        inputRef={refCategory_2}
                        variant="outlined"
                        defaultValue={""}
                    >
                        <MenuItem  value={""} >
                            
                        </MenuItem>
                        {AllCategories&&AllCategories.map((oneCategory,index)=>{
                            return (
                                <MenuItem key={index} value={oneCategory._id} >
                                    {oneCategory.title}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    <TextField
                        margin="normal"
                        label="Product Category"
                        fullWidth
                        select
                        inputRef={refCategory_3}
                        variant="outlined"
                        defaultValue={""}
                    >
                        <MenuItem  value={""} >
                            
                        </MenuItem>
                        {AllCategories&&AllCategories.map((oneCategory,index)=>{
                            return (
                                <MenuItem key={index} value={oneCategory._id} >
                                    {oneCategory.title}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    </>
                )}
                
                <TextField
                    label="Price"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refPrice}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">USD $</InputAdornment>,
                    }}
                />
                <TextField
                    label="Length"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refLength}
                    defaultValue={10}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">in</InputAdornment>,
                    }}
                />
                <TextField
                    label="Width"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refWidth}
                    defaultValue={10}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">in</InputAdornment>,
                    }}
                />
                <TextField
                    label="Height"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refHeight}
                    defaultValue={10}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">in</InputAdornment>,
                    }}
                />
                <TextField
                    label="Weight"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refWeight}
                    defaultValue={2}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">lb</InputAdornment>,
                    }}
                />
                <FormControl>
                    <FormControlLabel control={<Checkbox onChange={e=>console.log(refPublic.current.checked)} inputRef={refPublic} />} label={`Public`} />
                </FormControl>
                <TextField
                    autoFocus
                    margin="normal"
                    label="Product Description"
                    multiline
                    inputRef={refDescription}
                    rows={10}
                    fullWidth
                    variant="outlined"
                />
                
                <Paper onClick={e=>refImage.current.click()} elevation={8}  sx={{padding:5,textAlign:"center"}} >
                    {ProductImage?(
                        <img style={{width:"80%"}} src={window.URL.createObjectURL(ProductImage)} />
                    ):(
                        <>
                        <ImageOutlined style={{fontSize:"10vw",color:"gray"}} />
                        <Typography component={`h5`} sx={{color:"gray"}} variant="h5" >Click to Upload Product Main Image</Typography>
                        </>
                    )}
                </Paper>
                <input hidden accept="image/*" onChange={e=>setProductImage(e.target.files[0])} type="file" ref={refImage} />
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" onClick={e=>setNewProduct(false)}>Cancel</Button>
                <Button variant="contained" onClick={e=>saveProduct()}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={ShowProduct?true:false}
                onClose={e=>setShowProduct(null)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle></DialogTitle>
                {ShowProduct&&(
                    <DialogContent>
                        <Typography align="center" variant="h4" component={`h4`} >{ShowProduct.title}</Typography>
                        <div style={{display:"flex",justifyContent:"center"}} ><img style={{width:"40%"}} src={ShowProduct.image_url?ShowProduct.image_url:`${BACKEND_URL}/shop/products/${ShowProduct._id}/image`} /></div>
                        <Divider/>
                        <Grid container alignItems={`center`} justifyContent={`center`} >
                            <Grid item xs={8}>
                                <Typography>{ShowProduct.public?"Store : Public":"Store : Private"}</Typography>
                                <Typography>{ShowProduct.category_1&&"Category 1 : "+ShowProduct.category_1.title}</Typography>
                                <Typography>{ShowProduct.category_2&&"Category 2 : "+ShowProduct.category_2.title}</Typography>
                                <Typography>{ShowProduct.category_3&&"Category 3 : "+ShowProduct.category_3.title}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>{ShowProduct.length&&"Length : "+ShowProduct.length+" in"}</Typography>
                                <Typography>{ShowProduct.width&&"Width : "+ShowProduct.width+" in"}</Typography>
                                <Typography>{ShowProduct.height&&"Height : "+ShowProduct.height+" in"}</Typography>
                                <Typography>{ShowProduct.weight&&"Weight : "+ShowProduct.height+" lb"}</Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        <div style={{display:"flex"}} >
                            <Typography >{ShowProduct.price&&"Price : "+ShowProduct.price} USD $</Typography>
                            <div style={{flexGrow:1}} ></div>
                        </div>
                        <Divider/>
                        <Typography>Description : </Typography>
                        <div dangerouslySetInnerHTML={{__html:ShowProduct.description}} >

                        </div>
                    </DialogContent>
                )}
            </Dialog>
            <Dialog
                open={UploadFile}
                onClose={e=>setUploadFile(false)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Upload CSV File</DialogTitle>
                <DialogContent>
                <Paper onClick={e=>refCSV.current.click()} elevation={8}  sx={{padding:5,textAlign:"center"}} >
                    {ProductFile?(
                        <TableChartOutlined sx={{fontSize:"5vw",color:'darkgray'}} />
                    ):(
                        <>
                        {/* <ImageOutlined style={{fontSize:"10vw",color:"gray"}} /> */}
                        <Typography component={`h5`} sx={{color:"gray"}} variant="h5" >Click to Upload CSV File</Typography>
                        </>
                    )}
                </Paper>
                <input hidden onChange={e=>setProductImage(e.target.files[0])} type="file" ref={refImage} />
                <input hidden accept=".csv" onChange={e=>setProductFile(e.target.files[0])} type="file" ref={refCSV} />
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" onClick={e=>setNewProduct(false)}>Cancel</Button>
                <Button variant="contained" onClick={e=>uploadCSV()}>Save</Button>
                </DialogActions>
            </Dialog>
            <Confirm open={DeleteProduct?true:false} onOk={()=>{deleteProduct(DeleteProduct)}} onCancel={e=>setDeleteProduct(null)} />
            <Confirm open={DeleteAll} />
        </>
    )
}
export default AdminProductsPage