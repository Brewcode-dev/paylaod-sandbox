"use client"

import { useEffect } from 'react'

export const PhotosListStyles: React.FC = () => {
  useEffect(() => {
    // Add custom styles for Photos collection
    const style = document.createElement('style')
    style.textContent = `
      /* Photos Collection Custom Styles */
      [data-payload-collection="photos"] {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }

      [data-payload-collection="photos"] .payload-admin__list {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        margin: 20px;
        padding: 20px;
      }

      [data-payload-collection="photos"] .payload-admin__list-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 8px 8px 0 0;
        padding: 20px;
        margin: -20px -20px 20px -20px;
      }

      [data-payload-collection="photos"] .payload-admin__list-header h1 {
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
      }

      [data-payload-collection="photos"] .payload-admin__list-table {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      [data-payload-collection="photos"] .payload-admin__list-table thead {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
      }

      [data-payload-collection="photos"] .payload-admin__list-table th {
        color: white;
        font-weight: 600;
        padding: 12px 16px;
        border: none;
      }

      [data-payload-collection="photos"] .payload-admin__list-table tbody tr {
        transition: all 0.2s ease;
        border-bottom: 1px solid #f0f0f0;
      }

      [data-payload-collection="photos"] .payload-admin__list-table tbody tr:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      [data-payload-collection="photos"] .payload-admin__list-table tbody tr:hover td {
        color: white;
      }

      [data-payload-collection="photos"] .payload-admin__list-table td {
        padding: 12px 16px;
        border: none;
        transition: color 0.2s ease;
      }

      /* Pagination styles */
      [data-payload-collection="photos"] .payload-admin__pagination {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        padding: 16px;
        margin-top: 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      [data-payload-collection="photos"] .payload-admin__pagination button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 16px;
        margin: 0 4px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      [data-payload-collection="photos"] .payload-admin__pagination button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      [data-payload-collection="photos"] .payload-admin__pagination button:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      /* Search and filter styles */
      [data-payload-collection="photos"] .payload-admin__search {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      [data-payload-collection="photos"] .payload-admin__search input {
        border: 2px solid #e0e0e0;
        border-radius: 6px;
        padding: 8px 12px;
        transition: border-color 0.2s ease;
      }

      [data-payload-collection="photos"] .payload-admin__search input:focus {
        border-color: #667eea;
        outline: none;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      /* Empty state */
      [data-payload-collection="photos"] .payload-admin__list-empty {
        text-align: center;
        padding: 60px 20px;
        color: #666;
      }

      [data-payload-collection="photos"] .payload-admin__list-empty::before {
        content: "📷";
        font-size: 3rem;
        display: block;
        margin-bottom: 16px;
      }

      /* Loading state */
      [data-payload-collection="photos"] .payload-admin__loading {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px 20px;
      }

      [data-payload-collection="photos"] .payload-admin__loading::after {
        content: "";
        width: 32px;
        height: 32px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Responsive design */
      @media (max-width: 768px) {
        [data-payload-collection="photos"] .payload-admin__list {
          margin: 10px;
          padding: 15px;
        }

        [data-payload-collection="photos"] .payload-admin__list-table {
          font-size: 0.9rem;
        }

        [data-payload-collection="photos"] .payload-admin__list-table th,
        [data-payload-collection="photos"] .payload-admin__list-table td {
          padding: 8px 12px;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        [data-payload-collection="photos"] .payload-admin__list {
          background: rgba(30, 30, 30, 0.95);
          color: white;
        }

        [data-payload-collection="photos"] .payload-admin__list-table tbody tr {
          border-bottom: 1px solid #404040;
        }

        [data-payload-collection="photos"] .payload-admin__search {
          background: rgba(30, 30, 30, 0.9);
        }

        [data-payload-collection="photos"] .payload-admin__search input {
          background: #404040;
          color: white;
          border-color: #555;
        }

        [data-payload-collection="photos"] .payload-admin__pagination {
          background: rgba(30, 30, 30, 0.9);
        }
      }
    `

    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}

// Add default export for Payload admin system
export default PhotosListStyles 