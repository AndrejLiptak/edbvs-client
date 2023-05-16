import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { IDevice, IUsers } from "../types";
import { useEffect, useState } from "react";
import { Button, LinearProgress, Link } from "@mui/material";
import { Enclosure, Exact, VerifyGenericMutation, useVerifyGenericMutation, useVerifyUserMutation } from "../graphql/generated";
import { OperationContext, OperationResult } from "urql";
import { Data, Variables } from "@urql/exchange-graphcache";

type Props = {
  devices: IDevice[] | Enclosure[] | undefined;
  postDevice: any
  type: string
};

export function AdminDevice({ devices, postDevice, type }: Props) {
  function handleVerify(isVerified: boolean, id: string, index: number) {
    const variables = {
      id: id,
      isVerified: !isVerified,
    };
    postDevice(variables);
    const newUsers = rows.slice();
    newUsers[index].isVerified = !isVerified;
    setRows(newUsers);
  }
  const [loading, setLoading] = useState(typeof(devices))

  const [rows, setRows] = useState(devices ?? []);

  useEffect(() => {
    if (rows.length == 0)
    setRows(devices ?? [])
  }, [devices])
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100, type: "string" },
    { field: "name", headerName: "Name", width: 200, type: "string" },
    { field: "userEmail", headerName: "Created by", width: 200, type: "string" },
    {
      field: "isVerified",
      headerName: "Verified?",
      width: 100,
      type: "boolean",
    },
    {
      field: "verify",
      headerName: "",
      sortable: false,
      hideable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() =>
              handleVerify(
                params.row.isVerified,
                params.row.id,
                rows.indexOf(params.row)
              )
            }
          >
            {params.row.isVerified ? "Unverify" : "Verify"}
          </Button>
        );
      },
    },
    ... type != "Enclosure" ? [{ field: "inputs", headerName: "Inputs", width: 70, type: "number" }] : [],
    
    ... type != "Enclosure" ? [{ field: "outputs", headerName: "Outputs", width: 70, type: "number" }] : [],
    ... type != "Enclosure" ? [{ field: "slots", headerName: "Slots", width: 70, type: "number" }] : [],
    ... type != "Enclosure" ? [{ field: "powerLoss", headerName: "Power loss", width: 100, type: "number" }] : [],
    ... type != "Enclosure" ? [{ field: "maxTemp", headerName: "Max temp", width: 100, type: "number" }] : [],
    ... type == "Enclosure" ? [{ field: "heatDissipation", headerName: "Heat dissipation", width: 150, type: "number" }] : [],
    ... type == "Enclosure" ? [{ field: "oneDINSlots", headerName: "One DIN slots", width: 150, type: "number" }] : [],
    ... type == "Enclosure" ? [{ field: "totalDIN", headerName: "Total DINs", width: 150, type: "number" }] : [],
    ... type == "CircuitBreaker" || type == "RCD"  ? [{ field: "poleCount", headerName: "Pole count", width: 150, type: "number" }] : [],
    ... type == "CircuitBreaker" || type == "RCD"  ? [{ field: "ratedCurrent", headerName: "Rated current", width: 150, type: "number" }] : [],
    ... type == "CircuitBreaker" || type == "SurgeProtector" ? [{ field: "type", headerName: "Type", width: 50, type: "string" }] : [],
    ... type == "RCD" ? [{ field: "ratedResidualCurrent", headerName: "Residual current", width: 150, type: "number" }] : [],
    ... type == "RCD" ? [{ field: "currentType", headerName: "Current type", width: 100, type: "string" }] : [],
    ... type == "RCD" ? [{ field: "breakTimeType", headerName: "Break time type", width: 150, type: "string" }] : [],
    ... type == "PLC" ? [{ field: "digitalIn", headerName: "DI", width: 50, type: "string" }] : [],
    ... type == "PLC" ? [{ field: "digitalOut", headerName: "DO", width: 50, type: "string" }] : [],
    ... type == "PLC" ? [{ field: "analogIn", headerName: "AI", width: 50, type: "string" }] : [],
    ... type == "PLC" ? [{ field: "analogOut", headerName: "AO", width: 50, type: "string" }] : [],
    { field: "link", headerName: "Link", width: 250, renderCell: (params) => (
      <Link href={params.value} target="_blank">{params.value}</Link>
    ) },
    
  ];
  
  return (    <DataGrid
      disableRowSelectionOnClick
      sx={{ overflowX: 'scroll' }}
      rows={rows}
      columns={columns}
      slots={{ toolbar: GridToolbar}}
      density="compact"
      loading = {devices === undefined}
    ></DataGrid>

  );
}
