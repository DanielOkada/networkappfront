"use client";
import { Box } from '@mui/material';
import { useState } from 'react';
import { NetworkFormD3 } from './forms';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from './TabPanel';
import MapWithNetwork from "./MapWithNetwork";
import Jikeiretsu from "../containers/Jikeiretsu"




export default function BasicTabs() {
        const [value, setValue] = useState(0);

        const handleChange = (event, newValue) => {
                setValue(newValue);
        };

        return (
                <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="ネットワーク描画" />
                                        <Tab label="時系列描画" />
                                        <Tab label="地図" />
                                </Tabs>
                        </Box>

                        <TabPanel value={value} index={0}>
                                <NetworkFormD3 />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                                <Jikeiretsu />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                                <MapWithNetwork />
                        </TabPanel>
                </Box>
        );
}
