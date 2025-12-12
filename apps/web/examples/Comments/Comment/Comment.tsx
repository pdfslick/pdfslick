import { useState } from "react";

export default function Comment({ isOpenend, onClose }: { isOpenend: boolean, onClose: () => void }) {
    const [userName] = useState("Henk Janssen");
    const [comment, setComment] = useState("");

    function handleClose() {
        console.log("handleClose function called.");
        onClose();
        setComment("");
    }

    function handleSubmit() {
        console.log("The following comment was submitted: ", comment);
        setComment("");
        handleClose();
    }
    
  return (
    <div className={`fixed left-4 top-4 bg-gray-800 z-10 p-3 rounded shadow-lg ${
        isOpenend ? 'visible' : 'invisible'
      }`}>
        <div className="flex justify-between items-center">
            <p className="text-white text-xs">{userName}</p>
            <p onClick={handleClose} className="cursor-pointer">❌</p>
        </div>
        <div className="flex flex-col">
            <input type="text" className="border border-slate-300 rounded p-2" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="bg-gray-600 hover:bg-gray-500 text-white mt-2 rounded" onClick={handleSubmit}>Submit</button>
        </div>
  </div>
  )

}