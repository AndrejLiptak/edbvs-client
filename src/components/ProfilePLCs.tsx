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
  Plc,
  useDeletePlcMutation,
  usePostPlcMutation,
} from "../graphql/generated";
import "../styles/main.css";
import { allowedArray, fieldLength } from "../types";
import { CreateDeviceMessage } from "./CreateDeviceMessage";
import { Log } from "./Log";

type Props = {
  PLCs: Plc[];
  userEmail: string;
  isAdmin: boolean;
};

export function ProfilePLCs({ PLCs, userEmail, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(PLCs ?? []);
  useEffect(() => {
    if (rows.length == 0) setRows(PLCs ?? []);
  }, [PLCs]);
  const [deviceModify, setDeviceModify] = useState({
    id: "",
    name: "",
    digitalIn: "1",
    digitalOut: "1",
    analogIn: "1",
    analogOut: "1",
    slots: "1",
    powerLoss: "",
    maxTemp: "",
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

    const variables = {
      ...deviceModify,
      inputs:
        parseInt(deviceModify.analogIn) + parseInt(deviceModify.digitalIn),
      outputs:
        parseInt(deviceModify.analogOut) + parseInt(deviceModify.digitalOut),
      digitalIn: parseInt(deviceModify.digitalIn),
      digitalOut: parseInt(deviceModify.digitalOut),
      analogIn: parseInt(deviceModify.analogIn),
      analogOut: parseInt(deviceModify.analogOut),
      slots: parseInt(deviceModify.slots),
      powerLoss: parseFloat(deviceModify.powerLoss),
      maxTemp: parseFloat(deviceModify.maxTemp),
      isVerified: isAdmin,
    };
    postGenericDevice(variables).then((result) => {
      setPosting(false);
      if (!result.error) {
      
        setError(false);
        setSuccess(true);
        setDeviceModify({
          id: "",
          name: "",
          digitalIn: "1",
          digitalOut: "1",
          analogIn: "1",
          analogOut: "1",
          slots: "1",
          powerLoss: "",
          maxTemp: "",
          link: "",
          userEmail: userEmail,
        });
        if (typeof result.data !== "undefined") {
          const newDevice = result.data.postPLC;
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
      return deleteGenericDevice(variables);
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
    {
      field: "digitalIn",
      headerName: "DI",
      width: fieldLength.get("digitalIn"),
      type: "number",
    },
    {
      field: "digitalOut",
      headerName: "DO",
      width: fieldLength.get("digitalOut"),
      type: "number",
    },
    {
      field: "analogIn",
      headerName: "AI",
      width: fieldLength.get("analogIn"),
      type: "number",
    },
    {
      field: "analogOut",
      headerName: "AO",
      width: fieldLength.get("analogOut"),
      type: "number",
    },
    { field: "slots", headerName: "Slots", width: fieldLength.get("slots"), type: "number" },
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
      "DI",
      "DO",
      "AI",
      "AO",
      "Slots",
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
    const digitalIn = "DI" as ObjectKey;
    const digitalOut = "DO" as ObjectKey;
    const analogIn = "AI" as ObjectKey;
    const analogOut = "AO" as ObjectKey;
    const slots = "Slots" as ObjectKey;
    const powerLoss = "Power Loss (W)" as ObjectKey;
    const link = "Link" as ObjectKey;
    const maxTemp = "Maximum Temperature (°C)" as ObjectKey;
    var ids = [] as string[];
    var devices = [] as Plc[];
    var succDevices = [] as Plc[];
    const correcDevices: object[] = [];

    data.map((device) => {
      var correct = true;
      if (!allowedArray.includes(device[slots])) {
        correct = false;
        tempLog.push(`PLC "${device[id]}" has incorrect slots value`);
      }
      if (!allowedArray.includes(device[digitalIn])) {
        correct = false;
        tempLog.push(`PLC "${device[id]}" has incorrect digital outputs value`);
      }
      if (!allowedArray.includes(device[digitalOut])) {
        correct = false;
        tempLog.push(`PLC "${device[id]}" has incorrect digital inputs value`);
      }
      if (!allowedArray.includes(device[analogOut])) {
        correct = false;
        tempLog.push(`PLC "${device[id]}" has incorrect analog outputs value`);
      }
      if (!allowedArray.includes(device[analogIn])) {
        correct = false;
        tempLog.push(`PLC "${device[id]}" has incorrect analog inputs value`);
      }
      if (isNaN(device[powerLoss]) || Number(device[powerLoss]) < 0) {
        correct = false;
        tempLog.push(`PLC "${device[id]}" has incorrect power loss value`);
      }
      if (isNaN(device[maxTemp]) || Number(device[maxTemp]) < 0) {
        correct = false;
        tempLog.push(
          `PLC "${device[id]}" has incorrect maximum temperature value`
        );
      }
      if (correct) correcDevices.push(device);
    });

    var promises = correcDevices.map((device) => {
      const variables = {
        id: device[id],
        name: device[name],
        digitalIn: Number(device[digitalIn]),
        digitalOut: Number(device[digitalOut]),
        analogIn: Number(device[analogIn]),
        analogOut: Number(device[analogOut]),
        inputs: Number(device[digitalIn]) + Number(device[analogIn]),
        outputs: Number(device[digitalOut]) + Number(device[analogOut]),
        slots: Number(device[slots]),
        powerLoss: Number(device[powerLoss]),
        maxTemp: Number(device[maxTemp]),
        link: device[link],
        userEmail: userEmail,
        isVerified: isAdmin,
      };
      devices.push(variables);
      ids.push(device[id]);
      return postGenericDevice(variables);
    });
    var tempLog = [] as string[];

    Promise.all(promises).then((results) => {
      setUploading(false);
      setRows(PLCs);
      results.forEach((result, index) => {
        if (result.error) {
          tempLog.push(`PLC "${ids[index]}" was not posted`);
        } else {
          tempLog.push(`PLC "${ids[index]}" posted successfully`);
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
      filename: "PLCTemplate",
      title: "PLCs",
      useTextFile: false,
      useBom: true,
      headers: [
        "ID",
        "Name",
        "Power Loss (W)",
        "Maximum Temperature (°C)",
        "DI",
        "DO",
        "AI",
        "AO",
        "Slots",
        "Link"
      ],
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv([{}]);
  }
  const [postGenericDeviceResult, postGenericDevice] = usePostPlcMutation();
  const [deleteGenericDeviceResult, deleteGenericDevice] =
    useDeletePlcMutation();

 // if (uploading) return <CircularProgress></CircularProgress>;

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
        PLCs
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
            New PLC
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
              id="digitalIn"
              label="Digital inputs"
              variant="standard"
              select
              required
              onChange={handleChange}
              value={deviceModify.digitalIn}
              SelectProps={{ native: true }}
              sx={{ width: "31%", pr: 1 }}
            >
              {allowedArray.map((input) => (
                <option key={input} value={Number(input)}>
                  {input}
                </option>
              ))}
            </TextField>
            <TextField
              id="digitalOut"
              label="Digital outputs"
              variant="standard"
              required
              onChange={handleChange}
              value={deviceModify.digitalOut}
              select
              SelectProps={{ native: true }}
              sx={{ width: "31%", pr: 1 }}
            >
              {allowedArray.map((input) => (
                <option key={input} value={Number(input)}>
                  {input}
                </option>
              ))}
            </TextField>
            <TextField
              id="analogIn"
              label="Analog inputs"
              variant="standard"
              select
              required
              onChange={handleChange}
              value={deviceModify.analogIn}
              SelectProps={{ native: true }}
              sx={{ width: "31%", pr: 1 }}
            >
              {allowedArray.map((input) => (
                <option key={input} value={Number(input)}>
                  {input}
                </option>
              ))}
            </TextField>
          </div>
          <div className="section">
            <TextField
              id="analogOut"
              label="Analog outputs"
              variant="standard"
              required
              onChange={handleChange}
              value={deviceModify.analogOut}
              select
              SelectProps={{ native: true }}
              sx={{ width: "31%", pr: 1 }}
            >
              {allowedArray.map((input) => (
                <option key={input} value={Number(input)}>
                  {input}
                </option>
              ))}
            </TextField>
            <TextField
              id="slots"
              label="Slots"
              variant="standard"
              required
              onChange={handleChange}
              value={deviceModify.slots}
              select
              SelectProps={{ native: true }}
              sx={{ width: "31%" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
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
            sx={{ mt: 3 }}
            type="submit"
            variant="contained"
            disabled={posting}
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
          loading={PLCs === undefined || uploading}
          slots={{ toolbar: GridToolbar }}
          density="compact"
        ></DataGrid>
      </div>
    </>
  );
}
