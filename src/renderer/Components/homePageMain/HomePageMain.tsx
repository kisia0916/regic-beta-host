import React, { useContext, useEffect, useState } from 'react'
import { LoginContext, SocketContext } from '../../App'

function HomePageMain() {
  const machineInfo:any = useContext(LoginContext)
  const socket:any = useContext(SocketContext)
  const [firstFlg,setFirstFlg] = useState<Boolean>(false)

  return (
    <div>
        <span>token:{machineInfo.machineInfo.machineToken}</span>
    </div>
  )
}

export default HomePageMain