import CommonForm from "../../components/CommonForm";
import { useState } from "react";
import QandA from "../../components/QandA";
import states from "../../components/states";

export default function SearchDocument({ vendors, setFilteredVendors, setHasSearched }) {
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
    { name: "Sbclass", label: "Small Business Classification", type: "select", options: QandA.smallBusiness.map(item => ({ label: item, value: item })) }, { name: "Class", label: "Business Classification", type: "select", options: QandA["Business Classification"].map(item => ({ label: item, value: item })) },
    { name: "State", label: "State", type: "select", options: states.map(state => ({ label: state, value: state })) },
    {
      name: "idCodesGroup", label: "NAICS / NIGP", type: "custom",
      render: (formData, setFormData) =>
        renderGroupedInputs(["NAICS", "NIGP"], formData, setFormData)
    },
    { name: "documentSearch", label: "Space After each keyword", type: "textarea", inputClass: "form-control", rows: 3 }
  ];

  const toggleSearchMode = () => {
    setShowSearchDoc((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filtered = vendors.filter((vendor) => {
      let isMatch = true;

      // Loop through each field in formData
      for (const [key, value] of Object.entries(formData)) {
        if (!value?.trim()) continue; // Ignore empty fields

        const val = value.trim().toLowerCase();

        // ✅ Special case: Search in document text
        if (key === "documentSearch") {
          const docText = (vendor.documentText || "").toLowerCase();
          if (!docText.includes(val)) {
            isMatch = false;
            break;
          }
        }

        // ✅ Special case: NAICS field (search across Naics1–Naics5)
        else if (key === "NAICS") {
          const found = ["Naics1", "Naics2", "Naics3", "Naics4", "Naics5"].some(
            (naicsKey) => (vendor[naicsKey] || "").toLowerCase().includes(val)
          );
          if (!found) {
            isMatch = false;
            break;
          }
        }

        // ✅ Special case: NIGP field (search across Nigp1–Nigp5)
        else if (key === "NIGP") {
          const found = ["Nigp1", "Nigp2", "Nigp3", "Nigp4", "Nigp5"].some(
            (nigpKey) => (vendor[nigpKey] || "").toLowerCase().includes(val)
          );
          if (!found) {
            isMatch = false;
            break;
          }
        }

        // ✅ All other fields (direct match with vendor object)
        else {
          const vendorValue = (vendor[key] || "").toString().toLowerCase();
          if (!vendorValue.includes(val)) {
            isMatch = false;
            break;
          }
        }
      }

      return isMatch;
    });

    setFilteredVendors(filtered);
    setHasSearched(true);
  };

  const searchFields = [
    "vendorcode", "vendorcompanyname", "Email", "Mobile",
    "Duns", "Naics1", "Naics2", "Naics3", "Naics4", "Naics5",
    "Nigp1", "Nigp2", "Nigp3", "Nigp4", "Nigp5"
  ];

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchCode(value);

    // If input is empty, reset
    if (value.trim() === "") {
      setFilteredVendors([]);
      setHasSearched(false); // 🔄 Show info message again
      return;
    }

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
    setHasSearched(true);
  };


  const handleReset = () => {
    setFormData({
      ClientId: "",
      documentSearch: "",
      NAICS: "",
      NIGP: "",
      Sbclass: "",
      Class: "",
      State: ""
    });

    setFilteredVendors(vendors);   // Reset the table back to full list
    setSearchCode("");             // Clear simple search too (optional)
    setHasSearched(false);
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
            <>
              <CommonForm
                fields={formFields}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                showSubmit={false}// hide default button
              />

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button className="btn btn-outline-secondary w-25" onClick={handleReset}>Reset</button>
                <button className="btn btn-outline-primary w-25" onClick={handleSubmit}>Search</button>
              </div>
            </>
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
