import { useState, useEffect } from 'react';
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export const useMultilevelData = () => {
  const [level0Items, setLevel0Items] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Hämta alla Level 0 Items (Companies) när appen startar
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await monday.api(`
          query {
            boards(limit: 1) {
              id
              items_page(limit: 100) {
                items {
                  id
                  name
                }
              }
            }
          }
        `);
        
        if (response.data && response.data.boards[0]) {
          setLevel0Items(response.data.boards[0].items_page.items);
        }
      } catch (err) {
        setError("Kunde inte ladda huvudartiklar");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Hämta en specifik Level 0 med dess Subitems (L1) och Sub-subitems (L2)
  const fetchItemWithSubitems = async (itemId) => {
    try {
      // Vi hämtar L1 och kollar rLocation-kolumnen (byt ut 'rLocation' mot ditt faktiska Column ID om det heter nåt annat)
      const response = await monday.api(`
        query {
          items(ids: [${itemId}]) {
            id
            name
            column_values { id text }
            subitems {
              id
              name
              column_values { id text value }
              subitems {
                id
                name
                column_values { id text value }
              }
            }
          }
        }
      `);

      const item = response.data.items[0];
      
      // Filtrera L1 subitems så vi bara behåller de som har rLocation === "Ja"
      // OBS: Kolla i din board om kolumnen heter "r_location" eller liknande i API:et
      const filteredSubitems = (item.subitems || []).filter(sub => {
        const locCol = sub.column_values.find(c => c.id.includes("r_location") || c.id === "status"); 
        return locCol?.text === "Ja";
      });

      return { ...item, subitems: filteredSubitems };
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  };

  // 3. Uppdatera kolumner (Universal för alla nivåer)
  const updateGenericItem = async (itemId, columnValues) => {
    try {
      return await monday.api(`
        mutation {
          change_multiple_column_values(
            item_id: ${itemId}, 
            board_id: 0, 
            column_values: ${JSON.stringify(JSON.stringify(columnValues))}
          ) {
            id
          }
        }
      `);
    } catch (err) {
      console.error("Update error:", err);
      throw err;
    }
  };

  // Mappa de gamla funktionsnamnen så att din MultilevelForm.jsx inte går sönder
  const updateLevel0Item = (id, data) => updateGenericItem(id, data.columns);
  const updateSubitem = (parentId, subitemId, data) => updateGenericItem(subitemId, data.columns);

  return {
    level0Items,
    loading,
    error,
    fetchItemWithSubitems,
    updateSubitem,
    updateLevel0Item
  };
};
