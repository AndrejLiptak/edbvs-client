import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { ProSidebarProvider } from "react-pro-sidebar";
import { GenericDeviceDisplay } from "./GenericDevicesMenu";
import { ICircuitBreaker, IDevice } from "../types";
import { CircuitBreakerDisplay } from "./CircuitBreakersMenu";
import {

  useCircuitBreakerQuery,

  useGenericDevicesQuery,
} from "../graphql/generated";
import { CircularProgress } from "@mui/material";

type Props = {
  addToList: (device: IDevice) => void;
};

export function MySideBar({ addToList }: Props) {
  const [devices] = useGenericDevicesQuery();

  const [circuitBreakers] = useCircuitBreakerQuery();

  if (devices.fetching || circuitBreakers.fetching) return <CircularProgress />;

  return (
    <>
      <ProSidebarProvider>
        <Sidebar width="400px">
          <Menu>
            <SubMenu label="Circuit Breakers">
              {circuitBreakers.data?.CircuitBreakers.map(
                (device: ICircuitBreaker, i: any) => (
                  <MenuItem key={device.id}>
                    <CircuitBreakerDisplay
                      device={device}
                      addToList={addToList}
                    />{" "}
                  </MenuItem>
                )
              )}
            </SubMenu>
            <SubMenu label="Surge Protectors"></SubMenu>
            <SubMenu label="RCDs"></SubMenu>
            <SubMenu label="PLCs"></SubMenu>
            <SubMenu label="OtherDevices">
              {devices.data?.GenericDevices.map((device: IDevice, i: any) => (
                <MenuItem key={device.id}>
                  <GenericDeviceDisplay device={device} addToList={addToList} />
                </MenuItem>
              ))}
            </SubMenu>
          </Menu>
        </Sidebar>
      </ProSidebarProvider>
    </>
  );
}
