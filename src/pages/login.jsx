import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './login.css'
const Login = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [creds, setCreds] = useState("")
  const [state, setState] = useState("login")
  const navigate = useNavigate();
  const handle = async (e) => {
    if (state === 'login') {
      e.preventDefault()
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, pass: password }) });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('creds', JSON.stringify(data))
        navigate('/');
      }
      else { alert(res.error) }
    } if (state === 'signup') {
      let uuid = uuidv4();
      e.preventDefault();
      setCreds(` username : ${name} email : ${email}`);
      const res = await fetch(`${API_BASE}/api/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, email: email, uuid: uuid, pass: password }) });
      if (res.ok) { alert('success user created with ' + creds) }
      else { alert(res.error) }
    }
  }
  useEffect(() => {
    const localcreds = JSON.parse(localStorage.getItem('creds') || '{}');
    if (localcreds.uuid || localcreds.key) {
      navigate('/');
    }
  }, [])

  return (
    <>
      <div className='flex items-center flex-col w-screen h-screen justify-center'>
        <h1 className='text-3xl  font-bold'>passman</h1> <br />
        <form className=' items-center'>
          {state === 'signup' ? (<><label htmlFor="name">UserName</label><input id='name' className='input' type="text" onChange={(e) => setName(e.target.value)} name="" value={name} /></>) : (<></>)}
          <label htmlFor="email">Email</label>
          <input className='input' id='email' type="email" onChange={(e) => setEmail(e.target.value)} name="" value={email} />
          <label htmlFor="pass">Password</label>
          <input className='input' id='pass' type="password" onChange={(e) => setPassword(e.target.value)} name="" value={password} />
          <button type="" onClick={handle} name="" value="submit">Submit</button>
          <button type="" onClick={(e) => {
            e.preventDefault()
            state === 'login' ? setState('signup') : setState('login')
          }} name="" >{state}</button>
        </form>
      </div>
    </>
  )
}

export default Login
