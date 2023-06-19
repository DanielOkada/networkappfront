export async function getNetwork(){
    const res = await fetch("get_network");
    const data = await res.json();
    return data;
}

export async function getSheets(){
    const res = await fetch("get_sheets");
    const data = await res.json();
    return data.sheets;
}

export async function setSheet(sheet){
  const formData = new FormData();
  formData.append('sheet', sheet);

  fetch("set_sheet", {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('set sheet:', data);
    })
    .catch((error) => {
      console.error('set sheet error:', error);
    });
}