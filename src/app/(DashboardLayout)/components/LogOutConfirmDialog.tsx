import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";

export default function LogOutConfirmDialog({
    open,
    handleCancelClose,
    handleConfirmClose,
}: {
    open: boolean;
    handleCancelClose: () => void;
    handleConfirmClose: () => void;
}) {
    return (
        <Dialog
            open={open}
            onClose={handleCancelClose}
            PaperProps={{
                sx: {
                    borderRadius: 1, // smoother rounding
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
                    minWidth: 320, // better responsive width
                },
            }}
        >
            {/* Title with icon */}
            <Box display="flex" alignItems="center" >
                <Typography
                    sx={{
                        pl: 1.5,
                        pt: .5,
                        fontWeight: "bold",
                        fontSize: ".80rem",
                    }}
                >
                    Confirm Logout
                </Typography>
            </Box>

            {/* Content */}
            <DialogContent sx={{ p: 0, mt: 1 }}>
                <Typography color="text.secondary"
                    sx={{
                        pl: 1.5,
                        pt: .5,
                        pr: 1.5,
                        fontSize: ".80rem",
                    }}>
                    Are you sure you want to logout?
                </Typography>
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ justifyContent: "flex-end", }}>
                <Button
                    onClick={handleCancelClose}
                    variant="outlined"
                    color="primary"
                    sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        fontSize: 11,
                        p: .5
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirmClose}
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        fontSize: 11,
                        p: .5
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog >
    );
}
