import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/LogoRG3.png';

function Navbar() {

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#B4881B', height: '50px', boxShadow: 'none' }}>
            <Toolbar>
                <Box sx={{ ml: 'auto', mr: '5px', mb: "10px" }}>
                    <Button color="inherit" component={Link} to="" sx={{ mx: 1, textTransform: 'none' }}>
                        Sign In
                    </Button>
                    <Button color="inherit" component={Link} to="" sx={{ mx: 1, textTransform: 'none' }}>
                        Sign Up
                    </Button>
                </Box>
            </Toolbar>
            <Toolbar sx={{ minHeight: '40px', ml: 'auto', borderBottom: '1px solid #555555', width: '100%', mt: "10px", backgroundColor:"white" }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img
                            src={Logo}
                            alt="Logo"
                            style={{
                                height: '60px',
                                marginLeft: '70px',
                                marginTop: '15px',
                                marginBottom: '35px'
                            }}
                        />

                    </Link>
                </Box>
                <Box sx={{ ml: 'auto', display: 'flex', mr: "70px", mb: "15px" }}>
                    <Button sx={{ color: 'black', mx: 2, textTransform: 'none' }}>
                        Home
                    </Button>
                    <Button sx={{ color: 'black', mx: 2, textTransform: 'none' }}>
                        About
                    </Button>
                    <Button sx={{ color: 'black', mx: 2, textTransform: 'none' }}>
                        Contact
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;