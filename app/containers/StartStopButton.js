import Button from '@mui/material/Button';
import { useState } from 'react';


export default function StartStopButton({ onClick, ...others }) {
        const [isStarted, setStart] = useState(false);

        const buttonText = () => {
                if (isStarted) { return "STOP"; }
                return "START";
        };

        const MyOnClick = () => {
                setStart(!isStarted);

                if (!onClick) { return; }
                onClick();
        };

        return <Button onClick={MyOnClick} {...others}>{buttonText()}</Button>;
}
