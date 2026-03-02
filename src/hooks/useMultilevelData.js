import { useState, useEffect } from 'react';
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export const useMultilevelData = () => {
  const [level0Items, setLevel0Items] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    monday.api(`query { boards(limit: 1) { items_page(limit: 100) { items { id name column_values { id text value type } } } } }`)
      .then(res => {
        if (res.data && res.data.boards[0]) {
          const items = res.data.boards[0].items_page.items.map(item => ({
            id: item.id,
            name: item.name,
            ...item.column_values.reduce((acc, col) => ({ ...acc, [col.id]: col.text }), {})
          }));
          setLevel0Items(items);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateLevel0Item = async (itemId, data) => {
    const columnValues = JSON.stringify(data.columns);
    return monday.api(`mutation { change_multiple_column_values(item_id: ${itemId}, board_id: 0, column_values: ${JSON.stringify(columnValues)}) { id } }`);
  };

  return { level0Items, loading, error, updateLevel0Item };
};
