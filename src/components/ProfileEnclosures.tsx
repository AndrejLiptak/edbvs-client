import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
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
  Enclosure,
  useDeleteEnclosureMutation,
  usePostEnclosureMutation,
} from "../graphql/generated";
import "../styles/main.css";
import { fieldLength } from "../types";
import { CreateDeviceMessage } from "./CreateDeviceMessage";
import { Log } from "./Log";

type Props = {
  enclosures: Enclosure[];
  userEmail: string;
  isAdmin: boolean;
};

export function ProfileEnclosures({ enclosures, userEmail, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(enclosures ?? []);
  useEffect(() => {
    if (rows.length == 0) setRows(enclosures ?? []);
  }, [enclosures]);
  const [enclosureModify, setEnclosureModify] = useState({
    id: "",
    name: "",
    totalSlots: "100",
    totalDIN: "10",
    oneDINSlots: "10",
    heatDissipation: "",
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
    setEnclosureModify({ ...enclosureModify, userEmail: userEmail });
  }, [userEmail]);

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
      ...enclosureModify,
      oneDINSlots: parseInt(enclosureModify.oneDINSlots),
      totalDIN: parseInt(enclosureModify.totalDIN),
      totalSlots:
        parseInt(enclosureModify.oneDINSlots) *
        parseInt(enclosureModify.totalDIN),
      heatDissipation: parseFloat(enclosureModify.heatDissipation),
      isVerified: isAdmin,
    };

    postEnclosure(variables).then((result) => {
      setPosting(false);
      if (!result.error) {
        setError(false);
        setSuccess(true);
        setEnclosureModify({
          id: "",
          name: "",
          totalSlots: "",
          totalDIN: "10",
          oneDINSlots: "10",
          heatDissipation: "",
          link: "",
          userEmail: userEmail,
        });
        if (typeof result.data !== "undefined") {
          const newEnclosure = result.data.postEnclosure;
          setRows((current) => [...current, newEnclosure]);
        }
      } else {
        setError(true);
      }
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    let value: (typeof enclosureModify)[keyof typeof enclosureModify] =
      event.target.value;

    setEnclosureModify({ ...enclosureModify, [event.target.id]: value });
  }

  function deleteMany() {
    var promises = rowSelectionModel.map((enclosure) => {
      const variables = {
        id: enclosure.toString(),
      };
      return deleteEnclosure(variables);
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
    {
      field: "name",
      headerName: "Name",
      width: fieldLength.get("name"),
      type: "string",
    },
    {
      field: "heatDissipation",
      headerName: "Heat Dissipation (W)",
      width: fieldLength.get("heatDissipation"),
      type: "number",
    },
    {
      field: "totalDIN",
      headerName: "Total DIN",
      width: fieldLength.get("totalDIN"),
      type: "number",
    },
    {
      field: "oneDINSlots",
      headerName: "One DIN Slots",
      type: "number",
      width: fieldLength.get("oneDINSlots"),
    },
    {
      field: "link",
      headerName: "Link",
      width: fieldLength.get("link"),
      renderCell: (params) => (
        <Link href={params.value} target="_blank">
          {params.value}
        </Link>
      ),
    },
  ];

  function checkCorrectFile(data: object) {
    if (!data) return false;
    const keys = Object.keys(data);
    const expected = [
      "ID",
      "Name",
      "Heat Dissipation (W)",
      "One DIN Slots",
      "Total DIN",
      "Link",
    ];
    if (keys.length != 6) return false;
    const hasAllValues = keys.every((value) => expected.includes(value));
    return hasAllValues;
  }

  function postMany(data: [object]) {
    type ObjectKey = keyof (typeof data)[0];
    const id = "ID" as ObjectKey;
    const name = "Name" as ObjectKey;
    const oneDINSlots = "One DIN Slots" as ObjectKey;
    const totalDIN = "Total DIN" as ObjectKey;
    const link = "Link" as ObjectKey;
    const heatDissipation = "Heat Dissipation (W)" as ObjectKey;
    var ids = [] as string[];
    var enclosuresNew = [] as Enclosure[];
    var succEnclosures = [] as Enclosure[];

    const correcDevices: object[] = [];

    data.map((device) => {
      var correct = true;
      if (
        isNaN(device[heatDissipation]) ||
        Number(device[heatDissipation]) < 0
      ) {
        correct = false;
        tempLog.push(
          `Enclosure "${device[id]}" has incorrect heat dissipation value`
        );
      }
      if (isNaN(device[oneDINSlots]) || Number(device[oneDINSlots]) < 0) {
        correct = false;
        tempLog.push(
          `Enclosure "${device[id]}" has incorrect one DIN slots value`
        );
      }

      if (isNaN(device[totalDIN]) || Number(device[totalDIN]) < 0) {
        correct = false;
        tempLog.push(
          `Enclosure "${device[id]}" has incorrect one total DIN value`
        );
      }
      if (correct) correcDevices.push(device);
    });

    var promises = data.map((enclosure) => {
      const variables = {
        id: enclosure[id],
        name: enclosure[name],
        totalDIN: Number(enclosure[totalDIN]),
        totalSlots: Number(enclosure[totalDIN] * enclosure[oneDINSlots]),
        oneDINSlots: Number(enclosure[oneDINSlots]),
        heatDissipation: Number(enclosure[heatDissipation]),
        link: enclosure[link],
        userEmail: userEmail,
        isVerified: isAdmin,
      };
      console.log(variables);
      enclosuresNew.push(variables);
      ids.push(enclosure[id]);
      return postEnclosure(variables);
    });
    var tempLog = [] as string[];

    Promise.all(promises).then((results) => {
      setUploading(false);
      setRows(enclosures);
      results.forEach((result, index) => {
        if (result.error) {
          tempLog.push(`Enclosure "${ids[index]}" was not posted`);
        } else {
          tempLog.push(`Enclosure "${ids[index]}" posted successfully`);
          succEnclosures.push(enclosuresNew[index]);
        }
      });

      setLog([...log, ...tempLog]);
      setRows([...rows, ...succEnclosures]);
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
            setLog([...log, `File "${name}" does not have any enclosures`]);
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
      filename: "enclosuresTemplate",
      title: "Enclosures",
      useTextFile: false,
      useBom: true,
      headers: [
        "ID",
        "Name",
        "Heat Dissipation (W)",
        "Total DIN",
        "One DIN Slots",
        "Link",
      ],
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv([{}]);
  }
  const [postEnclosureResult, postEnclosure] = usePostEnclosureMutation();
  const [deleteEnclosureResult, deleteEnclosure] = useDeleteEnclosureMutation();

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
        Enclosures
        <Button onClick={handleOpen}>Create</Button>
        <Button onClick={downloadTemplate}>Download CSV template</Button>
        <Button component="label">
          Upload File
          <input type="file" accept=".csv" hidden onChange={uploadFile} />
        </Button>
        <Log log={log} />
      </Typography>

      <Modal open={open} onClose={handleClose}>
        <Box component="form" className="CreateBox" onSubmit={handleSubmit}>
          <CreateDeviceMessage
            error={error}
            id={enclosureModify.id}
            success={success}
          ></CreateDeviceMessage>

          <Typography variant="h6">
            New Enclosure
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
              sx={{ pr: 1, width: "30%" }}
              required
              onChange={handleChange}
              value={enclosureModify.id}
              InputProps={{ inputProps: { autoComplete: "off" } }}
            />
            <TextField
              id="name"
              label="Name"
              variant="standard"
              sx={{ width: "65%" }}
              required
              onChange={handleChange}
              value={enclosureModify.name}
              InputProps={{ inputProps: { autoComplete: "off" } }}
            />
          </div>
          <div className="section">
            <TextField
              id="totalDIN"
              label="Total DIN rails"
              variant="standard"
              required
              onChange={handleChange}
              value={enclosureModify.totalDIN}
              SelectProps={{ native: true }}
              type="number"
              sx={{ width: "48%", pr: 1 }}
            ></TextField>
            <TextField
              id="oneDINSlots"
              label="Slots on one DIN"
              variant="standard"
              required
              onChange={handleChange}
              value={enclosureModify.oneDINSlots}
              SelectProps={{ native: true }}
              type="number"
              sx={{ width: "48%" }}
            ></TextField>
            <div className="section">
              <TextField
                id="heatDissipation"
                label="Heat dissipation"
                variant="standard"
                required
                onChange={handleChange}
                value={enclosureModify.heatDissipation}
                type="number"
                sx={{ width: "33%" }}
                InputProps={{
                  inputProps: { min: 0, step: 0.01, autoComplete: "off" },
                }}
              />
            </div>
            <div className="section">
              <TextField
                id="link"
                label="Link"
                variant="standard"
                onChange={handleChange}
                value={enclosureModify.link}
                type="string"
                sx={{ width: "100%" }}
              />
            </div>
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
          loading={enclosures === undefined || uploading}
          slots={{ toolbar: GridToolbar }}
          density="compact"
        ></DataGrid>
      </div>
    </>
  );
}
