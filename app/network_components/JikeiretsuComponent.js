import { D3Network } from './network_vis';
import DiscreteSlider from '../components/DiscreteSlider';
import StartStopButton from '../containers/StartStopButton';


export default function JikeiretsuComponent({sheets, slider_value, handleChangeSlider, network_data, onStartClick, zoom=100}) {
        const SheetName = () => { 
                return <h1>{sheets[slider_value]}</h1>
        }

        return (
                <div>
                        <StartStopButton variant="contained" sx={{ backgroundColor: "#55A5FF" }} onClick={onStartClick}></StartStopButton>
                        <DiscreteSlider data={sheets} value={slider_value} onChange={handleChangeSlider}/>
                        <SheetName/>
                        <D3Network data={network_data} width={"100%"} height={700} zoom={zoom / 100} />
                </div>
        )
}

