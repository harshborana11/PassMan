import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Bounce, Slide, Zoom, ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import './login.css'
const Login = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [inputError, setInputError] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [creds, setCreds] = useState("")
  const [state, setState] = useState("login")
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault()
    if (state === 'login') {
      const loadingToastId = toast.loading('Logging in...');
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, pass: password }) });
      if (res.ok) {
        const data = await res.json();
        toast.update(loadingToastId, {
          render: 'Logged in successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        localStorage.setItem('creds', JSON.stringify(data))
        navigate('/');
      }
      else {
        setInputError(true);
        setTimeout(() => setInputError(false), 1000);
        let data = await res.json();
        toast.update(loadingToastId, {
          render: data.message || 'Login failed',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        data.message
      }

    } if (state === 'signup') {
      const loadingToastId = toast.loading('signing up..');
      let uuid = uuidv4();
      e.preventDefault();
      setCreds(` username : ${name} email : ${email}`);
      const res = await fetch(`${API_BASE}/api/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, email: email, uuid: uuid, pass: password }) });
      if (res.ok) {
        toast.update(loadingToastId, {
          render: `Your accout is created, you can now login`,
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        setState('login')
      }
      else {
        let data = await res.json();
        toast.update(loadingToastId, {
          render: data.message || 'Login failed',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
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
        <form onSubmit={handle} className=' items-center'>
          {state === 'signup' ? (<><label htmlFor="name">UserName</label><input id='name' required className={inputError ? ('input error') : ('input')} type="text" onChange={(e) => setName(e.target.value)} name="" value={name} /></>) : (<></>)}
          <label htmlFor="email">Email</label>
          <input className={inputError ? ('input error') : ('input')} id='email' type="email" required onChange={(e) => setEmail(e.target.value)} name="" value={email} />
          <label htmlFor="pass">Password</label>
          <input className={inputError ? ('input error') : ('input')} id='pass' required type="password" onChange={(e) => setPassword(e.target.value)} name="" value={password} />
          <button type="submit" name="" value="submit">{state === 'signup' ? ('signup') : ('login')}</button>
          <button className='w-max' type="" onClick={(e) => {
            e.preventDefault()
            state === 'login' ? setState('signup') : setState('login')
          }} name="" >{state === 'login' ? ('create an account') : ('login')}</button>
        </form>
        <ToastContainer toastClassName={({ type }) =>
          type === 'success'
            ? 'toast-success toast'
            : type === 'error'
              ? 'toast-error toast'
              : 'toast-loading toast'
        } />
      </div>
    </>
  )
}

export default Login
