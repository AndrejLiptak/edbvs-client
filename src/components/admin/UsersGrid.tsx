import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { IUsers } from "../../types";

type Props = {
  users: IUsers[];
};

export function UsersGrid({ users }: Props) {
  const [rows, setRows] = useState(users ?? []);
  useEffect(() => {
    setRows(users ?? []);
  }, [users]);
  const columns: GridColDef[] = [
    { field: "email", headerName: "User Email", width: 350, type: "string" },
    { field: "name", headerName: "User name", width: 350, type: "string" },
    {
      field: "companyName",
      headerName: "Company Name",
      width: 350,
      type: "string",
    },
    {
      field: "companyICO",
      headerName: "Company ICO",
      width: 350,
      type: "string",
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        disableRowSelectionOnClick
        getRowId={(row) => row.email}
        density="compact"
        rows={rows}
        columns={columns}
        loading={users === undefined}
        slots={{ toolbar: GridToolbar }}
      ></DataGrid>
    </div>
  );
}
