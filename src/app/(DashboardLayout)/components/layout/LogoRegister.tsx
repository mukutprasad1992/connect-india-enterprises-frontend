import { Box, Grid, styled } from "@mui/material";
import Image from "next/image";

const LogoRegister = () => {
    return (
        <Grid container alignItems="center" spacing={1}>
            {/* Logo */}
            <Grid item>
                <Box
                    component="img"
                    src="/logo-transparent-small-png.png"
                    alt="App Logo"
                    sx={{ height: 50, width: "auto", transition: "all 0.3s" }}
                />
            </Grid>

            {/* Text section */}
            <Grid item>
                <Grid container direction="column">
                    <Grid item sx={{ color: "black", fontFamily: "Corbel", fontSize: 20, fontWeight: 600 }}>
                        Connect India
                    </Grid>
                    <Grid item sx={{ fontFamily: "Corbel", fontSize: 16, color: "brown", fontWeight: 600 }}>
                        Enterprises
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LogoRegister;
