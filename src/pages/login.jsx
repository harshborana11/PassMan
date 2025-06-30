import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './login.css'
const Login = () => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [creds, setCreds] = useState("")
  const [state, setState] = useState("login")
  const handle = async (e) => {
    if (state === 'login') {
      e.preventDefault()
      const res = await fetch('http://localhost:5000/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, pass: password }) });
      if (res.ok) {
        const data = await res.json();
        console.log(data.message);
        console.log(data)
      }
      else { alert(res.error) }
    } if (state === 'signup') {
      let uuid = uuidv4();
      e.preventDefault();
      setCreds(` username : ${name} email : ${email}`);
      const res = await fetch('http://localhost:5000/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, email: email, uuid: uuid, pass: password }) });
      if (res.ok) { alert('success user created with ' + creds) }
      else { alert(res.error) }
    }
  }
  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className='flex items-center w-screen h-screen justify-center'>
        <form className=' bg-white  items-center'>
          <br />
          <div className=" text-5xl font-extrabold text-black w-full justify-center items-center flex">
            <span className="text-teal-800">&lt;</span>
            <span className="text-black">Pass</span>
            <span className="text-teal-800">Man/</span>
            <span className="text-teal-800">&gt;</span>
          </div> <br />
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
