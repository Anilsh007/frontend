export default function CommonTable({ columns, data = [], title }) {
  return (
    <div className="mt-4">
      {title && <h4 className="mb-3">{title}</h4>}

      {data.length === 0 ? (
        <div className="text-muted text-center">No data found.</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIdx) => (
              <tr key={item.id || rowIdx}>
                {columns.map((col) => {
                  const rawValue = item[col.key];

                  // Handle custom render
                  if (col.render) {
                    return (
                      <td key={col.key}>
                        {col.render(rawValue, item)}
                      </td>
                    );
                  }

                  // Handle image
                  if (col.type === "image") {
                    return (
                      <td key={col.key}>
                        {rawValue ? (
                          <img
                            src={rawValue}
                            alt=""
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                    );
                  }

                  // Handle file
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

                  // Default
                  return (
                    <td key={col.key}>
                      {rawValue !== null && rawValue !== undefined && rawValue !== ""
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
