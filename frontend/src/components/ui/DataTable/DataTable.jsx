import styles from './DataTable.module.css';

/**
 * DataTable Component
 * A responsive table that converts to a card-based layout on mobile.
 */
export function DataTable({ columns, data, keyField = 'id', onRowClick, emptyMessage = 'No data available' }) {
  const handleRowClick = (event, row) => {
    if (!onRowClick) return;

    const interactiveElement = event.target.closest(
      'a, button, input, select, textarea, [role="button"], [data-row-action]'
    );

    if (interactiveElement) return;

    onRowClick(row);
  };

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col, index) => (
              <th key={col.key || index} className={`${styles.th} ${col.align === 'right' ? styles['th--right'] : ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row) => (
            <tr
              key={row[keyField] || Math.random()}
              className={`${styles.tr} ${onRowClick ? styles['tr--clickable'] : ''}`}
              onClick={(event) => handleRowClick(event, row)}
            >
              {columns.map((col, index) => (
                <td
                  key={col.key || index}
                  className={`${styles.td} ${col.align === 'right' ? styles['td--right'] : ''}`}
                  data-label={col.header} // For mobile card view
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
