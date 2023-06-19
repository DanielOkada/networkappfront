"use client"
import { useState, useRef } from 'react';
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
import { getSheets, setSheet, getNetwork} from './utils';
import Graph from "react-graph-vis";
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextField } from '@mui/material';
import { store } from './store'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from './slices/counterSlice'
import { setTrue } from './slices/boolSlice';
import { sheetSelectedTrue } from './slices/sheetSelectedSlice';



export function SelectSheetForm({sheets, value, handleChange}){
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

export function UploadForm({url, onUploaded}) {
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
          });

      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
            <FileInput setSelectedFile={setSelectedFile}/>
            <UploadButton type="submit" loading={loading} success={success}/>
        </form>
      </div>
    );
  }


export function UploadButton({loading, success}){
  const MyButton = () => {
    if (success) {
      return (<Fab sx={{bgcolor:"green",
                       '&:hover': {bgcolor: "darkgreen"}
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
                        color: "green",
                        position: 'absolute',
                        // top: -6,
                        // left: -6,
                        zIndex: 1,
                    }}
                /></Fab>)
          }

    return (
      <Fab color="primary" type='submit'>
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

export function FileInput({setSelectedFile}){
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
      <Button sx={{fontSize:25, mx:1}} variant="contained" onClick={fileUpload}>UPLOAD</Button>
      <TextField  
          defaultValue={filename}
          onClick={fileUpload}
          sx={{fontSize:25, mr:2}}
          InputProps={{
            readOnly: true,
          }}></TextField>
      <input ref={inputRef} hidden type="file" onChange={handleFileChange} />
    </>
  )
}


export function SheetForm(){
      const completed = useSelector((state) => state.completed.value)
      const dispatch = useDispatch()
  
      const [sheets, setSheets] = useState(null);
      const [sheetValue, setSheetValue] = useState("");

      if (!completed){
        return
      }

      const sheets_getter = async () => {
            await getSheets().then((data) => {
              console.log(data)
              setSheets(data)
              });
            }

      if(!sheets){
        sheets_getter()
        return <div></div>
      }

      function handleSheetChange({target}){
          console.log(target.value);
          setSheetValue(target.value);
          setSheet(sheets[target.value]);

          dispatch(sheetSelectedTrue())
      }

      return <SelectSheetForm sheets={sheets} value={sheetValue} handleChange={handleSheetChange}/>
}


export function MyGraph({graph, options, events}){
      options["height"] = "700"
      options["width"] = "100%"
      options["autoResize"] = true
      options["edges"] = {
          color: "blue"
      }

      return (
            <Graph graph={graph} options={options} events={events}/>
      )
}


export function NetworkForm(){
  const [graph, setGraph] = useState();
  const [loading, setLoading] = useState();
  const sheetSelected = useSelector((state) => state.sheetSelected.value)


  async function handleNetworkDrawClick() {
      setLoading(<CircularProgress/>);
      const data = await getNetwork();
      console.log(data);

      const _graph = {
          nodes: data.nodes,
          edges: data.edges
        };
      
        const options = {
          layout: {
            hierarchical: false,
            improvedLayout: false,
          },
        };
      
        const events = {
          select: function(event) {
            var { nodes, edges } = event;
          }
        }; 
      setGraph(<MyGraph graph={_graph} options={options} events={events}/>);
      setLoading(null);
  }

  return (
      <div>
          <Box sx={{marginTop:0}}>
            <SheetForm/>
            <Button variant="contained" onClick={handleNetworkDrawClick} disabled={!sheetSelected} style={{margin:15}}>ネットワーク描画</Button>
          </Box>
          <Box>
              {loading}
              {graph}
          </Box>
      </div>
  )
}