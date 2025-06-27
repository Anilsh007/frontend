import CommonForm from "../../components/CommonForm";
import { useState } from "react";

export default function SearchDocument({ vendors, setFilteredVendors }) {
  const [showSearchDoc, setShowSearchDoc] = useState(false); // Toggle between search modes
  const [searchCode, setSearchCode] = useState("");

  const [formData, setFormData] = useState({
    ClientId: "",
    UserCode: "",
    Fname: "",
    Lname: "",
    Email: "",
    EIN: "",
    Duns: "",
    UEI: "",
    Naics1: "", Naics2: "", Naics3: "", Naics4: "", Naics5: "",
    Nigp1: "", Nigp2: "", Nigp3: "", Nigp4: "", Nigp5: "",
    documentSearch: ""  // ✅ new
  });


  // 🧠 Helper to render grouped inputs
  const renderGroupedInputs = (keys, formData, setFormData) => (
    <div className="d-flex gap-2 flex-wrap">
      {keys.map((key) => (
        <input
          key={key}
          type="text"
          className="form-control"
          style={{ flex: "1 0 100px", minWidth: 0 }}
          placeholder={key}
          value={formData[key] || ""}
          onChange={(e) =>
            setFormData({ ...formData, [key]: e.target.value })
          }
        />
      ))}
    </div>
  );

  // 🧩 Form fields
  const formFields = [
    { name: "Small Business", label: "Small Business(Drop down)", type: "text" },
    { name: "BusinessClassification", label: "Business Classification(Drop down)", type: "text" },
    { name: "State", label: "State(Drop down)", type: "text" },
    // { name: "Company", label: "Company", type: "text" },
    {
      name: "idCodesGroup",
      label: "NAICS / NIGP",
      type: "custom",
      render: (formData, setFormData) =>
        renderGroupedInputs(["NAICS", "NIGP"], formData, setFormData)
    },
    // {
    //   name: "NaicsGroup",
    //   label: "NAICS Codes",
    //   type: "custom",
    //   render: (formData, setFormData) =>
    //     renderGroupedInputs(
    //       ["Naics1", "Naics2", "Naics3", "Naics4", "Naics5"],
    //       formData,
    //       setFormData
    //     )
    // },
    // {
    //   name: "NigpGroup",
    //   label: "NIGP Codes",
    //   type: "custom",
    //   render: (formData, setFormData) =>
    //     renderGroupedInputs(
    //       ["Nigp1", "Nigp2", "Nigp3", "Nigp4", "Nigp5"],
    //       formData,
    //       setFormData
    //     )
    // },
    {
      name: "documentSearch",
      label: "Space After each keyword",
      type: "textarea",
      inputClass: "form-control",
      rows: 3
    }
  ];

  const toggleSearchMode = () => {
    setShowSearchDoc((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filtered = vendors.filter((vendor) => {
      // Match normal fields
      const matchesForm = Object.entries(formData).every(([key, val]) => {
        if (!val || key === "documentSearch") return true;
        return (vendor[key] || "").toString().toLowerCase().includes(val.toLowerCase());
      });

      // Match documentText
      const docSearch = formData.documentSearch?.trim().toLowerCase();
      const matchesDoc = !docSearch || (vendor.documentText || "").toLowerCase().includes(docSearch);

      return matchesForm && matchesDoc;
    });

    setFilteredVendors(filtered);
  };



  const searchFields = [
    "vendorcode", "vendorcompanyname", "Email", "Mobile",
    "Duns", "Naics1", "Naics2", "Naics3", "Naics4", "Naics5",
    "Nigp1", "Nigp2", "Nigp3", "Nigp4", "Nigp5"
  ];

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchCode(value);

    const filtered = vendors.filter((vendor) =>
      searchFields.some(
        (key) =>
          (vendor[key] || "").toString().toLowerCase().includes(value)
      ) ||
      ([vendor.Fname, vendor.Lname].filter(Boolean).join(" ") || "")
        .toLowerCase()
        .includes(value)
    );

    setFilteredVendors(filtered);
  };

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2>Vendors</h2>
        <button
          className="btn btn-outline-primary w-25"
          onClick={toggleSearchMode}
        >
          {showSearchDoc ? "Simple Search" : "Advanced Search"}
        </button>
      </div>

      <div className="mb-3 mt-3">
        {showSearchDoc ? (
          <>
            <h5 className="text-primary">Advanced Search</h5>
            <CommonForm
              fields={formFields}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              buttonLabel="Search"
            />
          </>
        ) : (
          <>
            <label className="form-label text-white p-1 px-2 rounded-3 bg-danger">
              <b>Hint:-</b> One Keyword search (Email, Company Name, FEIN, DUNS, UEI, NAICS, NIGP, CAGE Code)
            </label>
            <input
              type="text"
              className="form-control"
              value={searchCode}
              onChange={handleSearch}
            />
          </>
        )}
      </div>
    </div>
  );
}
