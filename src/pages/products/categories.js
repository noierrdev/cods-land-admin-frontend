import { Fab, Typography } from '@mui/material';
import React from 'react';
import {Add, AddOutlined} from '@mui/icons-material'
const AdminProductCategoriesPage=props=>{
    return (
        <>
            <Typography variant='h3' component={`h3`} >Product Categories</Typography>
            <Fab sx={{margin:1}} variant='extended' color='primary' ><AddOutlined/> New Category</Fab>
        </>
    )
}
export default AdminProductCategoriesPage