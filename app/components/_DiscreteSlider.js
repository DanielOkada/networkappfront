"use client";
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';




export default function DiscreteSlider({ data, network_data }) {
        const [graph, setGraph] = useState();
        const [originalGraph, setOriginalGraph] = useState();


        const handleSaidaiCheck = (event, newValue) => {
                if (newValue == false) {
                        setGraph(JSON.parse(originalGraph));
                        return;
                }

                setOriginalGraph(JSON.stringify(graph));
                const new_graph = { ...graph };
                for (const time in graph) {
                        new_graph[time].nodes = graph[time].nodes.filter(node => graph[time].saidai.includes(node.id));
                        new_graph[time].links = graph[time].links.filter(link => graph[time].saidai.includes(link.source) || graph[time].saidai.includes(link.target));
                }
                setGraph(new_graph);
        };

        return (
                <Box>
                        <Box sx={{ position: "relative" }}>
                                <div><FormControlLabel control={<Checkbox onChange={handleSaidaiCheck} />} label="最大連結成分" /></div>
                        </Box>
                </Box>
        );
}
