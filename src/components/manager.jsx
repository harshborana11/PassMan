import { CiSearch } from "react-icons/ci";
import { useState } from 'react'
const Manager = () => {
  const [entry, setEntry] = useState({ site: '', username: '', password: '' })
  const [formtoggle, setFormtoggle] = useState(false);
  const handleForm = (e) => {
    setEntry({ ...entry, [e.target.name]: [e.target.value] })
  }
  return (<>
    <div className="text-white bg-white flex-col items-center h-max div justify-center w-[50vw] p-4 container my-20">
      <div className=" text-5xl font-extrabold text-black min-w-full justify-center items-center flex">
        <span className="text-teal-300">&lt;</span>
        <span className="text-black">Pass</span>
        <span className="text-teal-300">Man/</span>
        <span className="text-teal-300">&gt;</span>
      </div>
      <div className="w-full h-max p-5 text-black">
        <input id="search" className=" border-teal-700 border m-[10px] p-[5px] rounded-2xl w-[60%]" type="text" name="" />
        <span className="w-max border-teal-700 border" ><CiSearch className="text-black w-[10%] h-10  text-2xl " /></span>
        <div>
          <button onClick={() => { setFormtoggle(!formtoggle); }} type="">Add New Entry</button>
          {formtoggle ? (<><form onSubmit={(e) => { e.preventDefault(); console.log(entry); setEntry({ site: '', username: '', password: '' }); }} className="form-container">
            <h1>Login</h1>
            <label htmlFor="site"><b>site</b></label>
            <input type="text" onChange={handleForm} name="site" required />
            <label htmlFor="email"><b>username/Email</b></label>
            <input type="text" onChange={handleForm} name="username" required />
            <label htmlFor="psw"><b>Password</b></label>
            <input type="password" onChange={handleForm} placeholder="Enter Password" name="password" required />
            <button type="submit" className="btn">Add</button>
          </form> </>) : (<></>)}
        </div>
      </div>
      <button type="" onClick={() => console.log(entry)} > log the entry</button>

    </div>
  </>)
}

export default Manager
