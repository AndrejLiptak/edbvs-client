import { useState } from "react";
import "reactflow/dist/style.css";
import {
  useCircuitBreakerQuery,
  useGenericDevicesQuery,
  usePlCsQuery,
  useRcDsQuery,
  useSurgeProtectorsQuery,
} from "../../graphql/generated";
import "../../styles/main.css";
import { IDevice } from "../../types";
import { NavigationBar } from "../NavigationBar";
import { Diagram } from "./diagram/Diagram";
import { SidebarUnified } from "./sidebar/SidebarUnified";

function Designer() {
  const [totalPowerLoss, setTotalPowerLoss] = useState(0);
  const [deviceList, setDeviceList] = useState(new Map<IDevice, number>());

  const [devices] = useGenericDevicesQuery();
  const [RCDs] = useRcDsQuery();
  const [circuitBreakers] = useCircuitBreakerQuery();
  const [surgeProtectors] = useSurgeProtectorsQuery();
  const [PLCs] = usePlCsQuery();

  //  if (
  //   devices.fetching ||
  //  circuitBreakers.fetching ||
  // RCDs.fetching ||
  //surgeProtectors.fetching ||
  //PLCs.fetching
  // )
  //  return <CircularProgress className="CircularProgress" />;

  function addToList(device: IDevice) {
    if (!deviceList.has(device)) {
      const previous = totalPowerLoss;
      setTotalPowerLoss(previous + device.powerLoss * 100);
      setDeviceList(new Map<IDevice, number>(deviceList.set(device, 0)));
    }
  }

  function deleteFromList(device: IDevice) {
    if (deviceList.has(device)) {
      const previous = totalPowerLoss;
      setTotalPowerLoss(previous - device.powerLoss * 100);
      deviceList.delete(device);
      setDeviceList(new Map<IDevice, number>(deviceList));
    }
  }

  function onChangeDeviceList(newDeviceList: Map<IDevice, number>) {
    setDeviceList(newDeviceList);
  }
  const allDevices = [
    ...(circuitBreakers.data?.CircuitBreakers! ?? []),
    ...(RCDs.data?.RCDs! ?? []),
    ...(surgeProtectors.data?.SurgeProtectors! ?? []),
    ...(PLCs.data?.PLCs! ?? []),
    ...(devices.data?.GenericDevices! ?? []),
  ];
  return (
    <>
      <div style={{ height: "100%", width: "100%" }}>
        <NavigationBar />
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
          }}
        >
          <SidebarUnified
            addToList={addToList}
            circuitBreakers={circuitBreakers.data?.CircuitBreakers! ?? []}
            RCDs={RCDs.data?.RCDs! ?? []}
            surgeProtectors={
              surgeProtectors.data?.SurgeProtectors.sort((x, y) => {
                return Number(y.isVerified) - Number(x.isVerified);
              })! ?? []
            }
            PLCs={
              PLCs.data?.PLCs.sort((x, y) => {
                return Number(y.isVerified) - Number(x.isVerified);
              })! ?? []
            }
            genericDevices={
              devices.data?.GenericDevices.sort((x, y) => {
                return Number(y.isVerified) - Number(x.isVerified);
              })! ?? []
            }
            all={allDevices}
          />
          <Diagram
            deviceList={deviceList}
            deleteDevice={deleteFromList}
            totalPowerLoss={totalPowerLoss}
            setDeviceList={onChangeDeviceList}
            setTotalPowerLoss={setTotalPowerLoss}
            addToList={addToList}
          ></Diagram>
        </div>
      </div>
    </>
  );
}

export default Designer;
