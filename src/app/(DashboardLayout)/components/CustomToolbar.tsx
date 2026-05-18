import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Button, Tooltip } from "@mui/material";

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
                    color: '#465fff',
                },
                gap: 1
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GridToolbarColumnsButton
                />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <Tooltip title="Save layout">
                    <Button
                        size="small"
                        onClick={onSave}
                    >
                        Save Layout
                    </Button>
                </Tooltip>
            </Box>
            <Box sx={{ marginLeft: "auto" }}>
                <GridToolbarQuickFilter debounceMs={500} placeholder="Search..." />
            </Box>
        </GridToolbarContainer>
    );
}
export default CustomToolbar;