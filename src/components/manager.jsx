import { IoIosAddCircleOutline } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { FaAngleLeft, FaAngleRight, FaKey } from "react-icons/fa";
import { themes, applyTheme } from '../assets/themes.js';
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { RevealOnce, RevealOnHover } from "./revealtext.jsx";
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

  useEffect(() => {
    !shouldRedirect && fetchData()
  }, [])


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

  const handleForm = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value })
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:5000/api/data/encrypt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: localcreds.uuid, key: localcreds.key, site: entry.site, username: entry.username, password: entry.password }) });
    if (res.ok) {
      await fetchData();
    }
  }
  const handleRender = async (site) => {
    setFormtoggle(false)
    const res = await fetch('http://localhost:5000/api/data/decrypt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid: localcreds.uuid, key: localcreds.key, site: site }) });
    if (res.ok) {
      const decryptedDataRaw = await res.json()
      const decryptedData = JSON.parse(decryptedDataRaw)
      setDisplayData({ site: site, username: decryptedData.usernametext, password: decryptedData.passwordtext })
    }
  }
  const [mode, setMode] = useState('darkThemes');
  const [themeIndex, setThemeIndex] = useState(0);
  const [theme, setTheme] = useState(themes.darkThemes[0]);


  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  if (shouldRedirect) return <Navigate to="/login" replace />;

  //NOTE: logic for themeing the website

  const filterDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
  }

  const handleNextTheme = () => {
    const themeList = themes[mode]; // themes.darkThemes or themes.lightThemes
    const nextIndex = (themeIndex + 1) % themeList.length;
    setThemeIndex(nextIndex);
    setTheme(themeList[nextIndex]);
  };

  const handlePrevTheme = () => {
    const themeList = themes[mode];
    const prevIndex = (themeIndex - 1 + themeList.length) % themeList.length;
    setThemeIndex(prevIndex);
    setTheme(themeList[prevIndex]);
  };

  const toggleThemeMode = () => {
    const newMode = mode === 'darkThemes' ? 'lightThemes' : 'darkThemes';
    setMode(newMode);
    const newThemeList = themes[newMode];
    const newIndex = themeIndex % newThemeList.length;
    setThemeIndex(newIndex);
    setTheme(newThemeList[newIndex]);
  };
  return (<>

    <nav>
      <h1 onClick={toggleThemeMode} className=" cursor-pointer text-4xl font-bold my-2 mx-4">Passman</h1>
    </nav>
    <div className="body">
      <div className=" section1">
        <div className=" section1-0">
          <input id="search" className="  m-[10px] p-[5px] rounded-2xl w-[60%]" placeholder="search for site" type="text" name="" />
          <span className="search text-center flex items-center  rounded-xl" onClick={() => { setFormtoggle(!formtoggle); setEntry({ site: '', username: '', password: '' }); }}><IoIosAddCircleOutline className={formtoggle ? 'h-full w-auto bg-[var(--color5)] rotate' : 'h-full togglebtn w-auto bg-[var(--color5)]'} /></span>        </div>
        <div className="section1-5 overflow-hidden">
          <div className="section1-5-5 scrollbar-pill max-h-full overflow-auto">
            <h1 className="c1 font-bold">#</h1><h1 className="c2 font-bold">Site</h1><h1 className="c3 font-bold">on date added</h1>
            {!loading && sites.map((item, index) => (<  ><h2 onClick={() => handleRender(item.site)} key={index} className="c1">{index + 1}</h2><h2 onClick={() => handleRender(item.site)} key={index} className="c2" >{item.site}</h2><h2 onClick={() => handleRender(item.site)} key={index} className="c3">{filterDate(item.created_at)}</h2></>))}
          </div>
          <div className="gridcolumn h-full">
            <div className="c1 grodiv h-full"></div>
            <div className="c2 grodiv h-full"></div>
            <div className="c3 grodiv h-full"></div>
          </div>
        </div>
      </div>
      <div className=" section2 ">
        <div className=" section2-0 ">
          <div className="flex gap-3 justify-center  items-center h-full">
            <FaAngleLeft onClick={handlePrevTheme} />
            <h1>{theme.name}</h1>
            <FaAngleRight onClick={handleNextTheme} />
          </div>
        </div>
        <div className="section2-5">
          <div className="  popup " >
            {formtoggle ? (<><form onSubmit={handleFormSubmit} className="form-container w-[100%]">
              <h1 className="text-4xl font-bold my-2 mx-4">Add Password</h1>
              <input type="text" placeholder="site" className=" m-[10px] p-[5px] rounded-2xl " onChange={handleForm} name="site" required />
              <input type="text" placeholder="username" className=" m-[10px] p-[5px] rounded-2xl" onChange={handleForm} name="username" required />
              <input type="password" onChange={handleForm} className=" m-[10px] p-[5px] rounded-2xl" placeholder="Password" name="password" required />
              <button type="submit" className="btn">Add</button>
            </form> </>) : (<></>)}
          </div >
          {!formtoggle && (<div className="w-[100%] gap-6 text-xl rounded-l flex flex-col justify-around">
            <h1 className="text-2xl"><RevealOnce text={displayData.site} /></h1>
            <div className="usrpassbox">
              <div className=" r1">
                <span className="text-xl  gap-3 flex"><IoPerson /> :<h2><RevealOnce text={displayData.username} /></h2></span>
              </div>
              <div className="r2">
                <span className="text-xl gap-3 flex"><FaKey /> :<h2> <RevealOnHover text={displayData.password} /></h2></span>
              </div>
            </div>
            <h2></h2>
          </div>
          )}

        </div>
      </div>
    </div>
  </>)
}

export default Manager
