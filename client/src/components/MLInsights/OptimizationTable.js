import React from 'react';

function OptimizationTable({ data }) {
  if (!data?.optimization) return null;

  return (
    <div className="optimization-table">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Optimal Quantity</th>
            <th>Reorder Point</th>
            <th>Safety Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.optimization.map(item => (
            <tr key={item.item_id}>
              <td>{item.name}</td>
              <td>{item.optimal_quantity}</td>
              <td>{item.reorder_point}</td>
              <td>{item.safety_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OptimizationTable; 