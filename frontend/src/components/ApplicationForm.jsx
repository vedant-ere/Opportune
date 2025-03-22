import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom"

const ApplicationForm = ({ onClose, onSave, formData }) => {

  const modalRef = useRef(null);
  const [form, setForm] = useState({
    id:Date.now(),
    company:"",
    position:"",
    status:"Applied",
    applicationDate:"",
    followupDate:"",
    notes:"",
  

  })
  useEffect(() => {
    if(formData){
      setForm(formData)
    }
  }, [formData])

  const handleChange = (e) =>{
    setForm({...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    const index = applications.findIndex((app) => app.id == form.id )

    if(index !== -1){
      applications[index] = form; // editing the existing applicaiton
    }
    else{
      applications.push(form)
    }
    localStorage.setItem("applications", JSON.stringify(applications));
    onSave(applications)
    onClose();
  };



  useEffect(()=>{
    const handleClickOutside = (event) =>{
      if(modalRef.current && !modalRef.current.contains(event.target)){
        onClose()
      }
    }
    const keyPress = (event) =>{
      if(event.key == "Escape"){
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", keyPress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return ReactDOM.createPortal (
    <div className="fixed inset-0 flex justify-center  bg-opacity-20 backdrop-blur-xs items-center ">
      <div ref={modalRef} className="bg-[#2c2c2c] p-6 rounded-lg w-xl  shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">{formData ? "Edit Application" : "New Application"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
            type="text"
            placeholder="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="border border-gray-500 rounded-lg p-2 text-gray-400"
            required
          />
          <input
            type="text"
            placeholder="Position"
            name="position"
            value={form.position}
            onChange={handleChange}
            className="border border-gray-500 rounded-lg px-2 py-2  text-white"
            required
          />
          
          <label className="text-gray-400">Status</label>
          <select
            value={form.status}
            name="status"
            onChange={handleChange}
            className=" p-2 border border-gray-500 rounded-lg text-gray-400"
          >
            <option value="Applied">Applied</option>
            <option value="Waiting">Waiting</option>
            <option value="Interview">Interview</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <label className="text-gray-400">Application Date</label>
          <input
            type="date"
            value={form.applicationDate}
            name="applicationDate"
            onChange={handleChange}
            className="border border-gray-500 rounded-lg p-2  text-gray-400"
            required
          />
          <label className="text-gray-400">Follow Up Date</label>
          <input
            type="date"
            value={form.followupDate}
            name="followupDate"
            onChange={handleChange}
            className="border border-gray-500 rounded-lg p-2  text-gray-400"
          />
          <label className="text-gray-400">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="border border-gray-500 rounded-lg p-2  text-gray-400"
          ></textarea>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 cursor-pointer w-full mr-4 text-white rounded hover:bg-green-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );    
};

export default ApplicationForm;
