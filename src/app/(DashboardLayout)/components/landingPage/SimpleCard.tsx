"use client";
import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";

interface SimpleCardProps {
    image: string;
    title: string;
    description: string;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ image, title, description }) => {
    const handleNext = () => {
        console.log("Next clicked");
    };

    return (
        <Card
            sx={{
                width: 385,
                height: 500,
                boxShadow: 1,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                ":hover": { boxShadow: 6 },
                transition: "box-shadow 0.3s ease",
            }}
        >
            {/* Image */}
            <CardMedia
                component="img"
                height="250"
                image={image}
                alt={title}
                sx={{
                    objectFit: "cover",
                }}
            />

            {/* Title & Description */}
            <CardContent>
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
                    sx={{ mb: 5 }} // add some bottom space for the button
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
