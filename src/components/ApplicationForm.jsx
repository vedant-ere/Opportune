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
    location:"",
    salary:"",
    jobUrl:"",
    contactPerson:"",
    contactEmail:"",
  })
  useEffect(() => {
    if(formData){
      setForm(formData)
    }
  }, [formData])

  const handleChange = (e) =>{
    setForm({...form, [e.target.name] : e.target.value })
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
      document.removeEventListener("mousedown",  handleClickOutside)
    }
  }, [onClose])

  return ReactDOM.createPortal (
    <div className="fixed inset-0 flex justify-center backdrop-blur-sm items-center z-40 animate-fadeIn" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
      <div ref={modalRef} className="p-6 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-lg)' }}>
        <h2 className="heading-secondary mb-6">{formData ? "Edit Application" : "New Application"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Company *</label>
              <input
                type="text"
                placeholder="e.g., Google"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="input-base w-full"
                required
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Position *</label>
              <input
                type="text"
                placeholder="e.g., Software Engineer"
                name="position"
                value={form.position}
                onChange={handleChange}
                className="input-base w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Location</label>
              <input
                type="text"
                placeholder="e.g., San Francisco, CA"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Salary Range</label>
              <input
                type="text"
                placeholder="e.g., $80k - $120k"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Job URL</label>
            <input
              type="url"
              placeholder="https://example.com/job-posting"
              name="jobUrl"
              value={form.jobUrl}
              onChange={handleChange}
              className="input-base w-full"
            />
          </div>

          <div className="divider my-2"></div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Contact Person</label>
              <input
                type="text"
                placeholder="e.g., John Doe"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Contact Email</label>
              <input
                type="email"
                placeholder="e.g., recruiter@company.com"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
          </div>

          <div className="divider my-2"></div>

          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Status *</label>
              <select
                value={form.status}
                name="status"
                onChange={handleChange}
                className="input-base w-full"
              >
                <option value="Applied">Applied</option>
                <option value="Waiting">Waiting</option>
                <option value="Interview">Interview</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Application Date *</label>
              <input
                type="date"
                value={form.applicationDate}
                name="applicationDate"
                onChange={handleChange}
                className="input-base w-full"
                required
              />
            </div>
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Follow Up Date</label>
              <input
                type="date"
                value={form.followupDate}
                name="followupDate"
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any additional notes about this application..."
              className="input-base w-full resize-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {formData ? "Update" : "Save"} Application
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );    
};

export default ApplicationForm;
