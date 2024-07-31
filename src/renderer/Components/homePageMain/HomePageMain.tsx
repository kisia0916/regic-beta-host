import React, { useContext, useEffect, useRef, useState } from 'react'
import { LoginContext, SocketContext } from '../../App'

function HomePageMain() {
  const machineInfo:any = useContext(LoginContext)
  const socket:any = useContext(SocketContext)
  const firstFlg = useRef(true)
  useEffect(()=>{
    if (firstFlg.current){
      firstFlg.current = false
      socket.on('connect', () => {
        socket.emit("first_handshake",{userType:"remoteMachine",token:machineInfo.machineInfo.machineToken})
      });
    }
  },[])
  return (
    <div>
        <span>token:{machineInfo.machineInfo.machineToken}</span>
    </div>
  )
}

export default HomePageMain