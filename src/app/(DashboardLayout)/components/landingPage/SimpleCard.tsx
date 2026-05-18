"use client";
import React, { useState } from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"; // 👁 Example new icon

interface SimpleCardProps {
    image: string;
    title: string;
    description: string;
    buttonImage: string;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ image, title, description, buttonImage }) => {
    const [hover, setHover] = useState(false);

    const handleNext = () => {
        console.log("Next clicked");
    };

    const handlePreview = () => {
        console.log("Preview clicked");
    };

    return (
        <Card
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                width: 385,
                height: 500,
                boxShadow: 2,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                // transition: "all 0.4s ease",
                ":hover": { boxShadow: 6 },
            }}
        >
            {/* IMAGE + ICONS */}
            <Box sx={{ overflow: "hidden", height: 250, position: "relative" }}>
                {/* Background Image with Zoom Effect */}
                <CardMedia
                    component="img"
                    height="250"
                    image={image}
                    alt={title}
                    sx={{
                        objectFit: "cover",
                        // transition: "transform 0.5s ease",
                        // transform: hover ? "scale(1.1)" : "scale(1)",
                    }}
                />
                {/* Arrow Button — moves to center on hover */}
                <IconButton
                    sx={{
                        // backgroundColor: "#515fd8ff",
                        // color: "#fff",
                        borderRadius: "50%",
                        width: 80,
                        height: 80,
                        position: "absolute",
                        bottom: 15,
                        right: 15,
                        // transform: hover
                        //     ? "translate(50%, 50%) scale(1.1)"
                        //     : "translate(0, 0) scale(1)",
                        // transition: "all 0.5s ease",
                        // "&:hover": {
                        //     backgroundColor: "rgba(28, 101, 170, 0.91)",
                        // },
                        zIndex: 2,
                        overflow: "hidden",
                        p: 0,
                    }}
                >
                    <Box
                        component="img"
                        src={buttonImage}
                        alt="icon"
                        sx={{
                            width: 70,
                            height: 70,
                            objectFit: "contain",
                        }}
                    />
                </IconButton>
            </Box>

            {/* Title & Description */}
            <CardContent sx={{ pt: 2 }}>
                <Typography
                    variant="h6"
                    component="div"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, fontSize: "0.95rem" }}
                >
                    {description}
                </Typography>
            </CardContent>
            {/* Arrow Button (fixed position inside card) */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                }}
            >
                <IconButton
                    onClick={handleNext}
                    sx={{
                        backgroundColor: "#515fd8ff",
                        color: '#ffffffff',
                        borderRadius: "50%",
                        width: 50,
                        height: 50,
                        "&:hover": {
                            backgroundColor: "rgba(28, 101, 170, 0.91)",
                        },
                    }}
                >
                    <EastOutlinedIcon sx={{ fontSize: 24 }} />
                </IconButton>
            </Box>
        </Card>
    );
};

export default SimpleCard;
