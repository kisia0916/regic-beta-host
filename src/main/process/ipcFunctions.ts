import {spawn} from "child_process"
import { processListInterface } from "../interface/processFunctionsInterface"
import ElectronStore from "electron-store"
import { store } from "../StoreSys/storeMain"
const processList:processListInterface[] = []
export const ipcFunction = (ipcMain:any,mainWindow:any)=>{
    ipcMain.on("mk_process",(event:any,arg:any)=>{
        const process = spawn("powershell.exe")
        processList.push({userId:arg.userId,process:process,isFirst:true})
        processList.find((i)=>i.userId === arg.userId)?.process.stdout.on("data",(data:any)=>{
            if (processList.find((i)=>i.userId === arg.userId)?.isFirst){
                const processIndex = processList.findIndex((i)=>i.userId === arg.userId)
                processList[processIndex].isFirst = false
                event.sender.send("new_process_created",{userId:arg.userId,data:data})
            }else{
                event.sender.send("process_result",{data:data,userId:arg.userId})
            }
        })
        processList.find((i)=>i.userId === arg.userId)?.process.stderr.on("data",(data:any)=>{
            event.sender.send("process_result",{data:data,userId:arg.userId})
        })
    })
    ipcMain.on("run_command",(event:any,arg:{command:string,userId:string})=>{
        const userId = arg.userId
        const process = processList.find((i)=>i.userId === userId)
        if (process){
            process.process.stdin.write(`${arg.command}\n`)
        }
    })
    ipcMain.on("get_machine_token",(event:any,arg:any)=>{
        event.reply("get_machine_token",store.get("machine_token"))
    })
    ipcMain.on("set_machine_token",(event:any,arg:any)=>{
        store.set("machine_token",arg)
    })
}

// processList.find((i)=>i.userId === arg.userId)?.process.stdin.write("python a.py\n")