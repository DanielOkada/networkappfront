import Slider from '@mui/material/Slider';

export default function DiscreteSlider(props) {
        return (
                <Slider
                        defaultValue={0}
                        valueLabelFormat={(x) => props.data[x]}
                        valueLabelDisplay="auto"
                        step={1}
                        // min={10}
                        max={props.data.length - 1}
                        marks
                        sx={{ color: "#55A5FF", width: "300px", textAlign: "center", position: "relative", top: 10, left: 20 }}
                        {...props} />
        );
}
