export const reconnectionFun = (socket:any,machineId:string)=>{
    const token = machineId
    socket.on("connect",()=>{
        console.log("再接続しました")
        socket.emit("first_handshake",{userType:"remoteMachine",token:token})
    })
}