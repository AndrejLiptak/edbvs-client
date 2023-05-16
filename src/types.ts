import type { GenericDevice, PlCsQuery, RcDsQuery, SurgeProtectorsQuery, UsersQuery } from "./graphql/generated";
import { GenericDevicesQuery } from "./graphql/generated";
import { CircuitBreakerQuery} from "./graphql/generated";
import { DeviceNode } from "./components/DeviceNode";



export type IDevice = GenericDevicesQuery["GenericDevices"][0] | CircuitBreakerQuery["CircuitBreakers"][0] | RcDsQuery["RCDs"][0] | SurgeProtectorsQuery["SurgeProtectors"][0] | PlCsQuery["PLCs"][0]
export type UserWithoutDevices = UsersQuery["Users"][0]
export type test = CircuitBreakerQuery["CircuitBreakers"][0];

export type ICircuitBreaker = CircuitBreakerQuery["CircuitBreakers"][0];

export type ICda = ICircuitBreaker

export type IUsers = UsersQuery["Users"][0]

const customNodeType = 'customNode';

export const nodeTypes = {
    "deviceNode": DeviceNode,
};

export type NodeData = {
    device: IDevice,
    slotted: boolean,
    order: number,
    color: string,
}

export type PhaseData = {
    label: string,
    slotted: boolean
}

export type DINData = {
    slots: number,
    filled: number
}

export const maxSlotInputOutput = 8

export const allowedArray = ["1", "2", "3", "4" , "5" , "6" ,"7", "8"]

export const fieldLength = new Map([
    ['id', 100],
    ['name', 200],
    ['name', 200],
    ['isVerified', 100],
    ['outputs', 70],
    ['inputs', 70],
    ['slots', 70],
    ['powerLoss', 150],
    ['maxTemp', 200],
    ['heatDissipation', 150],
    ['oneDINSlots', 150],
    ['totalDIN', 150],
    ['poleCount', 150],
    ['ratedCurrent',150],
    ['type', 50],
    ['ratedResidualCurrent', 200],
    ['currentType', 100],
    ['breakTimeType', 150],
    ['digitalIn', 50],
    ['digitalOut', 50],
    ['analogIn', 50],
    ['analogOut', 50],
    ['link', 250],
    ['delete', 60]
])