import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";
import Papa from "papaparse";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Rcd,
  useDeleteRcdMutation,
  usePostRcdMutation,
} from "../graphql/generated";
import "../styles/createDevice.css";
import "../styles/main.css";
import { CreateDeviceMessage } from "./CreateDeviceMessage";
import { Log } from "./Log";
import { fieldLength } from "../types";
type Props = {
  RCDs: Rcd[];
  userEmail: string;
  isAdmin: boolean;
};

export function ProfileRCD({ RCDs, userEmail, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(RCDs ?? []);
  useEffect(() => {
    if (rows.length == 0) setRows(RCDs ?? [])
  },[RCDs])
  const [deviceModify, setDeviceModify] = useState({
    id: "",
    name: "",
    powerLoss: "",
    maxTemp: "",
    currentType: "AC",
    breakTimeType: "G",
    ratedCurrent: "",
    ratedResidualCurrent: "",
    poleCount: "2",
    link: "",
    userEmail: userEmail,
  });

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [posting, setPosting] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [uploading, setUploading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    setDeviceModify({...deviceModify, userEmail: userEmail})
  }, [userEmail])
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPosting(false);
    setSuccess(false);
    setError(false);
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPosting(true);
    setSuccess(false);
    var inputs = "";
    var outputs = "";
    var slots = "";
    switch (deviceModify.poleCount) {
      case "2":
        inputs = "1";
        outputs = "1";
        slots = "2";
        break;
      case "4":
        inputs = "3";
        outputs = "3";
        slots = "4";
        break;
    }
    const variables = {
      ...deviceModify,
      inputs: parseInt(inputs),
      outputs: parseInt(outputs),
      slots: parseInt(slots),
      powerLoss: parseFloat(deviceModify.powerLoss),
      maxTemp: parseFloat(deviceModify.maxTemp),
      ratedCurrent: parseInt(deviceModify.ratedCurrent),
      ratedResidualCurrent: parseFloat(deviceModify.ratedResidualCurrent),
      isVerified: isAdmin,
    };


    postRCD(variables).then((result) => {
      setPosting(false);
      if (!result.error) {
        setError(false);
        setSuccess(true);
        setDeviceModify({
          id: "",
          name: "",
          powerLoss: "",
          maxTemp: "",
          currentType: "AC",
          breakTimeType: "G",
          ratedCurrent: "",
          ratedResidualCurrent: "",
          poleCount: "2",
          link: "",
          userEmail: userEmail,
        });
        if (typeof result.data !== "undefined") {
          const newDevice = result.data.postRCD;
          setRows((current) => [...current, newDevice]);
        }
      } else {
        setError(true);
      }
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    let value: (typeof deviceModify)[keyof typeof deviceModify] =
      event.target.value;
    setDeviceModify({ ...deviceModify, [event.target.id]: value });
  }

  function deleteMany() {
    var promises = rowSelectionModel.map((device) => {
      const variables = {
        id: device.toString(),
      };
      return deleteRCD(variables);
    });
    Promise.all(promises).then((results) => {});
    const selectedIDs = new Set(rowSelectionModel);
    setRows((r) => r.filter((x) => !selectedIDs.has(x.id)));
  }

  const columns: GridColDef[] = [
    {
      field: "delete",
      hideable: false,
      sortable: false,
      disableExport: true,
      width: fieldLength.get("delete"),
      disableColumnMenu: true,
      renderHeader: () => {
        return rowSelectionModel.length > 0 ? (
          <IconButton
            onClick={() => {
              deleteMany();
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : (
          <></>
        );
      },
    },
    {
      field: "id",
      headerName: "ID",
      width: fieldLength.get("id"),
      type: "string",
      hideable: false,
    },
    { field: "name", headerName: "Name", width: fieldLength.get("name"), type: "string" },
    {
      field: "poleCount",
      headerName: "Pole Count",
      width: fieldLength.get("poleCount"),
      type: "string",
    },
    {
      field: "ratedCurrent",
      headerName: "Rated Current (A)",
      width: fieldLength.get("ratedCurrent"),
      type: "number",
    },
    {
      field: "ratedResidualCurrent",
      headerName: "Rated Residual Current (mA)",
      width: fieldLength.get("ratedResidualCurrent"),
      type: "number",
    },
    {
      field: "currentType",
      headerName: "Current Type",
      width: fieldLength.get("currentType"),
      type: "string",
    },
    {
      field: "breakTimeType",
      headerName: "Break Time Type",
      width: fieldLength.get("breakTimeType"),
      type: "string",
    },
    {
      field: "powerLoss",
      headerName: "Power Loss (W)",
      width: fieldLength.get("powerLoss"),
      type: "number",
    },

    {
      field: "maxTemp",
      headerName: "Maximum Temperature (°C)",
      width: fieldLength.get("maxTemp"),
      type: "number",
    },
    { field: "link", headerName: "Link", width: fieldLength.get("link"), renderCell: (params) => (
      <Link href={params.value} target="_blank">{params.value}</Link>
    ) },
    
  ];

  function checkCorrectFile(data: object) {
    if (!data) return false;
    const keys = Object.keys(data);
    const expected = [
      "ID",
      "Name",
      "Power Loss (W)",
      "Maximum Temperature (°C)",
      "Rated Current (A)",
      "Rated Residual Current (mA)",
      "Current Type",
      "Pole Count",
      "Break Time Type",
      "Link"
    ];
    if (keys.length != 10) return false;
    const hasAllValues = keys.every((value) => expected.includes(value));
    return hasAllValues;
  }

  function postMany(data: [object]) {
    type ObjectKey = keyof (typeof data)[0];
    const id = "ID" as ObjectKey;
    const name = "Name" as ObjectKey;
    const powerLoss = "Power Loss (W)" as ObjectKey;
    const maxTemp = "Maximum Temperature (°C)" as ObjectKey;
    const ratedCurrent = "Rated Current (A)" as ObjectKey;
    const currentType = "Current Type" as ObjectKey;
    const ratedResidualCurrent = "Rated Residual Current (mA)" as ObjectKey;
    const breakTimeType = "Break Time Type" as ObjectKey;
    const poleCount = "Pole Count" as ObjectKey;
    const link = "Link" as ObjectKey;
    var ids = [] as string[];
    var devices = [] as Rcd[];
    var succDevices = [] as Rcd[];

    var inputs = "";
    var outputs = "";
    var slots = "";

    const correcDevices: object[] = [];

    data.map((device) => {
      var correct = true;
      if (!["2", "4"].includes(device[poleCount])) {
        correct = false;
        tempLog.push(`RCD "${device[id]}" has incorrect pole count value`);
      }
      if (!["AC", "A", "F", "B", "B+"].includes(device[currentType])) {
        correct = false;
        tempLog.push(`RCD "${device[id]}" has incorrect current type value`);
      }
      if (!["G", "S"].includes(device[breakTimeType])) {
        correct = false;
        tempLog.push(`RCD "${device[id]}" has incorrect break time type value`);
      }
      if (isNaN(device[ratedCurrent]) || Number(device[ratedCurrent]) < 0) {
        correct = false;
        tempLog.push(`RCD "${device[id]}" has incorrect rated current value`);
      }

      if (
        isNaN(device[ratedResidualCurrent]) ||
        Number(device[ratedResidualCurrent]) < 0
      ) {
        correct = false;
        tempLog.push(
          `RCD "${device[id]}" has incorrect rated residual current value`
        );
      }
      if (isNaN(device[powerLoss]) || Number(device[powerLoss]) < 0) {
        correct = false;
        tempLog.push(`RCD "${device[id]}" has incorrect power loss value`);
      }
      if (isNaN(device[maxTemp]) || Number(device[maxTemp]) < 0) {
        correct = false;
        tempLog.push(
          `RCD "${device[id]}" has incorrect maximum temperature value`
        );
      }
      if (correct) correcDevices.push(device);
    });

    var promises = correcDevices.map((device) => {
      switch (device[poleCount]) {
        case "2":
          inputs = "1";
          outputs = "1";
          slots = "2";
          break;
        case "4":
          inputs = "3";
          outputs = "3";
          slots = "4";
          break;
      }

      const variables = {
        id: device[id],
        name: device[name],
        inputs: Number(inputs),
        outputs: Number(outputs),
        slots: Number(slots),
        powerLoss: Number(device[powerLoss]),
        maxTemp: Number(device[maxTemp]),
        currentType: device[currentType],
        poleCount: device[poleCount],
        ratedCurrent: Number(device[ratedCurrent]),
        ratedResidualCurrent: Number(device[ratedResidualCurrent]),
        breakTimeType: device[breakTimeType],
        link: device[link],
        userEmail: userEmail,
        isVerified: isAdmin,
      };
      devices.push(variables);
      ids.push(device[id]);
      return postRCD(variables);
    });
    var tempLog = [] as string[];

    Promise.all(promises).then((results) => {
      setUploading(false);
      setRows(RCDs);
      results.forEach((result, index) => {
        if (result.error) {
          tempLog.push(`RCD "${ids[index]}" was not posted`);
        } else {
          tempLog.push(`RCD "${ids[index]}" posted successfully`);
          succDevices.push(devices[index]);
        }
      });

      setLog([...log, ...tempLog]);
      setRows([...rows, ...succDevices]);
    });
  }

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const name = event.target.files[0]?.name;
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data as [object];
          if (!data[0]) {
            setLog([...log, `File "${name}" does not have any devices`]);
            return;
          }
          if (!checkCorrectFile(data[0])) {
            setLog([
              ...log,
              `Incorrect file format of file "${name}" , check the template`,
            ]);
            return;
          }
          setLog([...log, `File "${name}" imported succesfully`]);
          setUploading(true);
          postMany(data);
        },
      });
    }
  };
  function downloadTemplate() {
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      filename: "RCDsTemplate",
      title: "RCDs",
      useTextFile: false,
      useBom: true,
      headers: [
        "ID",
        "Name",
        "Rated Current (A)",
        "Rated Residual Current (mA)",
        "Current Type",
        "Pole Count",
        "Break Time Type",
        "Power Loss (W)",
        "Maximum Temperature (°C)",
        "Link"
      ],
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv([{}]);
  }
  const [postRCDResult, postRCD] = usePostRcdMutation();
  const [deleteRCDResult, deleteRCD] = useDeleteRcdMutation();

//  if (uploading) return <CircularProgress></CircularProgress>;

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
        RCDs
        <Button onClick={handleOpen}>Create</Button>
        <Button onClick={downloadTemplate}>Download CSV template</Button>
        <Button component="label">
          Upload File
          <input type="file" accept=".csv" hidden onChange={uploadFile} />
        </Button>
        <Log log={log}></Log>
      </Typography>

      <Modal open={open} onClose={handleClose}>
        <Box component="form" className="CreateBox" onSubmit={handleSubmit}>
          <CreateDeviceMessage
            error={error}
            id={deviceModify.id}
            success={success}
          ></CreateDeviceMessage>

          <Typography variant="h6">
            New RCD
            <IconButton
              onClick={handleClose}
              sx={{ position: "fixed", right: "5%" }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <div>
            <TextField
              id="id"
              label="ID"
              variant="standard"
              required
              sx={{ pr: 1, width: "30%" }}
              onChange={handleChange}
              value={deviceModify.id}
              InputProps={{ inputProps: { autoComplete: "off" } }}
            />
            <TextField
              id="name"
              label="Name"
              variant="standard"
              required
              sx={{ width: "68%" }}
              onChange={handleChange}
              value={deviceModify.name}
              InputProps={{ inputProps: { autoComplete: "off" } }}
            />
          </div>
          <div className="section">
            <TextField
              id="ratedCurrent"
              label="Rated Current"
              variant="standard"
              required
              onChange={handleChange}
              value={deviceModify.ratedCurrent}
              type="number"
              sx={{ pr: 1, width: "40%" }}
              InputProps={{
                inputProps: { min: 1, step: 1, autoComplete: "off" },
                endAdornment: <InputAdornment position="end">A</InputAdornment>,
              }}
            />
            <TextField
              id="ratedResidualCurrent"
              label="Rated Residual Current"
              variant="standard"
              required
              sx={{ width: "58%" }}
              onChange={handleChange}
              value={deviceModify.ratedResidualCurrent}
              type="number"
              InputProps={{
                inputProps: { min: 1, step: 1, autoComplete: "off" },
                endAdornment: (
                  <InputAdornment position="end">mA</InputAdornment>
                ),
              }}
            />
          </div>
          <div className="section">
            <TextField
              id="poleCount"
              label="Pole Count"
              variant="standard"
              select
              required
              onChange={handleChange}
              value={deviceModify.poleCount}
              SelectProps={{ native: true }}
              sx={{ width: "31%", pr: 1 }}
            >
              {["2", "4"].map((input) => (
                <option key={input} value={input}>
                  {input}
                </option>
              ))}
            </TextField>
            <TextField
              id="currentType"
              label="Current Type"
              variant="standard"
              select
              required
              onChange={handleChange}
              value={deviceModify.currentType}
              SelectProps={{ native: true }}
              sx={{ width: "31%", pr: 1 }}
            >
              {["AC", "A", "F", "B", "B+"].map((input) => (
                <option key={input} value={input}>
                  {input}
                </option>
              ))}
            </TextField>
            <TextField
              id="breakTimeType"
              label="Break Time Type"
              variant="standard"
              select
              required
              onChange={handleChange}
              value={deviceModify.breakTimeType}
              SelectProps={{ native: true }}
              sx={{ width: "34%" }}
            >
              {["G", "S", " "].map((input) => (
                <option key={input} value={input}>
                  {input}
                </option>
              ))}
            </TextField>
          </div>

          <div className="section">
            <TextField
              id="powerLoss"
              label="Power Loss"
              variant="standard"
              required
              onChange={handleChange}
              value={deviceModify.powerLoss}
              type="number"
              sx={{ pr: 1 }}
              InputProps={{
                inputProps: { min: 0, step: 0.01, autoComplete: "off" },
                endAdornment: (
                  <InputAdornment position="start">W</InputAdornment>
                ),
              }}
            />
            <TextField
              id="maxTemp"
              label="Maximum Temperature"
              variant="standard"
              required
              onChange={handleChange}
              value={deviceModify.maxTemp}
              type="number"
              InputProps={{
                inputProps: { min: 0, step: 0.01, autoComplete: "off" },
                endAdornment: (
                  <InputAdornment position="start">°C</InputAdornment>
                ),
              }}
            />
          </div>
          <div className="section">
            <TextField
              id="link"
              label="Link"
              variant="standard"
              onChange={handleChange}
              value={deviceModify.link}
              type="string"
              sx={{ width: '100%' }}
            
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            disabled={posting}
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(ids) => {
            setRowSelectionModel(ids);
          }}
          loading = {RCDs === undefined || uploading}
          slots={{ toolbar: GridToolbar }}
          density="compact"
        ></DataGrid>
      </div>
    </>
  );
}
