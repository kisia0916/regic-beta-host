import fs from "fs"

const filePath = "./config.json"
export const store = {
    set:(key:string,value:string)=>{
        if (fs.existsSync(filePath)){
            const jsonData = JSON.parse(fs.readFileSync(filePath,"utf-8"))
            jsonData[key] = value
            fs.writeFileSync(filePath,JSON.stringify(jsonData))
        }else{
            const dataJson:{[key:string]:string} = {}
            dataJson[key] = value
            fs.writeFileSync(filePath,JSON.stringify(dataJson))
        }
    },
    get:(key:string):string=>{
        const jsonData = JSON.parse(fs.readFileSync(filePath,"utf-8"))
        const data = jsonData[key]
        return data
    }
}