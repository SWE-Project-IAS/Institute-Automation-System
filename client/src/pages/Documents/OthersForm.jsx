import React, { useState } from 'react';

const CombinedFormsPage = () => {
  const [activeTab, setActiveTab] = useState('undergraduate');

  const undergraduateFormsData = [
    {
      formNo: "UG/01",
      specialisation: "Branch Change (For BTech students only)",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/bcform.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/bcform.pdf"
    },
    {
      formNo: "UG/02",
      specialisation: "Summer Internship Form",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/forms_internship_2007.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/internship_application_form_2007.pdf"
    },
    {
      formNo: "UG/03",
      specialisation: "Summer Internship Completion Certificate",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/summer_internship_comp_cert.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/summer_internship_comp_cert.pdf"
    },
    {
      formNo: "UG/04",
      specialisation: "Application for Minor Discipline",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/minor.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/minor.pdf"
    },
    {
      formNo: "UG/05",
      specialisation: "Minor Discipline Dropping Form",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/FORM_UG_05.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/FORM_UG_05.pdf"
    },
    {
      formNo: "UG/06",
      specialisation: "Minor Course Registration Form",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/MinorForm.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/MinorForm.pdf"
    },
    {
      formNo: "UG/07",
      specialisation: "Medical Leave Form",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/UG-medical-leave.docx",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/UG-medical-leave.pdf"
    },
    {
      formNo: "UG/08",
      specialisation: "Station Leave Form",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/UG-station-leave.docx",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/UG-station-leave.pdf"
    },
    {
      formNo: "SA/01",
      specialisation: "SA Course Adjustment Form (This is only for SA courses. Do not use for other courses)",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/SA_Course_Adjustment_Form.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/SA_Course_Adjustment_Form.pdf"
    },
    {
      formNo: "SA/02",
      specialisation: "SA Course Registration Form(This is only for Backlog Students of SA courses)",
      docLink: "https://www.iitg.ac.in/acad/forms/ug/SA_Course_Registration_Form.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/ug/SA_Course_Registration_Form.pdf"
    }
  ];

  const generalFormsData = [
    {
      formNo: "Gen/01",
      specialisation: "Application form for foreign students under exchange programmes",
      docLink: "https://www.iitg.ac.in/acad/forms/common/exchange.rtf",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/exchange.pdf"
    },
    {
      formNo: "Gen/02",
      specialisation: "Hall/Room Booking (For Staff & Faculties only)",
      docLink: "https://www.iitg.ac.in/acad/forms/common/rms_book.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/rms_book.pdf"
    },
    {
      formNo: "Gen/03",
      specialisation: "No Dues",
      docLink: "https://iitg.ac.in/acad/forms/common/nodues.doc",
      pdfLink: "https://iitg.ac.in/acad/forms/common/nodues.pdf"
    },
    {
      formNo: "Gen/04",
      specialisation: "Course Adjustment",
      docLink: "https://www.iitg.ac.in/acad/forms/common/cr_adjust.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/cr_adjust.pdf"
    },
    {
      formNo: "Gen/05",
      specialisation: "Course Dropping",
      docLink: "https://www.iitg.ac.in/acad/forms/common/cr_drop.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/cr_drop.pdf"
    },
    {
      formNo: "Gen/06",
      specialisation: "No Dues For Registration (For continuing students)",
      docLink: "https://www.iitg.ac.in/acad/forms/common/NoDuesForm.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/NoDuesForm.pdf"
    },
    {
      formNo: "Gen/07",
      specialisation: "Request to offer a Course during Summer Term",
      docLink: "https://www.iitg.ac.in/acad/forms/common/Request_for_Summer_Course.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/Request_for_Summer_Course.pdf"
    },
    {
      formNo: "Gen/08",
      specialisation: "Summer Term Course Registration Form",
      docLink: "https://www.iitg.ac.in/acad/forms/common/SummerTermRegistrationForm2016.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/SummerTermRegistrationForm2016.pdf"
    },
    {
      formNo: "Gen/09",
      specialisation: "Passport Verification Form",
      docLink: "https://www.iitg.ac.in/acad/forms/common/passport.rtf",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/passport.pdf"
    },
    {
      formNo: "Gen/10",
      specialisation: "Students Exchange Form",
      docLink: "https://www.iitg.ac.in/acad/forms/common/stud_exch_appl_form.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/stud_exch_appl_form.pdf"
    },
    {
      formNo: "Gen/11",
      specialisation: "Course Verification Form",
      docLink: "https://www.iitg.ac.in/acad/forms/common/stud_exch_course_verification.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/stud_exch_course_verification.pdf"
    },
    {
      formNo: "Gen/12",
      specialisation: "Request for Postage of Degree Certificate/Transcript etc.",
      docLink: "https://www.iitg.ac.in/acad/forms/common/POST.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/POST.pdf"
    },
    {
      formNo: "Gen/13(A)",
      specialisation: "Course Registration Form",
      docLink: "https://www.iitg.ac.in/acad/forms/common/blankForm.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/blankForm.pdf"
    },
    {
      formNo: "Gen/13(B)",
      specialisation: "Course Registration Form (For Backloggers)",
      docLink: "https://www.iitg.ac.in/acad/forms/common/blankFormBACKLOGGERS.doc",
      pdfLink: "https://www.iitg.ac.in/acad/forms/common/blankFormBACKLOGGERS.pdf"
    }
  ];

  const renderFormsTable = (formData) => {
    return (
      <div className="overflow-x-auto shadow-md rounded-lg mt-4">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-indigo-500 text-white">
              <th className="py-4 px-6 font-semibold">Form No</th>
              <th className="py-4 px-6 font-semibold">Specialisation</th>
              <th className="py-4 px-6 font-semibold text-right">FORMAT</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((form, index) => (
              <tr 
                key={form.formNo} 
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-4 px-6 border-t">{form.formNo}</td>
                <td className="py-4 px-6 border-t">{form.specialisation}</td>
                <td className="py-4 px-6 border-t text-right">
                  <a href={form.docLink} className="text-blue-600 hover:underline mr-6">DOC</a>
                  <a href={form.pdfLink} className="text-blue-600 hover:underline">PDF</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl text-gray-700 font-medium mb-6">University Forms</h1>
      
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'undergraduate' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('undergraduate')}
        >
          Undergraduate Forms
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('general')}
        >
          General Forms
        </button>
      </div>
      
      {activeTab === 'undergraduate' && (
        <>
          <h2 className="text-2xl text-gray-700 font-medium mb-4">Undergraduate Forms</h2>
          {renderFormsTable(undergraduateFormsData)}
        </>
      )}
      
      {activeTab === 'general' && (
        <>
          <h2 className="text-2xl text-gray-700 font-medium mb-4">General Forms</h2>
          {renderFormsTable(generalFormsData)}
        </>
      )}
    </div>
  );
};

export default CombinedFormsPage;