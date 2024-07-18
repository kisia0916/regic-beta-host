import React, { RefObject, useContext, useRef, useState } from 'react'
import axios from "axios"
import { serverURL } from '../../APIINFO'
import { LoginContext, SocketContext } from '../../App'
import { Navigate } from 'react-router-dom'
import { store } from '../../../main/StoreSys/storeMain'

function LoginPageMain() {
  const machineTokenInputRef = useRef<HTMLInputElement>(null)
  const machineNameInputRef = useRef<HTMLInputElement>(null)
  const machineStatusFunctions:{setState:any,setInfo:any} = useContext(LoginContext)
  const [doneSetting,setDoneSetting] = useState<Boolean>(false)
  const socket:any = useContext(SocketContext)
  const authRequest = ()=>{
    if (machineNameInputRef.current?.value && machineTokenInputRef.current?.value){
        axios.post(`${serverURL}/remotemachine/newmachine`,{
            machine_name:machineNameInputRef.current.value,
            machine_jwt_token:machineTokenInputRef.current.value
        }).then((res)=>{
            machineStatusFunctions.setState(true)
            machineStatusFunctions.setInfo({machineToken:res.data.machineToken})
            setDoneSetting(true)
            window.electron.ipcRenderer.sendMessage("set_machine_token",res.data.machineToken)
            socket.emit("first_handshake",{userType:"remoteMachine",token:res.data.machineToken})
        }).catch((error)=>{
            console.log(error)
            alert(error)
        })
    }
  }
  return (
    <div>
        <input type='text' ref={machineTokenInputRef}/>
        <input type='text' ref={machineNameInputRef}/>
        <button onClick={authRequest}>create</button>
        {doneSetting?<Navigate replace to="/"/>:<></>}
    </div>
  )
}

export default LoginPageMain