import { Box, Typography } from "@mui/material";
import { useState } from "react";

interface StepCardProps {
    number: number;
    text: string;
}

export default function StepCard({ number, text }: StepCardProps) {
    const [hover, setHover] = useState(false);

    return (
        <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: hover ? "#0088cc" : "#fff",
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
                mb: 2,
                maxWidth: 500,
                mx: "auto",
                transition: "all 0.3s ease",
                cursor: "pointer",
            }}
        >
            {/* Number Circle */}
            <Box
                sx={{
                    backgroundColor: hover ? "#fff" : "#0088cc",
                    color: hover ? "#0088cc" : "#fff",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    mr: 2,
                    transition: "all 0.3s ease",
                }}
            >
                {number}
            </Box>

            {/* Step Text */}
            <Typography
                variant="body1"
                sx={{
                    color: hover ? "#fff" : "#000",
                    fontWeight: 500,
                    transition: "color 0.3s ease",
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}
