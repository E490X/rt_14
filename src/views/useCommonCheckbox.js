import React, { useRef, useState } from "react";

const useCommonCheckbox = (data, dataLogId) => {
  const [parentChecked, setParentChecked] = useState(false);
  const [childCheckedState, setChildCheckedState] = useState([]);

  // Handle parent checkbox toggle
  const handleParentCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setParentChecked(isChecked);

    // Select/deselect all child IDs based on parent checkbox
    if (isChecked) {
      setChildCheckedState(data?.map((item) => item[dataLogId])); // Select all IDs
    } else {
      setChildCheckedState([]); // Clear all selections
    }
  };

  // Handle individual child checkbox toggle
  const handleChildCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;

    setChildCheckedState((prevIds) => {
      let updatedIds;
      if (isChecked) {
        // Add the id if checked
        updatedIds = [...prevIds, id];
      } else {
        // Remove the id if unchecked
        updatedIds = prevIds.filter((item) => item !== id);
      }

      // Directly compute the parent state based on updatedIds
      const allChecked = data.every((item) =>
        updatedIds.includes(item[dataLogId])
      );
      setParentChecked(allChecked);

      return updatedIds; // Return the updated state to React
    });
  };
  return {
    childCheckedState,
    parentChecked,
    handleParentCheckboxChange,
    handleChildCheckboxChange,
    setChildCheckedState, // Optional: Expose the setter if direct manipulation is needed
    setParentChecked, // Optional: Expose the setter if direct manipulation is needed
  };
};
export default useCommonCheckbox;
