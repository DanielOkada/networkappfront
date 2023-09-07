"use client";
import { Box } from '@mui/material';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CanvasBase from './CanvasBase';




export default function CanvasManager({ children }) {
        // const [row, setRow] = useState(1)
        function onAddButtonClick() {
                setCanvases(prevCanvases => prevCanvases.concat(<MyCanvas key={prevCanvases.length} />));
        }

        function AddCanvasButton() {
                return (
                        <Fab color='primary' size='small' style={{ position: "absolute", right: 10, top: 5 }} onClick={onAddButtonClick}>
                                <AddIcon />
                        </Fab>
                );
        }

        const MyCanvas = () => {
                return (
                        <CanvasBase>
                                <AddCanvasButton />
                                {children}
                        </CanvasBase>
                );
        };
        const [canvases, setCanvases] = useState([<MyCanvas key="0" />]);

        let row = canvases.length;
        if (canvases.length > 2) {
                row = 2;
        }


        return (
                <Box style={{ display: 'grid', gridTemplateColumns: `repeat(${row}, 1fr)`, gap: '4px' }}>
                        {canvases.map((c) => { return c; })}
                </Box>
        );
}
