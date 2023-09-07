import { getSheets } from '../utils';
import { useSelector } from 'react-redux'
import { useState } from 'react';
import DiscreteSlider from "../components/DiscreteSlider"

export default function Jikeiretsu(){
        const network_data = useSelector((state) => state.netWorkData.data.payload)
        const sheets = getSheets(network_data)

        return <DiscreteSlider data={sheets} network_data={network_data} />
}