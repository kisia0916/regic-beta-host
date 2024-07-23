import {spawn} from "child_process"
import { processListInterface } from "../interface/processFunctionsInterface"
import ElectronStore from "electron-store"
import { store } from "../StoreSys/storeMain"
import iconv from "iconv-lite"

import * as pty from "node-pty"
const processList:processListInterface[] = []

const fs = require('fs');

const logFile = fs.createWriteStream('debug.log', { flags: 'a' });
const errorFile = fs.createWriteStream('error.log', { flags: 'a' });

process.stdout.write = logFile.write.bind(logFile);
process.stderr.write = errorFile.write.bind(errorFile);

export const ipcFunction = (ipcMain:any,mainWindow:any)=>{
    ipcMain.on("mk_process",(event:any,arg:any)=>{
        try{
            const runProcess = pty.spawn("C:/Program Files/WindowsApps/CanonicalGroupLimited.Ubuntu_2204.3.49.0_x64__79rhkp1fndgsc/ubuntu.exe",[],{
                name:arg.userId,
                cwd: process.env.HOME,
                env: process.env
            })
            const processIndex = processList.findIndex((i)=>i.userId === arg.userId)
            if (processIndex !== -1){
                processList.splice(processIndex,1)
            }
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
        }catch{
            event.sender.send("error","")
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
    ipcMain.on("disconnect_client",(data:{userId:string})=>{
        const userIndex = processList.findIndex((i)=>i.userId === data.userId)
        if (userIndex !== -1){
            processList.splice(userIndex,1)
        }
    })
}

// targetProcess.process.stdin.write("python a.py\n")