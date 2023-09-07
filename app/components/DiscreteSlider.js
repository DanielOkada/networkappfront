"use client";
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';
import { D3Network } from '../network_components/network_vis';
import { getNetworksD3 } from '../api/utils';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';




export default function DiscreteSlider({ data, network_data }) {
        const [value, setValue] = useState(0);
        const [intervalID, setIntervalID] = useState();
        const [graph, setGraph] = useState();
        const [originalGraph, setOriginalGraph] = useState();
        const [zoom, setZoom] = useState(100);

        const handleClick = () => {
                if (intervalID) {
                        console.log("stop");
                        clearInterval(intervalID);
                        setIntervalID(null);
                        return;
                }

                console.log("start");
                const id = setInterval(() => {
                        setValue((prevValue) => prevValue + 1);
                }, 1000);
                setIntervalID(id);
        };


        const handleChange = (event, newValue) => {
                clearInterval(intervalID);
                setIntervalID(null);
                setValue(newValue);
        };

        if (value == data.length - 1 && intervalID) {
                clearInterval(intervalID);
                setIntervalID(null);
        }

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


        useEffect(() => {
                if (!network_data) { return }
                setGraph(network_data);
        }, [network_data]);

        const buttonText = () => {
                if (intervalID) { return "STOP"; }
                return "START";
        };

        return (
                <Box sx={{ width: "100%", height: "100%", textAlign: "left" }}>
                        <Box sx={{ position: "relative" }}>
                                <Button variant="contained" onClick={handleClick} sx={{ backgroundColor: "#55A5FF" }}>{buttonText()}</Button>
                                <Slider
                                        defaultValue={0}
                                        valueLabelFormat={(x) => data[x]}
                                        onChange={handleChange}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        // min={10}
                                        max={data.length - 1}
                                        marks
                                        value={value}
                                        sx={{ color: "#55A5FF", width: "300px", textAlign: "center", position: "relative", top: 10, left: 20 }} />
                                <Box sx={{ position: "absolute", left: 420, top: 10, fontSize: 30, fontWeight: 700 }}>{data[value]}</Box>
                                <div><FormControlLabel control={<Checkbox onChange={handleSaidaiCheck} />} label="最大連結成分" /></div>
                        </Box>
                        {!graph && <CircularProgress sx={{ position: "relative", display: "block", marginLeft: "auto", marginRight: "auto", top: 100 }} />}
                        {graph && <D3Network data={graph[data[value]]} time={data[value]} width={"100%"} height={700} zoom={zoom / 100} />}
                        <Slider
                                defaultValue={100}
                                valueLabelFormat={(x) => x + "%"}
                                onChange={(event, newValue) => setZoom(newValue)}
                                valueLabelDisplay="auto"
                                step={10}
                                min={50}
                                max={1000}
                                value={zoom}
                                sx={{ color: "#55A5FF", width: "300px", textAlign: "center", position: "relative", top: 10, left: 20 }} />
                </Box>
        );
}
