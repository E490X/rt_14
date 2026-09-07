import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";

function CustomDataGridTable({
  columns,
  rows,
  pagination,
  rowCount,
  hideFooter,
  onPaginationModelChange,
  paginationModel
}) {
  function CustomNoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        No data to display
      </Stack>
    );
  }
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pagination={pagination}
      rowCount={rowCount}
      disableColumnMenu={true}
      disableRowSelector={true}
      disableSelectionOnClick={true}
      paginationMode="server"
      hideFooter={hideFooter}
      pageSizeOptions={[10]}
      onPaginationModelChange={onPaginationModelChange}
      paginationModel={paginationModel}
      sortingMode="client"
      slots={{
        noRowsOverlay: CustomNoRowsOverlay,
      }}
    />
  );
}

export default CustomDataGridTable;
