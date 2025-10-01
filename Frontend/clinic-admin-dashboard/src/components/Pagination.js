import React from "react";
import "../styles/Pagination.css";
import { useTranslation } from "react-i18next";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const { t } = useTranslation();

  return (
    <div className="pagination-controls">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        {t("previous")}
      </button>

      <span>
        {t("page")} {currentPage} {t("of")} {totalPages}
      </span>

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= totalPages} 
      >
        {t("next")}
      </button>
    </div>
  );
};

export default Pagination;
