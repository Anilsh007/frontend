import React from 'react';

const CommonForm = ({
  fields,
  formData,
  setFormData,
  onSubmit,
  buttonLabel = "Submit",
  showSubmit = true
}) => {
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        {fields.map((field) => (
          <div
            className={field.fullWidth ? 'col-12 mb-3' : 'col-md-4 mb-3'}
            key={field.name}
          >
            {!field.hideLabel && field.label && (
              <label className="form-label">{field.label}</label>
            )}

            {field.type === 'custom' && field.render ? (
              <div>{field.render(formData, setFormData)}</div>
            ) : field.type === 'select' ? (
              <select
                className={field.inputClass || "form-control"}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required || false}
                disabled={field.disabled || false}
              >
                <option value="">Select {field.label}</option>
                {field.options &&
                  field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className={field.inputClass || "form-control"}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                rows={field.rows || 3}
                placeholder={field.placeholder || ''}
                required={field.required || false}
                disabled={field.disabled || false}
              />
            ) : field.type === 'file' ? (
              <input
                type="file"
                className={field.inputClass || "form-control"}
                name={field.name}
                onChange={handleChange}
                accept={field.accept || '*/*'}
                required={field.required || false}
                disabled={field.disabled || false}
              />
            ) : (
              <input
                type={field.type}
                className={field.inputClass || "form-control"}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                required={field.required || false}
                disabled={field.disabled || false}
              />
            )}
          </div>
        ))}
      </div>

      <div className="text-end">
        {showSubmit && (
          <button type="submit" className="btn btn-outline-primary">{buttonLabel}</button>
        )}
      </div>
    </form>
  );
};

export default CommonForm;