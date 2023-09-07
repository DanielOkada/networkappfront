import { fetcher } from "./utils";

export async function getNetworkData(file){
        // ファイルを送信する処理
        const formData = new FormData()
        formData.append('file', file)

        const network_data = await fetcher("get_networks_d3", { method: 'POST', body: formData })

        if (!network_data) {
                console.log("ネットワークデータの取得に失敗")
        }

        return network_data
}
