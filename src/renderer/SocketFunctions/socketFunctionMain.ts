export const socketFunctionMain = (socket:any)=>{
    socket.on("socket-error",(data:string)=>{
        alert(data)
    })
    socket.on("connection_request",(data:{userId:string})=>{
        window.electron.ipcRenderer.sendMessage("mk_process",{userId:data.userId})
    })
    socket.on("get_input",(data:{command:string,userId:string})=>{
        window.electron.ipcRenderer.sendMessage("get_input",data)
    })
    socket.on("resize_term",(data:{userId:string,size:number[]})=>{
        window.electron.ipcRenderer.sendMessage("resize_term",data)
    })
}