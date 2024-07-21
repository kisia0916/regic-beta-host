import {spawn} from "child_process"
import { processListInterface } from "../interface/processFunctionsInterface"
import ElectronStore from "electron-store"
import { store } from "../StoreSys/storeMain"
import * as pty from "node-pty"

const processList:processListInterface[] = []

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const ipcFunction = (ipcMain:any,mainWindow:any)=>{
    ipcMain.on("mk_process",(event:any,arg:any)=>{
        const runProcess = pty.spawn("powershell.exe",[],{
            name:arg.userId,
            // cwd: process.env.HOME,
            // env: process.env
        })
        processList.push({userId:arg.userId,process:runProcess})
        const targetProcess:processListInterface|undefined = processList.find((i)=>i.userId === arg.userId)
        if (targetProcess){
            targetProcess.process.onData((data:any)=>{
                event.sender.send("process_result",{data:data,userId:arg.userId})
            })
        }
    })
    ipcMain.on("get_input",(event:any,arg:{command:string,userId:string})=>{
        const targetProcess:processListInterface|undefined = processList.find((i)=>i.userId === arg.userId)
        if (targetProcess){
            targetProcess.process.write(arg.command)
        }else{

        }
    })
    ipcMain.on("get_machine_token",(event:any,arg:any)=>{
        event.reply("get_machine_token",store.get("machine_token"))
    })
    ipcMain.on("set_machine_token",(event:any,arg:any)=>{
        store.set("machine_token",arg)
    })
}

// targetProcess.process.stdin.write("python a.py\n")