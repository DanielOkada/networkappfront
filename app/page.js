import { UploadForm, ShowNetwork, SelectSheet, getSheets } from "./utils"


export default function Home() {
  return (
    <>
      <UploadForm url={"upload"}/>
      <ShowNetwork/>
    </>
  )
}
