"use client";

import { useRef } from "react";
import { Button, Divider, Grid, Typography, Card, CardContent, Box, List, ListItem, ListItemText, Link } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Image from 'next/image'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import Face4RoundedIcon from '@mui/icons-material/Face4Rounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import PermPhoneMsgRoundedIcon from '@mui/icons-material/PermPhoneMsgRounded';

import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PinDropIcon from "@mui/icons-material/PinDrop";




export default function VoucherPdfView({ viewSelectedVocher }: any) {
  const pdfRef = useRef<HTMLDivElement>(null);
  console.log('voucherpdf veiw', viewSelectedVocher);

  const generatePdf = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${viewSelectedVocher?.voucherCode}_${viewSelectedVocher?.vendorCode}.pdf`);
  };
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Ticket Layout */}
      <div
        ref={pdfRef}
        style={{
          width: "850px",
          margin: "auto",
          padding: "40px",
          border: "1px solid #ddd",
          fontFamily: "Arial, sans-serif",
          background: "#fff",
        }}
      >
        {/* Header */}
        <div style={{}}>
          <Grid container spacing={2} alignItems="center">
            {/* Logo Section */}
            <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
              <Image src="/images/logos/logo-png.png" alt="Profile" style={{ maxWidth: "200px", height: "auto" }} />
            </Grid>

            {/* Trip Details Section */}
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <h3 style={{ fontFamily: "Arial", fontSize: 13, margin: 0 }}>Voucher Ticket</h3>
              <h4 style={{ fontFamily: "Arial", fontSize: 11, margin: "8px 0" }}>{viewSelectedVocher?.vendorBusinessName}</h4>
            </Grid>
          </Grid>
          <Grid sx={{ width: "95%", m: 1, p: 1.2, color: "#a52a2a" }}>
            <Divider sx={{ bgcolor: "lightgray", height: 1 }} />
            <Typography sx={{ fontSize: 8, mb: 2, mt: .5, fontFamily: "Arial ", }}>Voucher Number: {viewSelectedVocher?.voucherCode} | Vendor Code: {viewSelectedVocher?.vendorCode} | Date: {new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}
            </Typography>
          </Grid>
        </div>

        {/* Passenger Info */}
        <div style={{ padding: "15px", textAlign: "left", borderRadius: "10px" }}>
          <Grid container spacing={2} style={{ fontFamily: "Arial", fontSize: 11 }}>
            <Grid item xs={3}>
              <Typography sx={{ mb: 2, fontFamily: "Arial", fontSize: 11, color: '#47475d' }}>
                Hey <strong>{viewSelectedVocher?.customerName}</strong>,
              </Typography>
            </Grid>

          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontFamily: "Arial", fontSize: 11, mb: 2, color: "#47475d" }}>
              Thank you for choosing <strong>Connect India Enterprises!</strong> Here is your voucher ticket details:
              <br />
              <br />
              <strong>Amount: </strong> <span style={{ color: "green", fontWeight: "bold" }}>₹{viewSelectedVocher?.amount
              }/-</span>
              <br />
              <br />
              <strong>Validity From: </strong> {viewSelectedVocher?.validityFrom}
              <br />
              <strong>Validity To: </strong> {viewSelectedVocher?.validityTo}
              <br />
              <br />
              This voucher can be used for only <strong>{viewSelectedVocher?.vendorBusinessName}</strong> within the validity period.
            </Typography>
          </Grid>
          <Grid sx={{ maxWidth: 600, mx: "auto", my: 4, border: .1, borderRadius: "10px", }}>
            {/* Title */}
            <Box sx={{
              bgcolor: "brown", p: .5, borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}>
              <Typography sx={{ fontWeight: "bold", fontSize: 11, ml: 2, fontFamily: "Arial", color: "white", borderRadius: "10px", }}>
                Vendor Details
              </Typography>
            </Box>
            <CardContent sx={{ ml: 1, borderRadius: "10px", }}>
              {/* Departure & Arrival */}
              <Grid container spacing={2}>
                {/* Name */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d", borderRadius: "10px", }}>
                    Name:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.vendorBusinessName}</span>
                  </Typography>
                </Grid>

                {/* Address */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Address:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.vendorAddress}</span>
                  </Typography>
                </Grid>

                {/* Phone */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Phone:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.vendorMobileNo}</span>
                  </Typography>
                </Grid>

                {/* Email */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Email:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.vendorEmail}</span>
                  </Typography>
                </Grid>

                {/* Pin Code */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Pin Code:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PinDropIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.vendorPincode}</span>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <Divider></Divider>
            <Box sx={{ bgcolor: "brown", p: .5 }}>
              <Typography sx={{ fontWeight: "bold", fontSize: 11, ml: 2, fontFamily: "Arial", color: "white" }}>
                Customer Details
              </Typography>
            </Box>
            <CardContent sx={{ ml: 1, borderRadius: "10px", }}>
              {/* Departure & Arrival */}
              <Grid container spacing={2} >
                {/* Name */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Name:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.customerName}</span>
                  </Typography>
                </Grid>

                {/* Address */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Address:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.customerAddress}</span>
                  </Typography>
                </Grid>

                {/* Phone */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Phone:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.customerPhone}</span>
                  </Typography>
                </Grid>

                {/* Email */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Email:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.customerEmail}</span>
                  </Typography>
                </Grid>

                {/* Pin Code */}
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "Arial", fontSize: 9, ml: 0.2, color: "#747f8d" }}>
                    Pin Code:
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <PinDropIcon sx={{ fontSize: 15, color: "brown" }} />
                    <span style={{ fontFamily: "Arial", fontSize: 11, color: "#47475d" }}>{viewSelectedVocher?.customerPincode}</span>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Box sx={{ padding: "15px", textAlign: "left", borderRadius: "10px", border: 1, borderColor: "gray.300" }}>
            <Typography variant="body1" sx={{ fontFamily: "Arial", fontSize: 13, color: "#47475d", mb: 2 }}>
              Need help? <strong style={{ color: "brown" }}>Connect India Enterprises</strong> is here for you!
            </Typography>
            <Grid sx={{
              maxWidth: 600, mx: "auto", my: 2, border: 0.1, borderColor: "#C4A484", borderRadius: "10px",
            }}>
              <Box sx={{
                bgcolor: "brown", p: 1, borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}>
                <Typography sx={{ fontWeight: "bold", fontSize: 11, ml: 2, fontFamily: "Arial", color: "white" }}>
                  Support Features
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4} sx={{
                    display: "flex", alignItems: "center"
                  }}>
                    <SupportAgentRoundedIcon sx={{ color: "brown" }} />
                    <Typography sx={{ fontFamily: "Arial", fontSize: 11, color: "#47475d", ml: 1 }}>
                      24x7 Support
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
                    <TimerOutlinedIcon sx={{ fontSize: 19, color: "brown" }} />
                    <Typography sx={{ fontFamily: "Arial", fontSize: 11, color: "#47475d", ml: 1 }}>
                      Quick Resolution
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
                    <PermPhoneMsgRoundedIcon sx={{ color: "brown" }} />
                    <Typography sx={{ fontFamily: "Arial", fontSize: 11, color: "#47475d", ml: 1 }}>
                      Multilingual
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid  >
            <Typography sx={{ textAlign: "left", mt: 2, fontSize: 8, fontFamily: "Arial ", }}>
              Visit us at{" "}
              <Link
                href="https://connectindiaenterprises.com"
                target="_blank"
                rel="noopener"
                sx={{ fontWeight: "bold", }}
              >
                http://connectindiaenterprises.com
              </Link>
            </Typography>
          </Box>
        </div>
        <Typography sx={{ textAlign: "left", fontSize: 10, fontFamily: "Arial", fontWeight: "bold", mt: 4, mb: 3, ml: 3 }}>
          Signature of Authority
        </Typography>
      </div>

      <Button variant="contained" color="primary" onClick={generatePdf} style={{ marginTop: "20px" }}>
        Download PDF
      </Button>
    </div >
  )
}
