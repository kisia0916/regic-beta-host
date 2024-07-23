import {spawn} from "child_process"
import { processListInterface } from "../interface/processFunctionsInterface"
import ElectronStore from "electron-store"
import { store } from "../StoreSys/storeMain"
import iconv from "iconv-lite"

const pty = require("../../../release/app/node_modules/node-pty")
const processList:processListInterface[] = []

export const ipcFunction = (ipcMain:any,mainWindow:any)=>{
    ipcMain.on("mk_process",(event:any,arg:any)=>{
        const runProcess = pty.spawn("ubuntu.exe",[],{
            name:arg.userId,
            cwd: process.env.HOME,
            env: process.env
        })
        processList.push({userId:arg.userId,process:runProcess,isFirst:true})
        const targetProcess:processListInterface|undefined = processList.find((i)=>i.userId === arg.userId)
        if (targetProcess){
            targetProcess.process.onData((data:any)=>{
                if (targetProcess.isFirst){
                    targetProcess.isFirst = false
                    event.sender.send("new_process_created",{data:data,userId:arg.userId})
                }else{
                    event.sender.send("process_result",{data:data,userId:arg.userId})
                }
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
    ipcMain.on("resize_term",(event:any,arg:{userId:string,size:number[]})=>{
        const targetProcess = processList.find((i)=>i.userId === arg.userId)
        console.log("resize")
        if (targetProcess){
            targetProcess.process.resize(arg.size[0],arg.size[1])
        }
    })
}

// targetProcess.process.stdin.write("python a.py\n")