import React, { RefObject, useContext, useEffect, useRef, useState } from 'react'
import axios from "axios"
import { serverURL } from '../../APIINFO'
import { LoginContext, SocketContext } from '../../App'
import { Navigate } from 'react-router-dom'
import { store } from '../../../main/StoreSys/storeMain'
import "./LoginPageMain.css"

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
        })
    }
  }
  return (
    // <div>
    //     <input type='text' ref={machineTokenInputRef}/>
    //     <input type='text' ref={machineNameInputRef}/>
    //     <button onClick={authRequest}>create</button>
    // </div>
    <>
    <div className='LoginPageMain'>
    <div className='loginSpace'>
        <div className='loginSpaceTop'>
            <span className='appTitle'>Regic</span>
        </div>
        <div className='loginSpaceBottom'>
          <div className='loginSpaceBottomSpace'>
              <input type='text' className='loginSpaceInput' placeholder='Machine Token' ref={machineTokenInputRef}/>
              <input type='text' className='loginSpaceInput' placeholder='UserName' ref={machineNameInputRef}/>
              <button className='loginSpaceButton' onClick={authRequest}>Create new machine</button>
          </div>
        </div>
        </div>
    </div>
    {doneSetting?<Navigate replace to="/"/>:<></>}
    </>
  )
}

export default LoginPageMain