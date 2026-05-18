"use client";
import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Stack,
    Divider,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";

interface BlogCardProps {
    image: string;
    date: string;
    author: string;
    category: string;
    title: string;
    comments: number;
}

const BlogCard: React.FC<BlogCardProps> = ({
    image,
    date,
    author,
    category,
    title,
    comments,
}) => {
    return (
        <Card
            sx={{
                width: { xs: "100%", sm: 330, md: 360, lg: 390 },
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                mx: "auto",
                "&:hover": {
                    transform: { sm: "translateY(-5px)" },
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                },
            }}
        >
            {/* Image Section */}
            <Box sx={{ position: "relative", overflow: "hidden" }}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{
                        height: { xs: 180, sm: 200, md: 220 },
                        width: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        "&:hover": {
                            transform: "scale(1.1)",
                        },
                    }}
                />

                {/* Date Badge */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        px: 1.3,
                        py: 0.6,
                        borderRadius: 1,
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
                        fontWeight: 600,
                    }}
                >
                    {date}
                </Box>
            </Box>

            {/* Content */}
            <CardContent sx={{ p: { xs: 2, sm: 2.2, md: 2.5 } }}>
                {/* Author and Category */}
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        mb: 1,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PersonOutlineIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                        <Typography variant="body2">{author}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CreditCardOutlinedIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                        <Typography variant="body2">{category}</Typography>
                    </Box>
                </Stack>

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
                        color: "#0d1b2a",
                        mb: 2,
                    }}
                >
                    {title}
                </Typography>

                {/* Divider above Read More */}
                <Divider sx={{ mb: 1 }} />

                {/* Bottom Row: Read more + Comments */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ color: "text.secondary" }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <EastOutlinedIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 500,
                                color: "#1976d2",
                                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Read More
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                        <Typography
                            variant="body2"
                            sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                        >
                            {comments} Comments
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default BlogCard;
