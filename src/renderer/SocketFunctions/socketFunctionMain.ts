export const socketFunctionMain = (socket:any)=>{
    socket.on("socket-error",(data:string)=>{
    })
    socket.on("connection_request",(data:{userId:string,run_sys:string})=>{
        window.electron.ipcRenderer.sendMessage("mk_process",{userId:data.userId,run_sys:data.run_sys})
    })
    socket.on("get_input",(data:{command:string,userId:string})=>{
        window.electron.ipcRenderer.sendMessage("get_input",data)
    })
    socket.on("resize_term",(data:{userId:string,size:number[]})=>{
        window.electron.ipcRenderer.sendMessage("resize_term",data)
    })
    socket.on("restart_host",(data:any)=>{
        window.electron.ipcRenderer.sendMessage("restart_host",data)
    })
    socket.on("disconnect_client",(data:{userId:string})=>{
        window.electron.ipcRenderer.sendMessage("disconnect_client",data)
    })

}