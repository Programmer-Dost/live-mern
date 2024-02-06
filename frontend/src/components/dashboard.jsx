import React from 'react'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { countState } from '../store/atoms/countAtom';
function Dashboard() {
  const number = useRecoilValue(countState)
  return (
    <div>Dashboard {number} from atom </div>
  )
}

export default Dashboard