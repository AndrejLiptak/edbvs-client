import { Button } from "@mui/material";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
import { ReactFlowInstance } from "reactflow";
import { Enclosure } from "../graphql/generated";
import { IDevice } from "../types";

type Props = {
  reactFlowInstance: ReactFlowInstance | null;
  wiringDiagram: string;
  selectedEnclosure: Enclosure;
  powerLoss: number;
  filledSlots: number;
  phaseCount: number;
  deviceList: Map<IDevice, number>;
};

export const createPNG = (
  reactFlowInstance: ReactFlowInstance | null,
  processPNG: (arg0: string) => void
) => {
  reactFlowInstance?.fitView();
  const query: HTMLElement | null = document.querySelector(".react-flow");
  if (!query) return;
  toPng(query, {
    filter: (node) => {
      if (
        node?.classList?.contains("react-flow__minimap") ||
        node?.classList?.contains("react-flow__controls")
      )
        return false;

      return true;
    },
  }).then(processPNG);
};

export function DownloadDocument({
  reactFlowInstance,
  wiringDiagram,
  selectedEnclosure,
  powerLoss,
  filledSlots,
  phaseCount,
  deviceList,
}: Props) {
  // Create Document Component

  const onDownload = () => {
    createPNG(reactFlowInstance, createDocument);
  };

  let keys = Array.from(deviceList.keys());
  let circuitBreakers = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "CircuitBreaker"
  );
  let RCDs = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "RCD"
  );
  let surgeProtectors = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "SurgeProtector"
  );
  let PLCs = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "PLC"
  );
  let genericDevices = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "GenericDevice"
  );

  const createDocument = (enclosureDiagram: string) => {
    const styles = StyleSheet.create({
      page: {
        flexDirection: "row",
        backgroundColor: "white",
      },
      section: {
        margin: 20,
        padding: 40,
        flexGrow: 1,
      },
      partFirst: {
        display: "flex",
        flexDirection: "row",
      },
      part: {
        display: "flex",
        flexDirection: "row",
      },
      text: {
        fontSize: "15px",
        flexGrow: 1,
      },
      textSecondary: {
        fontSize: "15px",
        flexGrow: 0,
      },
      header: {
        fontSize: "30px",
        textAlign: "center",
        paddingBottom: 20,
      },
      subheader: {
        fontSize: "20px",
        paddingBottom: 15,
      },
      devicePart: {
        display: "flex",
        flexDirection: "row",
      },
      deviceCount: {
        fontSize: "10px",
        flexGrow: 0,
        borderBottom: `1px solid #000`,
        borderRight: `1px solid #000`,
        width: "30px",
        textAlign: "center",
      },
      device: {
        fontSize: "10px",
        flexGrow: 1,
        borderBottom: `1px solid #000`,
        textIndent: 5,
      },
      quantity: {
        fontSize: "13px",
        flexGrow: 0,
      },
      description: {
        fontSize: "13px",
        flexGrow: 1,
        textIndent: 10,
      },
      list: {
        margin: 10,
        padding: 10,
      },
      image: {
        border: `1px solid #000`,
      },
    });

    const MyDocument = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View>
              <Text style={styles.header}>
                Enclosure {selectedEnclosure.id}
              </Text>
            </View>
            <View style={styles.list}>
              <View style={styles.partFirst}>
                <Text style={styles.text}>Network: </Text>
                <Text style={styles.textSecondary}>
                  230{phaseCount == 3 && "/400"}V 50Hz TN-S/TN-CS
                </Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>Enclosure: </Text>
                <Text style={styles.textSecondary}>
                  {selectedEnclosure.name}
                </Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>System power loss: </Text>
                <Text style={styles.textSecondary}>{powerLoss / 100} W</Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>Enclosure heat dissipation: </Text>
                <Text style={styles.textSecondary}>
                  -{selectedEnclosure.heatDissipation} W
                </Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>Avaliable power loss:</Text>
                <Text style={styles.textSecondary}>
                  {(selectedEnclosure.heatDissipation * 100 - powerLoss) / 100}{" "}
                  W
                </Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>Enclosure DIN rails</Text>
                <Text style={styles.textSecondary}>
                  {selectedEnclosure.totalDIN}
                </Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>One DIN rail slots</Text>
                <Text style={styles.textSecondary}>
                  {selectedEnclosure.oneDINSlots}
                </Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>Total enclosure slots: </Text>
                <Text style={styles.textSecondary}>
                  {selectedEnclosure.totalSlots}
                </Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>Filled slots: </Text>
                <Text style={styles.textSecondary}>{filledSlots}</Text>
              </View>
              <View style={styles.part}>
                <Text style={styles.text}>Empty slots: </Text>
                <Text style={styles.textSecondary}>
                  {selectedEnclosure.totalSlots - filledSlots}
                </Text>
              </View>
            </View>

            <View>
              <Image src={enclosureDiagram} style={styles.image} />
            </View>
          </View>
        </Page>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View>
              <Text style={styles.header}>Device list</Text>
              <Text style={styles.subheader}>Circuit breakers</Text>
              <View style={{ ...styles.devicePart, paddingBottom: 5 }}>
                <Text style={styles.quantity}>Qty</Text>
                <Text style={styles.description}>Description</Text>
              </View>

              {circuitBreakers.map((device) => {
                return (
                  <View style={styles.devicePart}>
                    <Text style={styles.deviceCount}>
                      {deviceList.get(device)}
                    </Text>
                    {device.__typename == "CircuitBreaker" && (
                      <Text style={styles.device}>
                        {device.id}, {device.name}, {device.ratedCurrent}A,{" "}
                        {device.type}, {device.poleCount} Pole,{" "}
                        {device.powerLoss}W, {device.maxTemp}°C
                      </Text>
                    )}
                  </View>
                );
              })}

              <Text style={{ ...styles.subheader, paddingTop: 20 }}>RCDs</Text>
              <View style={{ ...styles.devicePart, paddingBottom: 5 }}>
                <Text style={styles.quantity}>Qty</Text>
                <Text style={styles.description}>Description</Text>
              </View>

              {RCDs.map((device) => {
                return (
                  <View style={styles.devicePart}>
                    <Text style={styles.deviceCount}>
                      {deviceList.get(device)}
                    </Text>
                    {device.__typename == "RCD" && (
                      <Text style={styles.device}>
                        {device.id}, {device.name}, {device.ratedCurrent}A,{" "}
                        {device.ratedResidualCurrent}mA, {device.currentType},{" "}
                        {device.breakTimeType}, {device.poleCount} Pole,{" "}
                        {device.powerLoss}W, {device.maxTemp}°C
                      </Text>
                    )}
                  </View>
                );
              })}

              <Text style={{ ...styles.subheader, paddingTop: 20 }}>
                Surge protectors
              </Text>
              <View style={{ ...styles.devicePart, paddingBottom: 5 }}>
                <Text style={styles.quantity}>Qty</Text>
                <Text style={styles.description}>Description</Text>
              </View>

              {surgeProtectors.map((device) => {
                return (
                  <View style={styles.devicePart}>
                    <Text style={styles.deviceCount}>
                      {deviceList.get(device)}
                    </Text>
                    {device.__typename == "SurgeProtector" && (
                      <Text style={styles.device}>
                        {device.id}, {device.name}, {device.type},{" "}
                        {device.powerLoss}W, {device.maxTemp}°C
                      </Text>
                    )}
                  </View>
                );
              })}

              <Text style={{ ...styles.subheader, paddingTop: 20 }}>PLCs</Text>
              <View style={{ ...styles.devicePart, paddingBottom: 5 }}>
                <Text style={styles.quantity}>Qty</Text>
                <Text style={styles.description}>Description</Text>
              </View>

              {PLCs.map((device) => {
                return (
                  <View style={styles.devicePart}>
                    <Text style={styles.deviceCount}>
                      {deviceList.get(device)}
                    </Text>
                    {device.__typename == "PLC" && (
                      <Text style={styles.device}>
                        {device.id}, {device.name}, {device.digitalIn} DI,{" "}
                        {device.digitalOut} DO, {device.analogIn} AI,{" "}
                        {device.analogOut} AO, {device.powerLoss}W,{" "}
                        {device.maxTemp}°C
                      </Text>
                    )}
                  </View>
                );
              })}

              <Text style={{ ...styles.subheader, paddingTop: 20 }}>
                Generic devices
              </Text>
              <View style={{ ...styles.devicePart, paddingBottom: 5 }}>
                <Text style={styles.quantity}>Qty</Text>
                <Text style={styles.description}>Description</Text>
              </View>

              {genericDevices.map((device) => {
                return (
                  <View style={styles.devicePart}>
                    <Text style={styles.deviceCount}>
                      {deviceList.get(device)}
                    </Text>
                    {device.__typename == "GenericDevice" && (
                      <Text style={styles.device}>
                        {device.id}, {device.name}, {device.powerLoss}W,{" "}
                        {device.maxTemp}°C
                      </Text>
                    )}
                  </View>
                );
              })}

              <View style={styles.section}>
                <Image src={wiringDiagram} style={styles.image} />
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
    const blop = pdf(MyDocument).toBlob();
    blop.then((value) => {
      saveAs(value, "Documentation.pdf");
    });
  };

  return (
    <>
      <Button
        onClick={() => {
          onDownload();
        }}
        variant="contained"
        sx={{
          position: "absolute",
          bottom: "20px",
          right: "1rem",
          width: "10rem",
        }}
      >
        Generate documentation
      </Button>
    </>
  );
}
