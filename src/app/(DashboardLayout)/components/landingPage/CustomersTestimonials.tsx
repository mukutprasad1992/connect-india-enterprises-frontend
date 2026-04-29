"use client";
import React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
    {
        name: "Clyde Williamson",
        role: "Analytics",
        text: "I was very impressed by the company service lore ipsum is simply free text used by copy typing refreshing. Neque porro est dolorem ipsum quia.",
        image: "/images/landingPage/testimonials-1-1.png",
    },
    {
        name: "Gary Dawson",
        role: "Analytics",
        text: "I was very impressed by the company service lore ipsum is simply free text used by copy typing refreshing. Neque porro est dolorem ipsum quia.",
        image: "/images/landingPage/testimonials-1-2.png",
    },

    {
        name: "Vernon Ray",
        role: "Analytics",
        text: "I was very impressed by the company service lore ipsum is simply free text used by copy typing refreshing. Neque porro est dolorem ipsum quia.",
        image: "/images/landingPage/testimonials-1-3.png",
    },
    {
        name: "Clyde Williamson",
        role: "Analytics",
        text: "I was very impressed by the company service lore ipsum is simply free text used by copy typing refreshing. Neque porro est dolorem ipsum quia.",
        image: "/images/landingPage/testimonials-1-1.png",
    },
    {
        name: "Gary Dawson",
        role: "Analytics",
        text: "I was very impressed by the company service lore ipsum is simply free text used by copy typing refreshing. Neque porro est dolorem ipsum quia.",
        image: "/images/landingPage/testimonials-1-2.png",
    },
];

const TestimonialCard = ({ name, role, text, image }: any) => (
    <Paper
        elevation={0}
        sx={{
            position: "relative",
            p: 4,
            pb: 8,
            borderLeft: "3px solid #0057d9",
            height: "150%",
            textAlign: "left",
            borderRadius: 0,
            backgroundColor: "#f9f9f9",
            mx: 1,
            mb: 8
        }}
    >
        <Typography
            variant="body1"
            sx={{ fontStyle: "italic", color: "#555", mb: 2, lineHeight: 1.7 }}
        >
            {text}
        </Typography>
        <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#0047ba", mb: 0.3 }}
        >
            {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
            {role}
        </Typography>
        <Box
            component="img"
            src="/images/landingPage/quote-50.png"
            alt="Quote Icon"
            sx={{
                position: "absolute",
                right: 20,
                bottom: 40,
                width: 30,
                height: 30,
                opacity: 0.5, // 50% transparent
            }}
        />
        {/* Circular Avatar */}
        <Avatar
            src={image}
            alt={name}
            sx={{
                width: 70,
                height: 70,
                position: "absolute",
                bottom: -35,
                left: "20%",
                transform: "translateX(-50%)",
                border: "4px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
        />
    </Paper>
);

const CustomersTestimonials = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false,
        autoplay: false,
        swipeToSlide: true,
        draggable: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Box
            sx={{
                px: { xs: 2, md: 10 },
                backgroundColor: "#eef2f7",
            }}
        >
            <Box display="flex" alignItems="center" justifyContent={'center'} sx={{ pt: 10 }}>
                <Typography
                    variant="h6"
                    sx={{ mr: 1 }}
                >
                    Customers Testimonials
                </Typography>
                <Box
                    sx={{
                        border: "2px solid blue",
                        width: 40,
                        height: 2,
                    }}
                />
            </Box>
            <Typography
                variant="h2"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 10,
                }}
            >
                Customers Testimonials
            </Typography>
            <Slider {...settings}>
                {testimonials.map((item, index) => (
                    <Box key={index} px={1}>
                        <TestimonialCard {...item} />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default CustomersTestimonials;
