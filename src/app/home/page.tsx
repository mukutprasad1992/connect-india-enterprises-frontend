"use client";
import type { NextPage } from "next";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Fade,
    Grid,
    ListItemIcon,
    ListItem,
    List,
    ListItemText,
    Slider,
    Divider,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import Header from "../(DashboardLayout)/components/landingPage/Header";
import FeatureCard from "../(DashboardLayout)/components/landingPage/FeatureCard"
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StarIcon from "@mui/icons-material/Star";
import SecurityIcon from "@mui/icons-material/Security";
import { useState } from "react";
import InfoCard from "../(DashboardLayout)/components/landingPage/InfoCard";
import SimpleCard from "../(DashboardLayout)/components/landingPage/SimpleCard";
import PromoCard from "../(DashboardLayout)/components/landingPage/PromoCard";
import StepCard from "../(DashboardLayout)/components/landingPage/StepCard";
import TrustedCompanyCard from "../(DashboardLayout)/components/landingPage/TrustedCompanyCard";
import ChooseUsCard from "../(DashboardLayout)/components/landingPage/ChooseUsCard";
import CustomersTestimonials from "../(DashboardLayout)/components/landingPage/CustomersTestimonials";
import ProgressList from "../(DashboardLayout)/components/landingPage/ProgressList";
import StatsSection from "../(DashboardLayout)/components/landingPage/StatsSection";
import BlogCard from "../(DashboardLayout)/components/landingPage/BlogCard";
import CollaboratorCard from "../(DashboardLayout)/components/landingPage/CollaboratorCard";
import Collaborators from "../(DashboardLayout)/components/landingPage/CollaboratorCard";
import LoanApplySection from "../(DashboardLayout)/components/landingPage/LoanApplySection";
import Footer from "../(DashboardLayout)/components/landingPage/Footer";
import { useRouter } from 'next/navigation';
import AutoRotateCalculators from "../(DashboardLayout)/components/landingPage/AutoRotateCalculators";

const slides = [
    {
        image: "images/landingPage/IMG20250224152939.jpg",
        title: "Connect with Your Financial Growth",
        subtitle: "Simple & Secure Payment Process",
        buttonText: "Apply for Loan",
    },
    {
        image: "images/landingPage/DSC_7964.jpg",
        title: "Connect with Your Financial Growth",
        subtitle: "Simple & Secure Payment Process",
        buttonText: "Apply for Loan",
    },
];
const collaborators = [
    { logo: "/images/landingPage/testimonials-1-3.png", name: "John Doe" },
    { logo: "/images/landingPage/testimonials-1-1.png", name: "Jane Smith" },
    { logo: "/images/landingPage/testimonials-1-2.png", name: "Alice Johnson" },
    { logo: "/images/landingPage/testimonials-1-3.png", name: "John Doe" },
    { logo: "/images/landingPage/testimonials-1-1.png", name: "Jane Smith" },
    { logo: "/images/landingPage/testimonials-1-2.png", name: "Alice Johnson" },
    { logo: "/images/landingPage/testimonials-1-3.png", name: "John Doe" },
    { logo: "/images/landingPage/testimonials-1-1.png", name: "Jane Smith" },
    { logo: "/images/landingPage/testimonials-1-2.png", name: "Alice Johnson" },
    { logo: "/images/landingPage/testimonials-1-3.png", name: "John Doe" },
    { logo: "/images/landingPage/testimonials-1-1.png", name: "Jane Smith" },
    { logo: "/images/landingPage/testimonials-1-2.png", name: "Alice Johnson" },
];

const Home: NextPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter()
        ; const handleNext = () => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const slide = slides[currentSlide];

    const features = [
        {
            icon: <PaymentIcon sx={{ fontSize: 56, color: "#0d6efd" }} />,
            title: "Quick Payment",
            subtitle: "Process",
        },
        {
            icon: <ReceiptLongIcon sx={{ fontSize: 56, color: "#0d6efd" }} />,
            title: "No Prepayment",
            subtitle: "Fees",
        },
    ];

    const handleApplyLoan = () => {
        // Logic to navigate to the loan application page
        router.push("/authentication/login")
    }

    return (
        <Box >
            {/* HEADER */}
            <Header />
            <Box sx={{ position: "relative" }}>
                {/* HERO SECTION */}
                <Box
                    sx={{
                        position: "relative",
                        height: { xs: 520, md: 600 },
                        width: "100%",
                        overflow: "hidden",
                    }}
                >
                    {/* Background Image */}
                    <motion.div
                        key={slide.image}
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.15 }}
                        transition={{ duration: 5, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            zIndex: 1,
                        }}
                    >
                        {/* Next.js Image */}
                        <Image
                            src={slide.image}
                            alt="Slide Image"
                            fill
                            style={{ objectFit: "cover" }}
                            priority // ensures the image loads immediately
                        />

                        {/* Gradient Overlay */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background:
                                    "linear-gradient(to right, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 55%)",
                                zIndex: 2,
                            }}
                        />
                    </motion.div>

                    {/* Slide Content */}
                    <Fade in timeout={600}>
                        <Box
                            sx={{
                                position: "relative",
                                zIndex: 3,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                px: { xs: 3, sm: 6, md: 10 },
                                textAlign: "left",
                            }}
                        >
                            <Box sx={{ maxWidth: "600px", color: "#fff" }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ mb: 2, color: "#d3d3d3", fontSize: "1rem" }}
                                >
                                    {slide.subtitle}
                                </Typography>

                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 3,
                                        fontWeight: "bold",
                                        lineHeight: 1.2,
                                        fontSize: { xs: "2rem", md: "3rem" },
                                    }}
                                >
                                    {slide.title}
                                </Typography>

                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        px: 3,
                                        py: 1.2,
                                        borderRadius: "8px",
                                        "&:hover": { backgroundColor: "#1565c0" },
                                    }}
                                    onClick={handleApplyLoan}
                                >
                                    {slide.buttonText}
                                </Button>
                            </Box>
                        </Box>
                    </Fade>

                    {/* Arrows */}
                    <IconButton
                        onClick={handlePrev}
                        sx={{
                            position: "absolute",
                            top: "45%",
                            right: 20,
                            transform: "translateY(-50%)",
                            color: "#fff",
                            border: "2px solid #fff",
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                            zIndex: 4,
                        }}
                    >
                        <KeyboardBackspaceOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    <IconButton
                        onClick={handleNext}
                        sx={{
                            position: "absolute",
                            top: "55%",
                            right: 20,
                            transform: "translateY(-50%)",
                            color: "#fff",
                            border: "2px solid #fff",
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                            zIndex: 4,
                        }}
                    >
                        <EastOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    {/* Feature Cards - bottom left */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: { xs: -1, md: -1 },
                            left: { xs: 20, sm: 40, md: 120 },
                            zIndex: 10,
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            pointerEvents: "auto", // allow hover/click
                        }}
                    >
                        {features.map((feature) => (
                            <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                subtitle={feature.subtitle}
                            />
                        ))}
                    </Box>
                </Box>

                <Box>
                    <AutoRotateCalculators />
                </Box>
            </Box>
            <Grid
                container
                sx={{
                    px: { xs: 3, sm: 6, md: 10 },
                    backgroundColor: 'white'
                }}
            >
                <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                        mt: { xs: 8, sm: 4, md: 0 },
                        px: { xs: 2, md: 0 },
                    }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        mb={2}
                        sx={{
                            pb: { xs: 1, md: 2 },
                            pt: { xs: 1, md: 2 },
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                mr: { xs: 0, sm: 1 },
                                mb: { xs: 1, sm: 0 },
                                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                            }}
                        >
                            Company Introductions
                        </Typography>
                        <Box
                            sx={{
                                border: "2px solid blue",
                                width: { xs: 30, sm: 35, md: 40 },
                                height: 2,
                            }}
                        />
                    </Box>

                    {/* Main Heading */}
                    <Typography
                        sx={{
                            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                            lineHeight: 1.2,
                            pb: { xs: 1.5, sm: 3, md: 4.5 },
                        }}
                    >
                        Your Dreams, Our Support —
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                            lineHeight: 1.2,
                            pb: { xs: 1.5, sm: 3, md: 4.5 },
                        }}
                    >
                        Loans, Investments, Policies & Insurance That Empower You
                    </Typography>

                    {/* Paragraph */}
                    <Grid item xs={12} md={10}>
                        <Typography
                            sx={{
                                fontSize: { xs: 12, sm: 16, md: 19 },
                                fontFamily: '"Rajdhani", serif',
                                lineHeight: 1.6,
                            }}
                        >
                            Manage your finances with confidence — from quick loans to smart investments,
                            reliable insurance, and flexible policies, all in one trusted platform
                            designed to simplify your financial journey, help you make informed
                            decisions, and achieve your life goals effortlessly.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <InfoCard
                            icon={<StarIcon />}
                            title="Premium Quality"
                            description="We deliver only the best products with top-notch quality assurance."
                        />
                        <InfoCard
                            icon={<SecurityIcon />}
                            title="Secure & Safe"
                            description="Your data is protected with advanced security protocols."
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>

                </Grid>
            </Grid>
            <Box display="flex" alignItems="center" justifyContent={'center'} sx={{ pt: 10, backgroundColor: 'white', }}>
                <Typography
                    variant="h6"
                    sx={{ mr: 1 }}
                >
                    What Were Offering
                </Typography>
                <Box
                    sx={{
                        border: "2px solid blue",
                        width: 40,
                        height: 2,
                        mt: .5
                    }}
                />
            </Box>
            <Typography
                variant="h2"
                sx={{
                    display: 'flex',
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    pb: 2
                }}
            >
                All financial Services
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" sx={{ justifyContent: 'center', backgroundColor: 'white' }}>
                <SimpleCard
                    image="images/landingPage/main-slider2.jpg"
                    title="Personal Loan"
                    description="Take control of your finances with a personal loan designed for you.
                     Whether its managing expenses, funding education, or planning a vacation, enjoy 
                     quick approvals, affordable EMIs, and complete transparency every step of the way."
                    buttonImage="images/landingPage/loan-1.png"
                />
                <SimpleCard
                    image="images/landingPage/main-slider2.jpg"
                    title="Term Life Insurance"
                    description="Secure your loved ones financial future with our term life 
                     plans. Enjoy high coverage at low premiums, easy claim settlement, and complete 
                     peace of mind for you and your family."
                    buttonImage="images/landingPage/insurance-1.png"
                />
                <SimpleCard
                    image="images/landingPage/main-slider1.jpg"
                    title="SIP and Mutual Funds"
                    description="Invest smarter with our SIP and Mutual Fund options designed for 
                     goal. Enjoy flexible investments, professional fund management, and the power 
                      compounding to build long-term wealth with confidence."
                    buttonImage="images/landingPage/investment-1.png"
                />
            </Box>
            <Grid
                container
                spacing={1}
                sx={{
                    m: 3,
                    pt: 7,
                    pb: 7,
                    display: 'relative',
                    position: "relative",
                    overflow: "hidden",
                    // backgroundColor: "#f9f9ff",
                    "&::before, &::after": {
                        content: '""',
                        position: "absolute",
                        width: "100px",
                        height: "100px",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        opacity: 0.6,
                        animation: "float 6s ease-in-out infinite",
                    },
                    "&::before": {
                        backgroundImage: 'url(/images/landingPage/why-choose-shape-1-2.png)',
                        top: "10%",
                        left: "15%",
                        animationDelay: "0s",
                    },

                    "&::after": {
                        backgroundImage: 'url(/images/landingPage/feature-shape-1-2.png)',
                        bottom: "10%",
                        right: "15%",
                        animationDelay: "3s",
                    },
                    "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-20px)" },
                    },
                }}
            >
                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" mb={2} sx={{ pt: 2, pl: 5 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 1 }}>
                            Get to Know About
                        </Typography>
                        <Box sx={{ border: "2px solid blue", width: 40, height: 2 }} />
                    </Box>
                    <Typography variant="h2" sx={{ display: "flex", pl: 5 }}>
                        Flexible and Quick Business Loans For You
                    </Typography>
                </Grid>

                <Grid item xs={5}>
                    Turpis cursus in hac habitasse platea dictumst quisque. Aenean euismod
                    elementum nisi quis eleifend quam adipiscing vitae proin. There of
                    available but the majority have suffered alteration in some form, by
                    injected humour or randomised words which don’t look even slightly
                    believable. Nam aliquam sem et tortor consequat at urna mattis
                    pellentesque...
                </Grid>
            </Grid>
            <Box sx={{ position: "relative" }}>
                <Grid
                    item
                    xs={12}
                    sx={{
                        m: 3,
                        pt: 7,
                        pb: 7,
                        position: "relative",
                        overflow: "hidden",
                        "&::before, &::after": {
                            content: '""',
                            position: "absolute",
                            width: "100px",
                            height: "100px",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            opacity: 0.6,
                            animation: "float 6s ease-in-out infinite",
                        },
                        "&::before": {
                            backgroundImage: 'url(/images/landingPage/why-choose-shape-1-2.png)',
                            top: "10%",
                            left: "0%",
                            animationDelay: "0s",
                        },
                        "&::after": {
                            backgroundImage: 'url(/images/landingPage/feature-shape-1-2.png)',
                            bottom: "10%",
                            right: "0%",
                            animationDelay: "3s",
                        },
                        "@keyframes float": {
                            "0%, 100%": { transform: "translateY(0px)" },
                            "50%": { transform: "translateY(-20px)" },
                        },
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
                        <PromoCard
                            icon={<StarIcon />}
                            description="We deliver only the best products with top-notch quality assurance."
                        />
                        <PromoCard
                            icon={<SecurityIcon />}
                            description="Your data is protected with advanced security protocols."
                        />
                        <PromoCard
                            icon={<SecurityIcon />}
                            description="Your data is protected with advanced security protocols."
                        />
                    </Box>
                </Grid>
                <Box
                    sx={{
                        position: "absolute",
                        top: "60%",
                        left: "75%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                    }}
                >
                    <TrustedCompanyCard />
                </Box>
                <Grid
                    container
                    spacing={0}
                    sx={{
                        overflow: "hidden",
                        position: "relative",
                        backgroundColor: "#0d0d30ff",
                        color: "#fff",
                        backgroundImage: "url('/images/landingPage/pattern-bg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        px: { xs: 3, md: 8 },
                        alignItems: "center",
                        pt: 10,
                        mt: 13,
                        pb: 10,
                    }}
                >
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: "#1E90FF",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                fontWeight: 600,
                                mb: 1,
                            }}
                        >
                            Trusted Company
                        </Typography>

                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: "bold",
                                mb: 2,
                                lineHeight: 1.4,
                            }}
                        >
                            Most of the People Trust on Us For Fast Services
                        </Typography>
                        <Grid container sx={{
                            mt: 5
                        }}>
                            <Grid item xs={4} >
                                <Box
                                    component="img"
                                    src="/images/landingPage/trust-1-1.png"
                                    alt="Trusted Company"
                                    sx={{
                                        width: 180,
                                        borderRadius: 2,
                                        mb: 2,
                                        boxShadow: 3,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1" sx={{ opacity: 0.8, mb: 3, maxWidth: 360 }}>
                                    There are many variations of passages of lorem ipsum available,
                                    the majority have suffered alteration in some form by injected humour.
                                    Duis aute irure dolor in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </Typography>
                            </Grid>
                            {/* Image */}

                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={4.5}>
                                <List dense>
                                    {["Credit Card Per Day", "Personal Loan", "Car / Auto Loan", "Home Loan"].map((item, i) => (
                                        <ListItem key={i} sx={{ p: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        border: "2px solid #1E90FF",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <CheckIcon sx={{ fontSize: 16, color: "#1E90FF" }} />
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={6}>
                                <List dense>
                                    {[
                                        "Gold Loan Per Day",
                                        "Mortgage Loan",
                                        "Education / Student Loan",
                                        "Wedding Loan",
                                    ].map((item, i) => (
                                        <ListItem key={i} sx={{ p: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        border: "2px solid #1E90FF",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <CheckIcon sx={{ fontSize: 16, color: "#1E90FF" }} />
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ position: "relative" }}>
                <Grid
                    item
                    xs={12}
                >
                    <CustomersTestimonials />
                </Grid>
                <Box
                    sx={{
                        position: "absolute",
                        top: "70.2%",
                        right: "25%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                    }}
                >
                    <ChooseUsCard />
                </Box>
                <Grid
                    container
                    spacing={0}
                    sx={{
                        overflow: "hidden",
                        position: "relative",
                        color: "#000000ff",
                        backgroundColor: "#ffffffff",
                        px: { xs: 3, md: 8 },
                        alignItems: "center",
                        pt: 10,
                        mt: 12,
                        pb: 8,
                        "&::before, &::after": {
                            content: '""',
                            position: "absolute",
                            width: "100px",
                            height: "100px",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            opacity: 0.6,
                            animation: "float 6s ease-in-out infinite",
                        },
                        "&::before": {
                            backgroundImage: 'url(/images/landingPage/why-choose-shape-1-2.png)',
                            top: "10%",
                            left: "70%",
                            animationDelay: "0s",
                        },
                        "&::after": {
                            backgroundImage: 'url(/images/landingPage/feature-shape-1-2.png)',
                            bottom: "10%",
                            right: "10%",
                            animationDelay: "3s",
                        },
                        "@keyframes float": {
                            "0%, 100%": { transform: "translateY(0px)" },
                            "50%": { transform: "translateY(-20px)" },
                        },
                    }}
                >
                    <Grid item xs={12} md={6}></Grid>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" justifyContent={'start'} sx={{ pl: 3 }} >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: "#000000ff",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    fontWeight: 600,
                                    mb: .5,
                                }}
                            >
                                Our Benfits
                            </Typography>
                            <Box
                                sx={{
                                    border: "2px solid blue",
                                    width: 40,
                                    height: 2,
                                    mb: 1,
                                    ml: 1
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: "bold",
                                mb: 2,
                                lineHeight: 1.4,
                                pl: 3
                            }}
                        >
                            Why Choose Us?
                        </Typography>
                        <Grid container sx={{
                            mt: 4
                        }}>
                            <Grid item xs={12}>
                                <Typography variant="body1" sx={{ mb: 3, ml: 3 }}>
                                    There are many variations of passages of lorem ipsum available,
                                    the majority have suffered alteration in some form by injected humour.
                                    Duis aute irure dolor in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </Typography>
                            </Grid>
                            {/* Image */}

                        </Grid>
                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        ml: 2
                                    }}
                                >
                                    <PlayArrowIcon sx={{ color: "blue" }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: 20, lineHeight: 1 }}>
                                        Professional Team
                                    </Typography>
                                </Box>
                                <Typography sx={{ pl: 3, pt: 3 }}>
                                    Lorem ipsum dolor sit is amet, consectetur notted.
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                    }}
                                >
                                    <PlayArrowIcon sx={{ color: "blue" }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: 20, lineHeight: 1 }}>
                                        Quick Payments
                                    </Typography>
                                </Box>
                                <Typography sx={{ pt: 3, ml: 1 }}>
                                    Lorem ipsum dolor sit is amet, consectetur notted.
                                </Typography>
                            </Grid>
                            <ProgressList />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <StatsSection />
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
                        Directly From the Blog
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
                    News & Articles
                </Typography>
                <Grid
                    container
                    spacing={3}
                    sx={{
                        pb: 10,
                        justifyContent: { xs: "center", sm: "flex-start" }, // center on mobile
                    }}
                >
                    <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                        <BlogCard
                            image="/images/landingPage/blog-1-1.png"
                            date="20 Sep, 2023"
                            author="Admin"
                            category="Credit Card"
                            title="For Car auto you will get 90% loan amount"
                            comments={0}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                        <BlogCard
                            image="/images/landingPage/blog-1-2.png"
                            date="20 Sep, 2023"
                            author="Admin"
                            category="Credit Card"
                            title="For Car auto you will get 90% loan amount"
                            comments={0}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                        <BlogCard
                            image="/images/landingPage/blog-1-3.png"
                            date="20 Sep, 2023"
                            author="Admin"
                            category="Credit Card"
                            title="For Car auto you will get 90% loan amount"
                            comments={0}
                        />
                    </Grid>
                </Grid>

            </Box>
            <Grid container >
                <Grid item xs={12} >
                    <Divider />
                </Grid>

            </Grid>
            <Box sx={{ p: 4, pl: 10, pr: 10, backgroundColor: "#eef2f7", }}>
                <Typography variant="h5" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', mb: 2 }}>
                    Our Collaborators
                </Typography>
                <Collaborators collaborators={collaborators} />
            </Box>
            <Box>
                <LoanApplySection />
            </Box>
            <Footer />
        </Box >
    );
};

export default Home;
