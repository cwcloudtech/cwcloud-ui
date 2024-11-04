import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import ClearIcon from '@mui/icons-material/Clear';

const Attachments = ({ ticket, is_admin, downloadFile, preDeleteFile }) => {
    return (
        <Box display="flex" flexWrap="wrap" gap={1}>
            {ticket.attachments.map((attachment, index) => (
                <Button
                    key={index}
                    variant="outlined"
                    onClick={() => downloadFile(attachment)}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textTransform: 'none',
                        borderRadius: '16px',
                        padding: '4px 12px',
                        minWidth: 'auto',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                    }}
                    endIcon={
                        <Box display="flex" alignItems="center">
                            <IconButton 
                                size="small" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    downloadFile(attachment);
                                }}
                                sx={{ 
                                    padding: 0,
                                    marginRight: 1
                                }}
                            >
                                <GetAppIcon />
                            </IconButton>
                            {(is_admin || attachment.has_rights) && (
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        preDeleteFile(attachment);
                                    }}
                                    sx={{ 
                                        padding: 0
                                    }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </Box>
                    }
                >
                    {attachment.name}
                </Button>
            ))}
        </Box>
    );
};

export default Attachments;