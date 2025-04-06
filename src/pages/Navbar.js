import React, { useState, useEffect } from "react";
import { AppBar, Container, Toolbar, Box, Button, Slide } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../assets/images/LogoRG3.png"; 

const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return (
        <>
            {/* Navbar Atas */}
            <Slide direction="down" in={showNavbar}>
                <AppBar position="fixed" sx={{ backgroundColor: '#B4881B', height: '50px', boxShadow: 'none' }}>
                    <Container maxWidth="lg">
                        <Toolbar sx={{ display: 'flex', minHeight: '10px' }}>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{ display: 'flex', gap: 2, mb: "15px", ml: 'auto' }}>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to="/signin"
                                    sx={{
                                        color: '#FFFFFF',
                                        border: '3px solid #FFFFFF',
                                        padding: '1px 15px',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '13px'
                                    }}>
                                    Sign In
                                </Button>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/signup"
                                    sx={{
                                        color: '#B4881B',
                                        backgroundColor: '#FFFFFF',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '13px',
                                        padding: '1px 15px'
                                    }}>
                                    Sign Up
                                </Button>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Slide>

            {/* Navbar Bawah */}
            <Slide direction="down" in={showNavbar}>
                <AppBar position="fixed" sx={{ top: 50, backgroundColor: 'white', boxShadow: 3, height: '90px' }}>
                    <Container maxWidth="lg">
                        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: "8px" }}>
                                <Link to="/" style={{ textDecoration: 'none' }}>
                                    <Box
                                        component="img"
                                        src={Logo}
                                        alt="Logo"
                                        sx={{ height: '70px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                                    />
                                </Link>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3 }}>
                                {['Home', 'Destination', 'About', 'Contact'].map((text, index) => (
                                    <Button
                                        key={index}
                                        color="inherit"
                                        component={Link}
                                        to={`/${text.toLowerCase()}`}
                                        sx={{
                                            color: 'black',
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            fontFamily: 'Graphik, sans-serif',
                                            fontWeight: 400,
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                width: '100%',
                                                height: '3px',
                                                backgroundColor: '#B4881B',
                                                left: 0,
                                                bottom: '-4px',
                                                transform: 'scaleX(0)',
                                                transition: 'transform 0.3s ease-in-out',
                                            },
                                            '&:hover::after': {
                                                transform: 'scaleX(1)',
                                            }
                                        }}>
                                        {text}
                                    </Button>
                                ))}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Slide>
        </>
    );
};

export default Navbar;
