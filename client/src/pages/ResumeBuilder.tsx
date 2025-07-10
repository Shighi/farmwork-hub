import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Resumeform = () => {
  const [resumeData, setResumeData] = useState({
      fullname: '',
      email: '',
      phone: '',
      summary: '',
      experience: '',
      education: '',
      skills: '',
    });

  const printRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const handlePrint = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {scale:2});
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight );
    pdf.save("Resumepdf.pdf");

};

  return (
    <section className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-600">Resume Builder</h1>

      <form className="space-y-4">
        {/* Name */}
        <input
        name="fullname"
        type="text"
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Full Name"
        />

        {/* Email */}
        <input
        name="email"
        type="text"
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="you@example.com"
        />

        {/* phone number */}
        <input
        name="phone"
        type="text"
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Phone Number"
        />

        {/* summary */}
        <textarea
        name="summary"
        onChange={handleChange}
        rows={3}
        className="w-full border p-2 rounded"
        placeholder="professional summary"
        />

        { /* experience */}
        <textarea
        name="experience"
        onChange={handleChange}
        rows={3}
        className="w-full border p-2 rounded"
        placeholder="Work Experiences"
        />

        { /* education */}
        <textarea
        name="education"
        onChange={handleChange}
        rows={3}
        className="w-full border p-2 rounded"
        placeholder="Education"
        />

        {/* Skills */}
        <textarea
        name="skills"
        onChange={handleChange}
        rows={3}
        className="w-full border p-2 rounded"
        placeholder="Skills (comma-separated)"
        />
      </form>

      {/* PDF preview */}
      <div ref={printRef} className="p-6 bg-white border shadow rounded text-gray-800 mb-6">
        <h2 className="text-2xl font-bold">{resumeData.fullname}</h2>
        <p> {resumeData.email} | {resumeData.phone}</p>
        <hr className="my-3" />
        <h3 className="font-semibold text-lg">Summary</h3>
        <p>{resumeData.summary}</p>
        <h3 className="font-semibold text-lg mt-4">Experience</h3>
        <p>{resumeData.experience}</p>
        <h3 className="font-semibold text-lg mt-4">Education</h3>
        <p>{resumeData.education}</p>
        <h3 className="font-semibold text-lg mt-4">Skills</h3>
        <p>{resumeData.skills}</p>
      </div>

      <button onClick={handlePrint}
      className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
        Download PDF
      </button>
    </section>
  );
};

export default Resumeform;