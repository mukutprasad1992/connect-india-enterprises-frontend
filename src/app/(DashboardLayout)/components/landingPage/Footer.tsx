"use client";
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    Avatar,
} from "@mui/material";
import {
    Email,
    AccessTime,
    LocationOn,
    Facebook,
    Twitter,
    LinkedIn,
    Instagram,
    Call,
} from "@mui/icons-material";
import WhiteLogo from "../layout/WhiteLogo";

const Footer = () => {
    const socialLinks = [
        { icon: Facebook, url: "https://www.facebook.com/profile.php?id=61572651477067" },
        { icon: Twitter, url: "https://x.com/ConnectIndia95" },
        { icon: LinkedIn, url: "https://www.linkedin.com/in/connect-india-enterprises-844741349/" },
        { icon: Instagram, url: "https://www.instagram.com/connectindiaenterprises95/" },
    ];

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#0b2447",
                color: "#fff",
                pt: { xs: 6, md: 15 },
                pb: { xs: 4, md: 6 },
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 3, md: 5 }}>
                    {/* ===== Left Section ===== */}
                    <Grid item xs={12} md={3} mt={-10}>
                        <Box mb={2} >
                            <WhiteLogo />
                        </Box>
                        <Typography variant="body2" color="grey.300" mb={2} sx={{ fontSize: { xs: 13, md: 14 } }}>
                            Simplify your financial journey with Connect India Enterprises. From Insurance and Loans to Investments and Policies — we make it easy, transparent, and stress-free. Let our experts guide you toward a smarter, more secure financial future.
                        </Typography>

                        <Box display="flex" alignItems="center" mt={2}>
                            <Call sx={{ mr: 1, color: "#4dd0e1" }} />
                            <Box>
                                <Typography variant="caption" color="grey.400">
                                    CALL ANYTIME
                                </Typography>
                                <Typography fontWeight="bold" sx={{ fontSize: { xs: 14, md: 16 } }}>
                                    +91 -7898191919
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* ===== Explore Section ===== */}
                    <Grid item xs={12} sm={6} md={3} >
                        <Typography variant="h6" fontWeight="bold" mb={2} ml={5} sx={{ fontSize: { xs: 16, md: 18 } }}>
                            Explore
                        </Typography>
                        {["About", "Our Services", "Latest News", "Testimonials", "Contact", "Loan Calculator"].map((item) => (
                            <Typography
                                key={item}
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    fontSize: { xs: 13, md: 14 },
                                    "&:hover": { color: "#4dd0e1", cursor: "pointer" },
                                    ml: 5,
                                }}
                            >
                                → {item}
                            </Typography>
                        ))}
                    </Grid>

                    {/* ===== Latest News Section ===== */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight="bold" mb={2} sx={{ fontSize: { xs: 16, md: 18 } }}>
                            Latest News
                        </Typography>

                        {[
                            {
                                date: "October 16, 2023",
                                title: "We’re Providing the Quality Services",
                                img: "/images/landingPage/footer-post-1-2.png",
                            },
                            {
                                date: "October 16, 2023",
                                title: "We’re Providing the Quality Services",
                                img: "/images/landingPage/footer-post-1-2.png",
                            },
                        ].map((news, i) => (
                            <Box
                                key={i}
                                display="flex"
                                alignItems="center"
                                mb={2}
                                sx={{ cursor: "pointer" }}
                                mr={2}
                            >
                                <Avatar
                                    src={news.img}
                                    alt="news"
                                    variant="rounded"
                                    sx={{
                                        width: { xs: 48, md: 56 },
                                        height: { xs: 48, md: 56 },
                                        mr: 2,
                                        border: "2px solid rgba(255,255,255,0.1)",
                                    }}
                                />
                                <Box>
                                    <Typography variant="caption" color="#4dd0e1" sx={{ fontSize: { xs: 11, md: 12 } }}>
                                        {news.date}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#fff",
                                            fontWeight: 500,
                                            lineHeight: 1.4,
                                            fontSize: { xs: 13, md: 14 },
                                            "&:hover": { color: "#4dd0e1" },
                                        }}
                                    >
                                        {news.title}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Grid>

                    {/* ===== Contact Section ===== */}
                    <Grid item xs={12} md={3} sx={{ backgroundColor: { xs: "transparent" }, p: { xs: 0, md: 1.5 }, borderRadius: 1 }}>
                        <Typography variant="h6" fontWeight="bold" mb={2} sx={{ fontSize: { xs: 16, md: 18 } }}>
                            Contact
                        </Typography>

                        <Box display="flex" alignItems="center" mb={1}>
                            <Email sx={{ mr: 1, color: "#4dd0e1" }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 14 }, lineHeight: 1.5 }}>
                                manoj@connectindiaenterprises.com support@connectindiaenterprises.com
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={1}>
                            <AccessTime sx={{ mr: 1, color: "#4dd0e1" }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 14 } }}>
                                Mon - Sat 10:00 AM - 7:00 PM
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <LocationOn sx={{ mr: 1, color: "#4dd0e1" }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 14 } }}>
                                21, Zone, 2, GRP Colony, Zone-II, Maharana Pratap Nagar, Bhopal, Madhya Pradesh 462011
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* ===== Footer Bottom ===== */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={6}
                    pt={3}
                    borderTop="1px solid rgba(255,255,255,0.1)"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                >
                    <Typography variant="body2" color="grey.400" sx={{ fontSize: { xs: 12, md: 14 } }}>
                        © Copyright 2025 by connectindiaenterprises.com
                    </Typography>

                    <Box sx={{ display: "flex", gap: { xs: 1, md: '1px' } }}>
                        {socialLinks.map(({ icon: Icon, url }, i) => (
                            <IconButton
                                key={i}
                                component="a"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: "#fff",
                                    "&:hover": { color: "#4dd0e1" },
                                    transition: "color 0.3s ease",
                                    p: { xs: 0.5, md: 1 },
                                }}
                            >
                                <Icon sx={{ fontSize: { xs: 16, md: '20px' } }} />
                            </IconButton>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
