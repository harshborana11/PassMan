import { CiSearch } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
const Manager = () => {
  const localcreds = (() => {
    try {
      const val = JSON.parse(localStorage.getItem('creds'));
      return val?.uuid && val?.key ? val : null;
    } catch {
      return null;
    }
  })();

  const shouldRedirect = !localcreds;

  const [entry, setEntry] = useState({ site: '', username: '', password: '' })
  const [formtoggle, setFormtoggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState();
  const [displayData, setDisplayData] = useState({ site: 'select a site', username: '#########', password: '**********' });
  const fetchData = async () => {
    if (!localcreds) return;
    setLoading(true)
    const res = await fetch('http://localhost:5000/api/data/sites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: localcreds.uuid }) });
    if (res.ok) {
      const resdata = await res.json();
      setSites(resdata)
      setLoading(false)
    }
  }

  useEffect(() => {
    shouldRedirect &&
      fetchData()
  }, [])


  const handleForm = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value })
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:5000/api/data/encrypt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: localcreds.uuid, key: localcreds.key, site: entry.site, username: entry.username, password: entry.password }) });
    if (res.ok) {
      setEntry({ site: '', username: '', password: '' });
      await fetchData();
    }
  }
  const handleRender = async (site) => {
    const res = await fetch('http://localhost:5000/api/data/decrypt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: localcreds.uuid, key: localcreds.key, site: site }) });
    if (res.ok) {
      const decryptedDataRaw = await res.json()
      const decryptedData = JSON.parse(decryptedDataRaw)
      setDisplayData({ site: site, username: decryptedData.usernametext, password: decryptedData.passwordtext })
    }
  }


  if (shouldRedirect) return <Navigate to="/login" replace />;
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
      <div className="w-full flex justify-between">
        <div className="text-black flex w-full min-h-[20vh] " >
          <div className="w-[48%] bg-gray-200 mx-[1%] h-max overflow-hidden p-6 text-xl flex-col rounded-l flex gap-3  justify-between">
            {!loading && sites.map((item, index) => (<h1 onClick={() => handleRender(item.site)} key={index}>{item.site}</h1>))}
          </div>
          <div className="w-[48%] bg-gray-200 mx-[1%] p-6 gap-4 text-xl rounded-l flex flex-col  justify-around">
            <h1>{displayData.site}</h1>
            <span className="text-lg gap-2 flex"><h1>Username :</h1><h2>{displayData.username}</h2></span>
            <span className="text-lg gap-2 flex"><h1>Password :</h1><h2>{displayData.password}</h2></span>
            <h2></h2>
          </div>
        </div>
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
