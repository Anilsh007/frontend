import { useState, useEffect } from "react";

export default function CommonTable({
  columns,
  data = [],
  title,
  showCheckbox = false,
  onRowSelect = () => {},
  selectedRows = [],
}) {
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll && data.length > 0) {
      onRowSelect(data.map((_, index) => index)); // Select all rows
    } else if (!selectAll) {
      onRowSelect([]); // Deselect all
    }
  }, [selectAll, data]);

  const handleCheckboxChange = (index) => {
    const isSelected = selectedRows.includes(index);
    const updatedSelection = isSelected
      ? selectedRows.filter((i) => i !== index)
      : [...selectedRows, index];

    onRowSelect(updatedSelection);
  };

  return (
    <div className="mt-4 table-responsive">
      {title && <h4 className="mb-3">{title}</h4>}

      {data.length === 0 ? (
        <div className="text-muted text-center">No data found.</div>
      ) : (
        <table className="table table-striped table-bordered align-middle text-nowrap">
          <thead className="table-dark">
            <tr>
              {showCheckbox && (
                <th style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length}
                    onChange={() => setSelectAll(!selectAll)}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIdx) => (
              <tr
                key={item.id || rowIdx}
                className={selectedRows.includes(rowIdx) ? "table-primary" : ""}
              >
                {showCheckbox && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowIdx)}
                      onChange={() => handleCheckboxChange(rowIdx)}
                    />
                  </td>
                )}
                {columns.map((col) => {
                  const rawValue = item[col.key];

                  if (col.render) {
                    return (
                      <td key={col.key}>
                        {col.render(rawValue, item, rowIdx)}
                      </td>
                    );
                  }

                  if (col.type === "image") {
                    return (
                      <td key={col.key}>
                        {rawValue ? (
                          <img src={rawValue} alt={rawValue} className="table_img"/>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    );
                  }

                  if (col.type === "file") {
                    return (
                      <td key={col.key}>
                        {rawValue ? (
                          <a
                            href={rawValue}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    );
                  }

                  return (
                    <td key={col.key}>
                      {rawValue !== null &&
                      rawValue !== undefined &&
                      rawValue !== ""
                        ? String(rawValue)
                        : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
