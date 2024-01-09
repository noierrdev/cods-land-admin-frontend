import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Outlet } from 'react-router-dom';
import Logo from '../assets/images/logo.png'
import {useNavigate,useLocation} from 'react-router-dom'
import { Fab } from '@mui/material';

const drawerWidth = 240;

export default function FrameLayout(props) {
    const navigate=useNavigate()
    const {pathname}=useLocation();
    
    return (
        <Box sx={{ display: 'flex' }}>
        <AppBar
            position="fixed"
            sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
            <Toolbar sx={{backgroundColor:"white"}} >
            {/* <Typography variant="h6" noWrap component="div">
                Permanent drawer
            </Typography> */}
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor:"#2E3192",
                color:"white"
            },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <img src={Logo} style={{width:"40%",marginLeft:"auto",marginRight:"auto"}} />
            <List sx={{padding:'2vw'}} >
                <ListItem disablePadding>
                    {pathname.indexOf('/dashboard')==0?(
                        <Fab style={{width:"100%"}} variant='extended' >Dashboard</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/dashboard')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Dashboard`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname.indexOf('/users')==0?(
                        <Fab style={{width:"100%"}} variant='extended' >Users</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/users')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Users`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname.indexOf('/products')==0?(
                        <Fab style={{width:"100%"}} variant='extended' >Products</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/products')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Products`} />
                        </ListItemButton>
                    )}
                </ListItem>
            </List>
        </Drawer>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
            <Toolbar />
            <Outlet {...props} />
        </Box>
        </Box>
    );
}