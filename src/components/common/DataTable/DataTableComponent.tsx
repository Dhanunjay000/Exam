import React from 'react';
import { TableColumn } from 'react-data-table-component';
import DataTable from 'react-data-table-component';
import styles from './DataTableComponent.module.css';
import { CSVLink } from 'react-csv'; 
interface DataTableProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  onRowClicked?: (row: T) => void;
  handleSearch?: (searchText: string) => void;
}

const DataTableComponent = <T,>({
  title,
  columns,
  data,
  onRowClicked,
  handleSearch,
}: DataTableProps<T>) => {
  const [searchText, setSearchText] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (handleSearch) {
      handleSearch(e.target.value);
    }
  };

  const csvData = data.map(item => {
    const csvItem: Record<string, any> = {};
    columns.forEach(column  => {
      if (typeof column.selector === 'function' && column.name) {
        csvItem[column.name as string] = column.selector(item);
      }
    });
    return csvItem;
  });

  const customStyles : any = {
    table: {
      style: {
        backgroundColor: 'transparent',
        padding: '0.5rem',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        borderBottomWidth: '1px',
        borderBottomColor: '#e9ecef',
        borderBottomStyle: 'solid',
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        minHeight: '50px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        '&:hover': {
          color: '#4e73df',
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        fontSize: '0.875rem',
        wordBreak: 'break-word',
      },
    },
    rows: {
      style: {
        backgroundColor: '#fff',
        borderBottomWidth: '1px',
        borderBottomColor: '#e9ecef',
        borderBottomStyle: 'solid',
        minHeight: '50px',
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#e9ecef',
          borderBottomStyle: 'solid',
        },
        '&:hover': {
          backgroundColor: '#f8f9fa',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
        },
      },
      stripedStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#fff',
        borderTopWidth: '1px',
        borderTopColor: '#e9ecef',
        borderTopStyle: 'solid',
        padding: '1rem',
      },
      pageButtonsStyle: {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        padding: '8px',
        margin: '0 4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: 'transparent',
        '&:disabled': {
          cursor: 'not-allowed',
        },
        '&:hover:not(:disabled)': {
          backgroundColor: '#4e73df',
          color: '#fff',
        },
        '&:focus': {
          outline: 'none',
          backgroundColor: '#4e73df',
          color: '#fff',
        },
      },
    },
    noData: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#fff',
        color: '#6c757d',
        fontSize: '1rem',
      },
    },
  };

  return (
    <div className={styles.tableContainer}>
    <div className={styles.tableHeader}>
      <h3>{title}</h3>
      <div className={styles.headerActions}>
        {handleSearch && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        )}
        <CSVLink
          data={csvData}
          filename={`Previous_Exam.csv`}
          className={styles.exportButton}
        >
          Export CSV
        </CSVLink>
      </div>
    </div>
    <DataTable
      className={styles.dataTable}
      columns={columns}
      data={data}
      pagination
      highlightOnHover  
      responsive
      dense
      onRowClicked={onRowClicked}
      paginationComponentOptions={{
        rowsPerPageText: 'Rows per page:',
        rangeSeparatorText: 'of',
        noRowsPerPage: false,
        selectAllRowsItem: false,
        selectAllRowsItemText: 'All',
      }}
      customStyles={customStyles}
    />
  </div>
  );
};

export default DataTableComponent;