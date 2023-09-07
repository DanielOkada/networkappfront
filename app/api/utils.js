"use client"
export async function getNetwork(){
    const res = await fetch("get_network");
    const data = await res.json();
    return data;
}

export async function getNetworks(){
  const res = await fetch("get_networks");
  const data = await res.json();
  return data;
}

export async function getNetworksD3(){
  const res = await fetch("get_networks_d3");
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


export async function getSaidai(data, callback){
  const formData = new FormData();
  formData.append('data', JSON.stringify(data))

  fetch("get_saidai_renketsu", {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('saidai :', data);
      callback(data)
    })
    .catch((error) => {
      console.error('saidai error:', error);
    });
}

export async function fetcher( resource, init ) {
    const res = await fetch(resource, init)

    if (!res.ok) {
        const errorRes = await res.json()
        const error = new Error(
          errorRes.message ?? 'APIリクエスト中にエラーが発生しました',
        )
    
        throw error
      }
    
    return res.json()
}