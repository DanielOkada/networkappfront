"use client";
import { Box } from '@mui/material';
import { useState, useEffect, useRef, useMemo } from 'react';
import { SelectSheetForm, FileInput } from '../forms';
import { useSelector } from 'react-redux';
import { D3NetworkRef } from '../network_components/network_vis';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import dynamic from 'next/dynamic';




export default function MapWithNetwork() {
        const chartRef = useRef();
        const [sheets, setSheets] = useState(null);
        const [sheetValue, setSheetValue] = useState(0);
        const [currentData, setCurrentData] = useState(null);
        const [saidai, setSaidai] = useState(false);
        const [addressData, setAddressData] = useState();
        const data = useSelector((state) => state.netWorkData.data);
        const zoom = 100;

        const handleSheetChange = ({ target }) => {
                setSheetValue(target.value);
        };

        function handleSaidaiCheck(event, newValue) {
                setSaidai(newValue);
        }

        function setAddressDataAndConvert(file) {
                const reader = new FileReader();
                reader.readAsText(file, 'utf-8');

                reader.onload = () => {
                        try {
                                const data = JSON.parse(reader.result);
                                setAddressData(data);
                        } catch (error) {
                                console.error('Error parsing JSON file:', error);
                        }
                };
        }

        useEffect(() => {
                if (!data) { return; }
                setSheets(Object.keys(data.payload));
        }, [data]);

        useEffect(() => {
                if (!(data && sheets)) { return; }

                const sheet = sheets[sheetValue];
                if (saidai) {
                        getSaidai(data.payload[sheet], (d) => setCurrentData(d));
                        return;
                }

                setCurrentData(data.payload[sheet]);
        }, [data, sheetValue, sheets, saidai]);

        useEffect(() => {
                console.log(addressData);
        }, [addressData]);

        let overlayNetwork = null;
        if (currentData) {
                overlayNetwork = <D3NetworkRef data={currentData} chartRef={chartRef} width={"100%"} height={"100%"} zoom={zoom / 100} />;
        }

        const mysvg = <svg>
                <rect x="0" y="0" width="100%" height="100%" fill="blue" />
                <circle r="5" cx="10" cy="10" fill="red" />
                <text x="50%" y="50%" stroke="white">
                        text
                </text>
        </svg>;

        const Map = useMemo(
                () => dynamic(() => import('./map'), {
                        loading: () => <p>map loading</p>,
                        ssr: false
                }),
                []
        );


        return (
                <div>
                        <Box sx={{ marginTop: 0 }}>
                                {sheets && <SelectSheetForm sheets={sheets} value={sheetValue} handleChange={handleSheetChange} />}
                                <FileInput setSelectedFile={setAddressDataAndConvert} />
                        </Box>
                        <div><FormControlLabel control={<Checkbox onChange={handleSaidaiCheck} />} label="最大連結成分" /></div>
                        <Box>
                                <Map overlaySVG={overlayNetwork} chartRef={chartRef} addressData={addressData} />
                        </Box>
                </div>
        );
}
