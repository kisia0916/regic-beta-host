import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import { createContext, useEffect, useRef, useState } from 'react';
import Home from './Pages/Home';
import {io} from "socket.io-client"
import { serverURL } from './APIINFO';
import { socketFunctionMain } from './SocketFunctions/socketFunctionMain';
import axios from 'axios';

export const SocketContext:any = createContext("")
export const LoginContext:any = createContext("")
export let machineToken:string = ""
const decoder = new TextDecoder("Shift_JIS")
const socket:any = io(`${serverURL}`,{
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
})

window.electron.ipcRenderer.on("new_process_created",(arg:any)=>{
  console.log(arg.data)
  socket.emit("new_process_created",{userId:arg.userId,data:arg.data,machineToken:machineToken})
})
export default function App() {
  const [isLogin,setIsLogin] = useState<boolean>(false)
  const [machineInfo,setMachineInfo] = useState<any>("")
  const [loadDone,setLoadDone] = useState<Boolean>(false)
  const isFirst = useRef<boolean>(true)
  useEffect(()=>{
    if (isFirst.current){
      isFirst.current = false
      window.electron.ipcRenderer.on("process_result",(arg:any)=>{
        socket.emit("process_result",{userId:arg.userId,data:arg.data,machineToken:machineToken})
      })
      window.electron.ipcRenderer.sendMessage("get_machine_token","")
      window.electron.ipcRenderer.once("get_machine_token",(arg)=>{
        if (arg){
          axios.post(`${serverURL}/remotemachine/authremotemachine`,{
            authToken:arg
          }).then((res)=>{
            setMachineInfo({machineToken:arg})
            machineToken = arg as string
            socket.emit("first_handshake",{userType:"remoteMachine",token:arg})
            setIsLogin(true)
            setLoadDone(true)
          }).catch((error)=>{
            setLoadDone(true)
          })
        }else{
          setLoadDone(true)
        }
      })
      socketFunctionMain(socket)
    }
  },[])

  return (
      <SocketContext.Provider value={socket}>
        <LoginContext.Provider value={{setState:setIsLogin,setInfo:setMachineInfo,machineInfo:machineInfo}}>
          {loadDone?<Router>
            <Routes>
                <Route path="/" element={isLogin?<Home/>:<Login/>} />
                <Route path='/login' element={<Login/>}/>
            </Routes>
          </Router>:<>loading...</>}
        </LoginContext.Provider>
      </SocketContext.Provider>
  );
}
