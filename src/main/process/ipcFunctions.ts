import {spawn} from "child_process"
import { processListInterface } from "../interface/processFunctionsInterface"
import ElectronStore from "electron-store"
import { store } from "../StoreSys/storeMain"
const processList:processListInterface[] = []

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const ipcFunction = (ipcMain:any,mainWindow:any)=>{
    ipcMain.on("mk_process",(event:any,arg:any)=>{
        const process = spawn("powershell.exe")
        processList.push({userId:arg.userId,process:process,isFirst:true,query:[],outIndex:0})
        const targetProcess = processList.find((i)=>i.userId === arg.userId)
        if (targetProcess){
            targetProcess.process.stdout.on("data",async(data:any)=>{
                if (targetProcess.isFirst){
                    const processIndex = processList.findIndex((i)=>i.userId === arg.userId)
                    processList[processIndex].isFirst = false
                    event.sender.send("new_process_created",{userId:arg.userId,data:data})
                }else{
                    if (targetProcess.query.length < 150){
                        targetProcess.query.push({data:data,userId:arg.userId})
                        targetProcess.outIndex+=1
                        const nowIndex = targetProcess.outIndex-1
                        await sleep(100*targetProcess.outIndex)
                        event.sender.send("process_result",targetProcess.query[nowIndex])
                    } 
                }
            })
            targetProcess.process.stderr.on("data",(data:any)=>{
                event.sender.send("process_result",{data:data,userId:arg.userId})
            })
        }
    })
    ipcMain.on("run_command",(event:any,arg:{command:string,userId:string})=>{
        const userId = arg.userId
        const process = processList.find((i)=>i.userId === userId)
        if (process){
            if (arg.command === "ctrlC"){
                process.query = []
                process.outIndex = 0
                process.process.kill("SIGINT")
                process.process.stdout.removeAllListeners("data")
                process.process = undefined
                process.process = spawn("powershell.exe")
                process.process.stdout.on("data",async(data:any)=>{
                    if (process.query.length < 150){
                        process.query.push({data:data,userId:arg.userId})
                        process.outIndex+=1
                        const nowIndex = process.outIndex-1
                        await sleep(100*process.outIndex)
                        event.sender.send("process_result",process.query[nowIndex])
                    } 
                })
                process.process.stderr.on("data",(data:any)=>{
                    event.sender.send("process_result",{data:data,userId:arg.userId})
                })
            }else{
                process.query = []
                process.outIndex = 0
                process.process.stdin.write(`${arg.command}\n`)
            }
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