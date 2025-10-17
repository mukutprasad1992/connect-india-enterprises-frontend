"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";

interface Collaborator {
    logo: string;
    name: string;
}

interface CollaboratorsProps {
    collaborators: Collaborator[];
}

const Collaborators: React.FC<CollaboratorsProps> = ({ collaborators }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
        setIsDragging(true);
        setStartX(pageX - (containerRef.current?.offsetLeft || 0));
        setScrollLeft(containerRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return;
        const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
        const walk = pageX - startX;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const stopDrag = () => setIsDragging(false);

    // Auto-scroll every 3 seconds
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const interval = setInterval(() => {
            if (!isDragging) {
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                    container.scrollLeft = 0; // Reset to start
                } else {
                    container.scrollLeft += 100; // Step scroll
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isDragging]);

    return (
        <Box
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={stopDrag}
            sx={{
                display: "flex",
                gap: { xs: 1.5, sm: 2 },
                pl: { xs: 1.5, sm: 2 },
                overflowX: "auto",
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                py: 2,
            }}
        >
            {collaborators.map((c, i) => (
                <Box
                    key={i}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: { xs: 180, sm: 220, md: 250 },
                        maxWidth: { xs: 220, sm: 250, md: 280 },
                        p: 1.5,
                        flexShrink: 0,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 2,
                        transition: "transform 0.3s",
                        "&:hover": { transform: "scale(1.05)" },
                    }}
                >
                    <Avatar
                        src={c.logo}
                        alt={c.name}
                        sx={{ width: { xs: 40, sm: 45, md: 50 }, height: { xs: 40, sm: 45, md: 50 } }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            fontSize: { xs: 12, sm: 14, md: 15 },
                        }}
                    >
                        {c.name}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default Collaborators;
