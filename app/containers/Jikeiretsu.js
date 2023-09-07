import { getSheets } from '../utils';
import { useSelector } from 'react-redux'
import { useState } from 'react';
import JikeiretsuComponent from '../network_components/JikeiretsuComponent';

export default function Jikeiretsu(){
        const [value, setValue] = useState(0);
        const [intervalID, setIntervalID] = useState();

        const state_network_data = useSelector((state) => state.netWorkData.data)
        if (!state_network_data) {return}

        const network_data = state_network_data.payload
        const sheets = getSheets(network_data)

        const handleChangeSlider = (event, newValue) => {
                clearInterval(intervalID);
                setIntervalID(null);
                setValue(newValue);
        };

        const onStartButtonClick = () => {
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

        if (value == sheets.length - 1 && intervalID) {
                clearInterval(intervalID);
                setIntervalID(null);
        }

        return <JikeiretsuComponent 
                sheets={sheets}
                slider_value={value} 
                handleChangeSlider={handleChangeSlider} 
                network_data={network_data[sheets[value]]}
                onStartClick={onStartButtonClick}
         />
}