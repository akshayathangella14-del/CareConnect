import { createElement, isValidElement } from 'react';
import styles from './DataTable.module.css';

const renderCellValue = (value) => {
  if (isValidElement(value) || value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'function') {
    return createElement(value);
  }

  if (typeof value === 'object') {
    if (value.$$typeof && value.render) {
      return createElement(value);
    }

    return Object.keys(value).length > 0 ? JSON.stringify(value) : '';
  }

  return value;
};

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
          {data.map((row, rowIndex) => (
            <tr
              key={row?.[keyField] || row?._id || `row-${rowIndex}`}
              className={`${styles.tr} ${onRowClick ? styles['tr--clickable'] : ''}`}
              onClick={(event) => handleRowClick(event, row)}
            >
              {columns.map((col, index) => (
                <td
                  key={col.key || index}
                  className={`${styles.td} ${col.align === 'right' ? styles['td--right'] : ''}`}
                  data-label={col.header} // For mobile card view
                >
                  <div className={styles.cellContent}>
                    {renderCellValue(col.render ? col.render(row) : row?.[col.key])}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
