"use client";

import { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Avatar, IconButton, Box
} from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

interface User {
    sender: string;
    email: string;
    mobile: string;
    message: string;
    time: string;
    read: boolean;
    image?: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onUserAdded: () => void;
}

const AddUserComponent = ({ open, onClose, onUserAdded }: Props) => {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const stored = localStorage.getItem("message_list");
        if (stored) setUsers(JSON.parse(stored));
    }, [open]);

    const resetForm = () => {
        setName("");
        setEmail("");
        setMobile("");
        setImage(undefined);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        if (!name || !email || !mobile) {
            alert("All fields are required.");
            return;
        }

        const duplicate = users.some(u => u.email === email || u.mobile === mobile);
        if (duplicate) {
            alert("User with this email or mobile already exists.");
            return;
        }

        const newUser: User = {
            sender: name,
            email,
            mobile,
            image,
            message: "New chat started",
            time: new Date().toISOString(),
            read: false,
        };

        const updated = [...users, newUser];
        localStorage.setItem("message_list", JSON.stringify(updated));
        setUsers(updated);

        onUserAdded();
        onClose();
        resetForm();
    };

    return (
        <Dialog open={open} onClose={() => { onClose(); resetForm(); }} fullWidth>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
                <TextField label="Name" fullWidth margin="dense" value={name} onChange={e => setName(e.target.value)} />
                <TextField label="Email" fullWidth margin="dense" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <TextField label="Mobile" fullWidth margin="dense" value={mobile} onChange={e => setMobile(e.target.value)} />
                <Box mt={2}>
                    <Button variant="outlined" startIcon={<UploadIcon />} component="label">
                        {image ? "Change Image" : "Upload Image"}
                        <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
                    </Button>
                    {image && (
                        <Box mt={2} display="flex" alignItems="center" gap={2}>
                            <Avatar src={image} sx={{ width: 56, height: 56 }} />
                            <IconButton onClick={() => setImage(undefined)} color="error">
                                <RemoveCircleIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { onClose(); resetForm(); }}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserComponent;
