import { useState } from "react";

export default function Comment() {
    const [userName, setUserName] = useState("Henk Janssen");
    const [comment, setComment] = useState("");
    const [isOpen, setIsOpen] = useState(true);

    function handleClose() {
        setIsOpen(false);
    }
    
  return (
    <div className={`fixed left-4 top-4 bg-slate-800 z-10 p-3 rounded shadow-lg ${
        isOpen ? 'visible' : 'invisible'
      }`}>
        <div className="flex justify-between items-center">
            <p className="text-white text-xs">{userName}</p>
            <p onClick={handleClose} className="cursor-pointer">❌</p>
        </div>
        <div className="flex flex-col">
            <input type="text" className="border border-slate-300 rounded p-2" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white mt-2 rounded" onClick={handleClose}>Submit</button>
        </div>
  </div>
  )

}