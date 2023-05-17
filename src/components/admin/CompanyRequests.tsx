import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  CompanyRequest,
  useApproveRequestMutation,
  useUserCompanyMutation,
} from "../../graphql/generated";

type Props = {
  requests: CompanyRequest[];
};

export function RequestGrid({ requests }: Props) {
  function handleApprove(userEmail: string, index: number) {
    const variables = {
      userEmail: userEmail,
    };
    const variablesuser = {
      email: userEmail,
      isCompany: true,
      companyName: requests[index].companyName,
      companyICO: requests[index].companyICO,
    };
    approveRequest(variables);
    userCompany(variablesuser);
    const newRows = rows.slice();
    newRows.splice(index, 1);
    setRows(newRows);
  }

  function handleReject(userEmail: string, index: number) {
    const variables = {
      userEmail: userEmail,
    };
    rejectRequest(variables);
    const newRows = rows.slice();
    newRows.splice(index, 1);
    setRows(newRows);
  }

  const [rows, setRows] = useState(requests);
  useEffect(() => {
    setRows(requests ?? []);
  }, [requests]);
  const columns: GridColDef[] = [
    {
      field: "userEmail",
      headerName: "User email",
      width: 350,
      type: "string",
    },
    {
      field: "companyName",
      headerName: "Company name",
      width: 350,
      type: "string",
    },
    { field: "companyICO", headerName: "ICO", width: 350, type: "number" },
    {
      field: "approve",
      headerName: "",
      sortable: false,
      hideable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() =>
              handleApprove(params.row.userEmail, rows.indexOf(params.row))
            }
          >
            Approve
          </Button>
        );
      },
    },
    {
      field: "reject",
      headerName: "",
      sortable: false,
      hideable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() =>
              handleReject(params.row.userEmail, rows.indexOf(params.row))
            }
          >
            Reject
          </Button>
        );
      },
    },
  ];
  const [approveRequestResult, approveRequest] = useApproveRequestMutation();
  const [userCompanyResult, userCompany] = useUserCompanyMutation();
  const [rejectRequestResult, rejectRequest] = useApproveRequestMutation();
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        disableRowSelectionOnClick
        getRowId={(row) => row.userEmail}
        rows={rows}
        columns={columns}
        loading={requests === undefined}
        density="compact"
        slots={{ toolbar: GridToolbar }}
      ></DataGrid>
    </div>
  );
}
