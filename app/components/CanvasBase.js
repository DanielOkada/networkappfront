"use client";
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';




export default function CanvasBase({ children }) {
        return (
                <Box
                        sx={{
                                flex: "auto",
                                '& > :not(style)': {
                                        m: 0,
                                        minWidth: 256,
                                        minHeight: 500,
                                        position: "relative"
                                },
                        }}
                >
                        <Paper>
                                {children}
                        </Paper>
                </Box>
        );
}
