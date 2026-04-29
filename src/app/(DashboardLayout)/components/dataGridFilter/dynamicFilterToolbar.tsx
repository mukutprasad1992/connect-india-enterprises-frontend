// components/DynamicFilterToolbar.tsx
import * as React from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';

interface DynamicFilterToolbarProps {
    columns: any[];
    setFilterModel: (model: any) => void;
    filterModel: any;
}

const DynamicFilterToolbar: React.FC<DynamicFilterToolbarProps> = ({
    columns,
    setFilterModel,
    filterModel
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedColumn, setSelectedColumn] = React.useState<string>('');
    const [filterValue, setFilterValue] = React.useState<string>('');

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleColumnSelect = (field: string) => {
        setSelectedColumn(field);
        handleMenuClose();
    };

    const applyFilter = () => {
        if (!selectedColumn || !filterValue) return;

        const newFilter = {
            items: [
                {
                    field: selectedColumn,
                    operator: 'contains',
                    value: filterValue,
                },
            ],
        };

        setFilterModel(newFilter);
    };

    const clearFilters = () => {
        setFilterModel({ items: [] });
        setSelectedColumn('');
        setFilterValue('');
    };

    return (
        <GridToolbarContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<FilterListIcon />}
                    onClick={handleMenuClick}
                    variant="outlined"
                >
                    Filter
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {columns.map((column) => (
                        <MenuItem
                            key={column.field}
                            onClick={() => handleColumnSelect(column.field)}
                        >
                            {column.headerName || column.field}
                        </MenuItem>
                    ))}
                </Menu>

                {selectedColumn && (
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder={`Filter by ${selectedColumn}...`}
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        sx={{ width: 250 }}
                    />
                )}

                <Button
                    variant="contained"
                    onClick={applyFilter}
                    disabled={!selectedColumn || !filterValue}
                >
                    Apply
                </Button>

                <Button
                    variant="outlined"
                    onClick={clearFilters}
                    disabled={!filterModel?.items?.length}
                >
                    Clear
                </Button>
            </Box>
        </GridToolbarContainer>
    );
};

export default DynamicFilterToolbar;