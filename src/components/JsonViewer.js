// JsonViewer.js
import React from 'react';
import { json } from 'react-router-dom';

const JsonViewer = ({ jsonString }) => {
  let jsonData;

  try {
    jsonData = JSON.parse(jsonString);
    
  } catch (e) {
    return <pre style={{ color: 'red' }}>{jsonString}</pre>;
  }

  const formatJson = (data) => {
    return JSON.stringify(data, null, 2); // 2 spaces for indentation
  };

  return (
    <pre style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#333',
      overflowX: 'auto'
    }}>
      {formatJson(jsonData)}
    </pre>
  );
};

export default JsonViewer;
