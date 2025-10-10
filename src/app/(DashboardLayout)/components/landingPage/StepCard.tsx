import { Box, Typography } from "@mui/material";

interface StepCardProps {
    number: number;
    text: string;
}

export default function StepCard({ number, text }: StepCardProps) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
                mb: 2,
                maxWidth: 500,
                mx: "auto",
            }}
        >
            {/* Blue Circle with Number */}
            <Box
                sx={{
                    backgroundColor: "#0088cc",
                    color: "#fff",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    mr: 2,
                }}
            >
                {number}
            </Box>

            {/* Step Text */}
            <Typography variant="body1" sx={{ color: "#000", fontWeight: 500 }}>
                {text}
            </Typography>
        </Box>
    );
}
