/**
 * Reusable Data Table Component
 * Formats any array of objects dynamically into a clean, responsive table.
 */
export default function DataTable({ title, subtitle, data, emptyMessage = 'No records found' }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        {title && <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>}
        {subtitle && <p className="text-xs text-gray-500 mb-4">{subtitle}</p>}
        <div className="text-center py-8 text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg">
          {emptyMessage}
        </div>
      </div>
    );
  }

  // Extract all unique columns from the data objects
  const columns = Array.from(
    new Set(data.flatMap((row) => (row && typeof row === 'object' ? Object.keys(row) : [])))
  );

  // Format cell values
  const formatValue = (val) => {
    if (val === null || val === undefined || val === '') {
      return <span className="text-gray-300 font-mono">—</span>;
    }
    if (typeof val === 'number') {
      // Check if float has more than 2 decimal digits
      if (!Number.isInteger(val)) {
        return val.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      return val.toLocaleString();
    }
    return String(val);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
      {/* Table Header / Title */}
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-gray-200 bg-white">
          {title && <h3 className="text-base font-bold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {/* Responsive Scrollable Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3.5 text-sm font-bold text-gray-900 whitespace-nowrap tracking-tight"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {data.map((row, idx) => {
              const isTotalRow =
                row['Service Improvement'] === 'Total' ||
                row['Service Type'] === 'Total' ||
                row['Milestone'] === 'Total';

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isTotalRow
                      ? 'bg-gray-50/80 font-bold text-gray-900 border-t-2 border-gray-300'
                      : 'hover:bg-gray-50/60'
                  }`}
                >
                  {columns.map((col) => {
                    const val = row[col];
                    const isTotalCell = isTotalRow && (col === 'Service Improvement' || col === 'Service Type');

                    return (
                      <td
                        key={col}
                        className={`px-4 py-3.5 whitespace-nowrap text-sm text-gray-800 ${
                          isTotalCell ? 'font-bold text-gray-900' : ''
                        }`}
                      >
                        {formatValue(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
