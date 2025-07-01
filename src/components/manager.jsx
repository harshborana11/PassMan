import { CiSearch } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { useState } from 'react'
const localcreds = await JSON.parse(localStorage.getItem('creds'));
const Manager = () => {
  const [entry, setEntry] = useState({ site: '', username: '', password: '' })
  const [formtoggle, setFormtoggle] = useState(false);
  const handleForm = (e) => {
    setEntry({ ...entry, [e.target.name]: [e.target.value] })
  }
  const handleFormSubmit = async (e) => {
    console.log(entry); e.preventDefault()
    console.log(localcreds.key)
    const res = await fetch('http://localhost:5000/api/datapush', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: localcreds.uuid, key: localcreds.key, site: entry.site, username: entry.username, password: entry.password }) });
    if (res.ok) {
      const resdata = await res.json();
      console.log(resdata)

    }
  }
  return (<>
    <div className="text-white bg-white flex-col items-center h-max min-h-[50vh] div justify-center w-[70vw] p-4 container my-5">
      <div className=" text-5xl font-extrabold text-black min-w-full justify-center items-center flex">
        <span className="text-teal-700">&lt;</span>
        <span className="text-black">Pass</span>
        <span className="text-teal-700">Man/</span>
        <span className="text-teal-700">&gt;</span>
      </div>
      <div className="w-full h-[11vh] p-5 m-5 text-black flex items-center justify-center">
        <input id="search" className=" border-teal-700 border m-[10px] p-[5px] rounded-2xl w-[60%]" placeholder="search for site" type="text" name="" />
        <span className="search text-center flex items-center " ><CiSearch className="text-teal-700 h-[60%] w-auto mr-3" /></span>
        <span className="search text-center flex items-center " ><FaFilter className="text-teal-700 h-[40%] w-auto " /></span>
      </div>
      <div className="text-black flex items-center justify-center w-full min-h-[20vh] " >
        <h1>Add your passwords to show them here </h1>

      </div>
    </div>
    <div className="  popup " >
      <button onClick={() => { setFormtoggle(!formtoggle); }} className="addbtn" type=""><IoIosAddCircleOutline /></button>
      {formtoggle ? (<><form onSubmit={handleFormSubmit} className="form-container flex-col items-center content-center">
        <input type="text" placeholder="site" className=" border-teal-700 border m-[10px] p-[5px] rounded-2xl w-[60%]" onChange={handleForm} name="site" required />
        <input type="text" placeholder="username" className=" border-teal-700 border m-[10px] p-[5px] rounded-2xl w-[60%]" onChange={handleForm} name="username" required />
        <input type="password" onChange={handleForm} className=" border-teal-700 border m-[10px] p-[5px] rounded-2xl w-[60%]" placeholder="Password" name="password" required />
        <button type="submit" className="btn">Add</button>
      </form> </>) : (<></>)}
    </div >

  </>)
}

export default Manager
