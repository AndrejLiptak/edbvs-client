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
  SurgeProtector,
  useDeleteSurgeProtectorMutation,
  usePostSurgeProtectorMutation,
} from "../graphql/generated";
import "../styles/createDevice.css";
import "../styles/main.css";
import { allowedArray, fieldLength } from "../types";
import { CreateDeviceMessage } from "./CreateDeviceMessage";
import { Log } from "./Log";

type Props = {
  surgeProtectors: SurgeProtector[];
  userEmail: string;
  isAdmin: boolean;
};

export function ProfileSurgeProtectors({
  surgeProtectors,
  userEmail,
  isAdmin,
}: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(surgeProtectors ?? []);
  useEffect(() => {
    if (rows.length == 0) setRows(surgeProtectors ?? [])
  },[surgeProtectors])
  const [deviceModify, setDeviceModify] = useState({
    id: "",
    name: "",
    inputs: "1",
    outputs: "1",
    type: "B",
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
      inputs: parseInt(deviceModify.inputs),
      outputs: parseInt(deviceModify.outputs),
      slots: parseInt(deviceModify.slots),
      powerLoss: parseFloat(deviceModify.powerLoss),
      maxTemp: parseFloat(deviceModify.maxTemp),
      isVerified: isAdmin,
    };

    postSurgeProtector(variables).then((result) => {
      setPosting(false);
      if (!result.error) {
        setError(false);
        setSuccess(true);
        setDeviceModify({
          id: "",
          name: "",
          inputs: "1",
          outputs: "1",
          type: "B",
          slots: "1",
          powerLoss: "",
          maxTemp: "",
          link: "",
          userEmail: userEmail,
        });
        if (typeof result.data !== "undefined") {
          const newDevice = result.data.postSurgeProtector;
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
      return deleteSurgeProtector(variables);
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
    { field: "type", headerName: "Type", width: fieldLength.get("type"), type: "string" },
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
    { field: "inputs", headerName: "Inputs", width: fieldLength.get("inputs"), type: "number" },
    { field: "outputs", headerName: "Outputs", width: fieldLength.get("outputs"), type: "number" },
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
      "Type",
      "Maximum Temperature (°C)",
      "Inputs",
      "Outputs",
      "Slots",
      "Link"
    ];
    if (keys.length != 9) return false;
    const hasAllValues = keys.every((value) => expected.includes(value));
    return hasAllValues;
  }

  function postMany(data: [object]) {
    type ObjectKey = keyof (typeof data)[0];
    const id = "ID" as ObjectKey;
    const name = "Name" as ObjectKey;
    const inputs = "Inputs" as ObjectKey;
    const outputs = "Outputs" as ObjectKey;
    const type = "Type" as ObjectKey;
    const link = "Link" as ObjectKey;
    const slots = "Slots" as ObjectKey;
    const powerLoss = "Power Loss (W)" as ObjectKey;
    const maxTemp = "Maximum Temperature (°C)" as ObjectKey;
    var ids = [] as string[];
    var devices = [] as SurgeProtector[];
    var succDevices = [] as SurgeProtector[];

    const correcDevices: object[] = [];
    var tempLog = [] as string[];
    data.map((device) => {
      var correct = true;
      if (!allowedArray.includes(device[slots])) {
        correct = false;
        tempLog.push(
          `Surge protector "${device[id]}" has incorrect slots value`
        );
      }
      if (!allowedArray.includes(device[outputs])) {
        correct = false;
        tempLog.push(
          `Surge protector "${device[id]}" has incorrect outputs value`
        );
      }
      if (!allowedArray.includes(device[inputs])) {
        correct = false;
        tempLog.push(
          `Surge protector "${device[id]}" has incorrect inputs value`
        );
      }
      if (isNaN(device[powerLoss]) || Number(device[powerLoss]) < 0) {
        correct = false;
        tempLog.push(
          `Surge protector "${device[id]}" has incorrect power loss value`
        );
      }
      if (isNaN(device[maxTemp]) || Number(device[maxTemp]) < 0) {
        correct = false;
        tempLog.push(
          `Surge protector "${device[id]}" has incorrect maximum temperature value`
        );
      }
      if (!["B","C","D","B+C","B+C+D","C+D"].includes(device[type])) {
        console.log(device[type])
        correct = false;
        tempLog.push(
          `Surge protector "${device[id]}" has incorrect type value`
        );
      }
      if (String(device[id]).length > 10) {
        correct = false;
        tempLog.push(
          `Surge protector "${device[id]}" has id value too long`
        );
      }
      if (String(device[name]).length > 40) {
        correct = false;
        tempLog.push(
          `Surge protector"${device[id]}" has name value too long`
        );
      }
      if (correct) correcDevices.push(device);
    });

    var promises = correcDevices.map((device) => {
      const variables = {
        id: device[id],
        name: device[name],
        type: device[type],
        inputs: Number(device[inputs]),
        outputs: Number(device[outputs]),
        slots: Number(device[slots]),
        powerLoss: Number(device[powerLoss]),
        maxTemp: Number(device[maxTemp]),
        link: device[link],
        userEmail: userEmail,
        isVerified: isAdmin,
      };
      devices.push(variables);
      ids.push(device[id]);
      return postSurgeProtector(variables);
    });
    

    Promise.all(promises).then((results) => {
      setUploading(false);
      setRows(surgeProtectors);
      results.forEach((result, index) => {
        if (result.error) {
          tempLog.push(`Surge Protector "${ids[index]}" was not posted`);
        } else {
          tempLog.push(`Surge Protector "${ids[index]}" posted successfully`);
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
      filename: "surgeProtectorsTemplate",
      title: "SurgeProtectors",
      useTextFile: false,
      useBom: true,
      headers: [
        "ID",
        "Name",
        "Type",
        "Power Loss (W)",
        "Maximum Temperature (°C)",
        "Inputs",
        "Outputs",
        "Slots",
        "Link"
      ],
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv([{}]);
  }
  const [postResult, postSurgeProtector] = usePostSurgeProtectorMutation();
  const [deleteResult, deleteSurgeProtector] =
    useDeleteSurgeProtectorMutation();

//  if (uploading) return <CircularProgress></CircularProgress>;

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
        Surge protectors
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
            New Surge protector
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
              onChange={handleChange}
              sx={{ pr: 1, width: "30%" }}
              value={deviceModify.id}
              InputProps={{ inputProps: { autoComplete: "off", maxLength: 10 } }}
            />
            <TextField
              id="name"
              label="Name"
              sx={{ width: "68%" }}
              variant="standard"
              required
              onChange={handleChange}
              value={deviceModify.name}
              InputProps={{ inputProps: { autoComplete: "off", maxLength: 40 } }}
            />
          </div>
          <div className="section">
            <TextField
              id="type"
              label="Type"
              variant="standard"
              select
              required
              sx={{ pr: 1, width: "23%" }}
              onChange={handleChange}
              value={deviceModify.type}
              SelectProps={{ native: true }}
            >
              {["B","C","D","B+C","B+C+D","C+D"].map((input) => (
                <option key={input} value={input}>
                  {input}
                </option>
              ))}
            </TextField>
            <TextField
              id="inputs"
              label="Inputs"
              variant="standard"
              select
              required
              onChange={handleChange}
              value={deviceModify.inputs}
              SelectProps={{ native: true }}
              sx={{ width: "23%", pr: 1 }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((input) => (
                <option key={input} value={input}>
                  {input}
                </option>
              ))}
            </TextField>
            <TextField
              id="outputs"
              label="Outputs"
              variant="standard"
              required
              onChange={handleChange}
              value={deviceModify.outputs}
              select
              SelectProps={{ native: true }}
              sx={{ width: "23%", pr: 1 }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((output) => (
                <option key={output} value={output}>
                  {output}
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
              sx={{ width: "22%", pr: 1 }}
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
                endAdornment: <InputAdornment position="end">W</InputAdornment>,
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
          loading = {surgeProtectors === undefined || uploading}
          slots={{ toolbar: GridToolbar }}
          density="compact"
        ></DataGrid>
      </div>
    </>
  );
}
