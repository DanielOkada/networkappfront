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
import { getSheets, setSheet, getNetwork, getSaidai } from './utils';
import { TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { sheetSelectedTrue } from './slices/sheetSelectedSlice';
import { D3Network } from './network_components/network_vis';
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

export function UploadForm({ url, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  const handleSubmit = (event) => {
	event.preventDefault();

	if (selectedFile) {
	  setLoading(true);

	  // ファイルを送信する処理
	  const formData = new FormData();
	  formData.append('file', selectedFile);

	  fetch(url, {
		method: 'POST',
		body: formData,
	  })
		.then((response) => response.json())
		.then((data) => {
		  // ファイルのアップロードが完了した後の処理
		  // setUploaded(true)
		  console.log('File uploaded:', data);
		  setLoading(false)
		  setSuccess(true)
		  onUploaded()
		})
		.catch((error) => {
			console.error('File upload error:', error);
		})

	}
  };

  return (
	<div>
	  <form onSubmit={handleSubmit}>
		<FileInput setSelectedFile={setSelectedFile} />
		<UploadButton type="submit" loading={loading} success={success} />
	  </form>
	</div>
  );
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


export function SheetForm() {
  const completed = useSelector((state) => state.completed.value)
  const dispatch = useDispatch()

  const [sheets, setSheets] = useState(null);
  const [sheetValue, setSheetValue] = useState("");

  if (!completed) {
	return
  }

  const sheets_getter = async () => {
	await getSheets().then((data) => {
	  console.log(data)
	  setSheets(data)
	});
  }

  if (!sheets) {
	sheets_getter()
	return <div></div>
  }

  function handleSheetChange({ target }) {
	console.log(target.value);
	setSheetValue(target.value);
	setSheet(sheets[target.value]);

	dispatch(sheetSelectedTrue())
  }

  return <SelectSheetForm sheets={sheets} value={sheetValue} handleChange={handleSheetChange} />
}


export function MyGraph({ graph, options, events }) {
  options["height"] = "700"
  options["width"] = "100%"
  options["autoResize"] = true
  options["edges"] = {
	color: "#22259F",
	arrows: {
	  to: { enabled: false }
	},
	width: 5
  }

  return (
	<Graph graph={graph} options={options} events={events} />
  )
}


export function NetworkForm() {
  const [graph, setGraph] = useState();
  const [loading, setLoading] = useState();
  const sheetSelected = useSelector((state) => state.sheetSelected.value)


  async function handleNetworkDrawClick() {
	setLoading(<CircularProgress />);
	const data = await getNetwork();
	console.log(data);

	const group1 = "會社名"
	const group2 = "役員名"

	function configureNode(node) {
	  if (node["group"] == group1) {
		node["color"] = "#FF5126"
		node["shape"] = "box"
	  }

	  if (node["group"] == group2) {
		node["color"] = "#26A7FF"
		node["shape"] = "ellipse"
	  }

	  return node
	}

	const _graph = {
	  nodes: data.nodes.map(configureNode),
	  edges: data.edges
	};

	const options = {
	  layout: {
		hierarchical: false,
		improvedLayout: false,
	  },
	};

	const events = {
	  select: function (event) {
		var { nodes, edges } = event;
	  }
	};

	setGraph(<MyGraph graph={_graph} options={options} events={events} />);
	setLoading(null);
  }

  return (
	<div>
	  <Box sx={{ marginTop: 0 }}>
		<SheetForm />
		<Button variant="contained" onClick={handleNetworkDrawClick} disabled={!sheetSelected} style={{ margin: 15 }}>ネットワーク描画</Button>
	  </Box>
	  <Box>
		{loading}
		{graph}
	  </Box>
	</div>
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