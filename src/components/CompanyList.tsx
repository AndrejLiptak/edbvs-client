import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { IUsers } from "../types";
import { useState } from "react";
import { Button } from "@mui/material";
import { useVerifyUserMutation } from "../graphql/generated";

type Props = {
  users: IUsers[];
};

export function CompanyGrid({ users }: Props) {
  

  const [rows, setRows] = useState(users);
  const columns: GridColDef[] = [
    { field: "email", headerName: "User Email", width: 350, type: "string" },
    { field: "name", headerName: "User name", width: 350, type: "string" },
    { field: "companyName", headerName: "Company name", width: 350, type: "string" },
    { field: "companyICO", headerName: "ICO", width: 350, type: "string" },


  ];
  return (
    <div style={{ height: "100%", width: "100%" }}>
    <DataGrid
      disableRowSelectionOnClick
      sx={{ overflowX: 'scroll' }}
      getRowId={(row) => row.email}
      rows={rows}
      columns={columns}
      slots={{ toolbar: GridToolbar }}
    ></DataGrid>
    </div>
  );
}
