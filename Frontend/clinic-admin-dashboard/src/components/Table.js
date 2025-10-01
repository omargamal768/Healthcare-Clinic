// src/components/Table.js
import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/Table.css"; // ⬅️ Import the CSS file

const Table = ({ data, columns }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="table-empty-message">
        {t("No data found.")}
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{t(column.header)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;