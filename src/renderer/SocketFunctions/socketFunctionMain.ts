export const socketFunctionMain = (socket:any)=>{
    socket.on("socket-error",(data:string)=>{
        alert(data)
    })
    socket.on("connection_request",(data:{userId:string})=>{
        window.electron.ipcRenderer.sendMessage("mk_process",{userId:data.userId})
    })
    socket.on("run_command",(data:{command:string,userId:string})=>{
        window.electron.ipcRenderer.sendMessage("run_command",data)
    })
}