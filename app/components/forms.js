"use client"
import { useState, useRef, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import UploadIcon from '@mui/icons-material/Upload';
import { getSaidai } from '../api/utils';
import { TextField } from '@mui/material';
import { useSelector } from 'react-redux'
import { D3Network } from '../network_components/network_vis';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


export function SelectSheetForm({ sheets, value, handleChange }) {
  return (
	<FormControl sx={{ m: 1, minWidth: 100 }}>
	  <InputLabel id="sheet-form-label">Sheet</InputLabel>
	  <Select
		labelId="sheet-form-label"
		id="sheets"
		value={value}
		label="Sheet"
		onChange={handleChange}
		autoWidth
	  >
		{sheets.map((sheet, index) => (
		  <MenuItem key={index} value={index}>{sheet}</MenuItem>
		))}
	  </Select>
	</FormControl>
  )
}

export function UploadButton({ loading, success }) {
  const MyButton = () => {
	if (success) {
	  return (<Fab sx={{
		bgcolor: "#A2EA00",
		'&:hover': { bgcolor: "#60B683" }
	  }}>
		<CheckIcon
		  sx={{
			color: "white",
			zIndex: 1,
			fontSize: 40,
		  }}
		/>
	  </Fab>);
	}

	if (loading) {
	  return (<Fab><CircularProgress
		sx={{
		  color: "#A2EA00",
		  position: 'absolute',
		  zIndex: 1,
		}}
	  /></Fab>)
	}

	return (
	  <Fab type='submit' sx={{ backgroundColor: "#55A5FF", '&:hover': { bgcolor: "#22259F" } }}>
		<UploadIcon
		  sx={{
			color: "white",
			zIndex: 1,
			fontSize: 40
		  }}
		/></Fab>
	)
  };

  return (
	<MyButton></MyButton>
  )
}

export function FileInput({ setSelectedFile }) {
  const [filename, setFilename] = useState("ファイルをアップロード");
  const inputRef = useRef(null);
  const fileUpload = () => {
	console.log(inputRef.current);
	inputRef.current.click();
  };

  const handleFileChange = (event) => {
	console.log(event.target.files[0])
	setSelectedFile(event.target.files[0]);
	setFilename(event.target.files[0].name)
  };

  return (
	<>
	  <Button sx={{ fontSize: 25, mx: 1, fontFamily: "Arboria-Light", fontWeight: 700, backgroundColor: "#55A5FF" }} variant="contained" onClick={fileUpload}>UPLOAD</Button>
	  <TextField
		defaultValue={filename}
		onClick={fileUpload}
		sx={{ fontSize: 25, mr: 2 }}
		InputProps={{
		  readOnly: true,
		}}></TextField>
	  <input ref={inputRef} hidden type="file" onChange={handleFileChange} />
	</>
  )
}


export function NetworkFormD3() {
	const [sheets, setSheets] = useState(null);
	const [sheetValue, setSheetValue] = useState(0);
	const [currentData, setCurrentData] = useState(null)
	const [saidai, setSaidai] = useState(false)
	const data = useSelector((state) => state.netWorkData.data)
	const zoom = 100

	const handleSheetChange = ({ target }) => {
		setSheetValue(target.value);
	}

	function handleSaidaiCheck(event, newValue) {
		setSaidai(newValue)
	}

	useEffect( () => {
		if (!data) {return}
		setSheets(Object.keys(data.payload))
	}, [data])

	useEffect( () => {
		if (!(data && sheets)) {return}

		const sheet = sheets[sheetValue]
		if (saidai){
			getSaidai(data.payload[sheet], (d) => setCurrentData(d))
			return
		}

		setCurrentData(data.payload[sheet])
	}, [data, sheetValue, sheets, saidai])


	return (
		<div>
		<Box sx={{ marginTop: 0 }}>
			{sheets && <SelectSheetForm sheets={sheets} value={sheetValue} handleChange={handleSheetChange} />}
		</Box>
		<div><FormControlLabel control={<Checkbox onChange={handleSaidaiCheck}/>} label="最大連結成分" /></div>
		<Box>
			{currentData && sheets && <D3Network data={currentData} width={"100%"} height={500} zoom={zoom/100} />}
		</Box>
		</div>
	)
}