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

    // Drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
        setScrollLeft(containerRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = x - startX;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    // Auto-scroll every 1 second
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const interval = setInterval(() => {
            if (!isDragging) {
                // Scroll by 100px every 1 second
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                    container.scrollLeft = 0; // Reset to start if reached end
                } else {
                    container.scrollLeft += 100; // Step scroll
                }
            }
        }, 3000); // 1 second interval

        return () => clearInterval(interval);
    }, [isDragging]);

    return (
        <Box
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            sx={{
                display: "flex",
                gap: 2,
                pl: 2,
                overflowX: "auto",
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
            }}
        >
            {collaborators.map((c, i) => (
                <Box
                    key={i}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 250,
                        p: 1.5,
                        flexShrink: 0,
                    }}
                >
                    <Avatar src={c.logo} alt={c.name} sx={{ width: 50, height: 50 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                        {c.name}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default Collaborators;
