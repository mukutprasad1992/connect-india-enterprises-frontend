import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

function CustomToolbar({ onSave }: { onSave: () => void }) {
    return (
        <GridToolbarContainer
            sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                padding: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
                '& .MuiButton-text': {
                    color: '#44a7a2',
                },
                gap: 1
            }}
        >
            {/* Left side buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GridToolbarColumnsButton
                />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <Button
                    size="small"
                    onClick={onSave}
                >
                    Save Layout
                </Button>
            </Box>

            {/* Right side search */}
            <Box sx={{ marginLeft: "auto" }}>
                <GridToolbarQuickFilter debounceMs={500} placeholder="Search..." />
            </Box>
        </GridToolbarContainer>
    );
}
export default CustomToolbar;