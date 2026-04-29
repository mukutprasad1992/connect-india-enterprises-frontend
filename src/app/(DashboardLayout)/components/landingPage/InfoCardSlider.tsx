'use client'
import { FC, ReactNode } from "react";
import { CardContent, Typography, Box, Grid, IconButton } from "@mui/material";
import { useRef } from "react";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import InfoCardVertical from "./InfoCardVertical";
import { useState } from "react";

interface VerticalCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}
interface InfoCardSliderProps {
    cards: VerticalCardProps[];
}

const InfoCardSlider: FC<InfoCardSliderProps> = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const visibleCards = 2;
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? cards.length - visibleCards : prevIndex - 1
        );
    };
    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === cards.length - visibleCards ? 0 : prevIndex + 1
        );
    }
    return (
        <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
            <Box
                sx={{
                    display: "flex",
                    transition: "transform 0.5s ease",
                    transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
            >
                {cards.map((card, index) => (
                    <Box key={index} sx={{ flex: `0 0 ${100 / visibleCards}%`, p: 1 }}>
                        <InfoCardVertical icon={card.icon} title={card.title} description={card.description} />
                    </Box>
                ))}
            </Box>
            <IconButton
                onClick={handlePrev}
                sx={{ position: "absolute", top: "50%", left: 5, backgroundColor: "rgba(255,255,255,0.7)" }}
            >
                <ArrowBackIosNewRoundedIcon />
            </IconButton>
            <IconButton
                onClick={handleNext}
                sx={{ position: "absolute", top: "50%", right: -1, backgroundColor: "rgba(255,255,255,0.7)" }}
            >
                <ArrowForwardIosRoundedIcon />
            </IconButton>
        </Box>
    );


}

export default InfoCardSlider;


