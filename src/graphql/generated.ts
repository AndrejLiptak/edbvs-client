import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CircuitBreaker = {
  __typename?: 'CircuitBreaker';
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: Maybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  poleCount: Scalars['String'];
  powerLoss: Scalars['Float'];
  ratedCurrent: Scalars['Int'];
  slots: Scalars['Int'];
  type: Scalars['String'];
  userEmail: Scalars['String'];
};

export type CompanyRequest = {
  __typename?: 'CompanyRequest';
  approved: Scalars['Boolean'];
  companyICO: Scalars['Int'];
  companyName: Scalars['String'];
  rejected: Scalars['Boolean'];
  userEmail: Scalars['String'];
};

export type Enclosure = {
  __typename?: 'Enclosure';
  heatDissipation: Scalars['Float'];
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
  link?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  oneDINSlots: Scalars['Int'];
  totalDIN: Scalars['Int'];
  totalSlots: Scalars['Int'];
  userEmail: Scalars['String'];
};

export type GenericDevice = {
  __typename?: 'GenericDevice';
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: Maybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  powerLoss: Scalars['Float'];
  slots: Scalars['Int'];
  userEmail: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  circuitVerification: CircuitBreaker;
  companyApprove: CompanyRequest;
  companyReject: CompanyRequest;
  companyUpdate: CompanyRequest;
  deleteCircuitBreaker: CircuitBreaker;
  deleteEnclosure: Enclosure;
  deleteGenericDevice: GenericDevice;
  deletePLC: Plc;
  deleteRCD: Rcd;
  deleteSurgeProtector: SurgeProtector;
  enclosureVerification: Enclosure;
  genericVerification: GenericDevice;
  plcVerification: Plc;
  postCircuitBreaker: CircuitBreaker;
  postCompanyRequest: CompanyRequest;
  postEnclosure: Enclosure;
  postGenericDevice: GenericDevice;
  postPLC: Plc;
  postRCD: Rcd;
  postSurgeProtector: SurgeProtector;
  postUser: User;
  rcdVerification: Rcd;
  surgeVerification: SurgeProtector;
  userCompany: User;
  userVerification: User;
};


export type MutationCircuitVerificationArgs = {
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
};


export type MutationCompanyApproveArgs = {
  userEmail: Scalars['String'];
};


export type MutationCompanyRejectArgs = {
  userEmail: Scalars['String'];
};


export type MutationCompanyUpdateArgs = {
  companyICO: Scalars['Int'];
  companyName: Scalars['String'];
  userEmail: Scalars['String'];
};


export type MutationDeleteCircuitBreakerArgs = {
  id: Scalars['String'];
};


export type MutationDeleteEnclosureArgs = {
  id: Scalars['String'];
};


export type MutationDeleteGenericDeviceArgs = {
  id: Scalars['String'];
};


export type MutationDeletePlcArgs = {
  id: Scalars['String'];
};


export type MutationDeleteRcdArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSurgeProtectorArgs = {
  id: Scalars['String'];
};


export type MutationEnclosureVerificationArgs = {
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
};


export type MutationGenericVerificationArgs = {
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
};


export type MutationPlcVerificationArgs = {
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
};


export type MutationPostCircuitBreakerArgs = {
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  poleCount: Scalars['String'];
  powerLoss: Scalars['Float'];
  ratedCurrent: Scalars['Int'];
  slots: Scalars['Int'];
  type: Scalars['String'];
  userEmail: Scalars['String'];
};


export type MutationPostCompanyRequestArgs = {
  companyICO: Scalars['Int'];
  companyName: Scalars['String'];
  userEmail: Scalars['String'];
};


export type MutationPostEnclosureArgs = {
  heatDissipation: Scalars['Float'];
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  oneDINSlots: Scalars['Int'];
  totalDIN: Scalars['Int'];
  totalSlots: Scalars['Int'];
  userEmail: Scalars['String'];
};


export type MutationPostGenericDeviceArgs = {
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  powerLoss: Scalars['Float'];
  slots: Scalars['Int'];
  userEmail: Scalars['String'];
};


export type MutationPostPlcArgs = {
  analogIn: Scalars['Int'];
  analogOut: Scalars['Int'];
  digitalIn: Scalars['Int'];
  digitalOut: Scalars['Int'];
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  powerLoss: Scalars['Float'];
  slots: Scalars['Int'];
  userEmail: Scalars['String'];
};


export type MutationPostRcdArgs = {
  breakTimeType: Scalars['String'];
  currentType: Scalars['String'];
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  poleCount: Scalars['String'];
  powerLoss: Scalars['Float'];
  ratedCurrent: Scalars['Int'];
  ratedResidualCurrent: Scalars['Float'];
  slots: Scalars['Int'];
  userEmail: Scalars['String'];
};


export type MutationPostSurgeProtectorArgs = {
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  powerLoss: Scalars['Float'];
  slots: Scalars['Int'];
  type: Scalars['String'];
  userEmail: Scalars['String'];
};


export type MutationPostUserArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
};


export type MutationRcdVerificationArgs = {
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
};


export type MutationSurgeVerificationArgs = {
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
};


export type MutationUserCompanyArgs = {
  companyICO: Scalars['Int'];
  companyName: Scalars['String'];
  email: Scalars['String'];
  isCompany: Scalars['Boolean'];
};


export type MutationUserVerificationArgs = {
  email: Scalars['String'];
  isVerified: Scalars['Boolean'];
};

export type Plc = {
  __typename?: 'PLC';
  analogIn: Scalars['Int'];
  analogOut: Scalars['Int'];
  digitalIn: Scalars['Int'];
  digitalOut: Scalars['Int'];
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: Maybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  powerLoss: Scalars['Float'];
  slots: Scalars['Int'];
  userEmail: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  CircuitBreakers: Array<CircuitBreaker>;
  CompanyRequest?: Maybe<CompanyRequest>;
  CompanyRequests: Array<CompanyRequest>;
  Enclosures: Array<Enclosure>;
  GenericDevices: Array<GenericDevice>;
  PLCs: Array<Plc>;
  RCDs: Array<Rcd>;
  SurgeProtectors: Array<SurgeProtector>;
  User?: Maybe<User>;
  Users: Array<User>;
};


export type QueryCompanyRequestArgs = {
  userEmail: Scalars['String'];
};


export type QueryUserArgs = {
  email: Scalars['String'];
};

export type Rcd = {
  __typename?: 'RCD';
  breakTimeType: Scalars['String'];
  currentType: Scalars['String'];
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: Maybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  poleCount: Scalars['String'];
  powerLoss: Scalars['Float'];
  ratedCurrent: Scalars['Int'];
  ratedResidualCurrent: Scalars['Float'];
  slots: Scalars['Int'];
  userEmail: Scalars['String'];
};

export type SurgeProtector = {
  __typename?: 'SurgeProtector';
  id: Scalars['String'];
  inputs: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: Maybe<Scalars['String']>;
  maxTemp: Scalars['Float'];
  name: Scalars['String'];
  outputs: Scalars['Int'];
  powerLoss: Scalars['Float'];
  slots: Scalars['Int'];
  type: Scalars['String'];
  userEmail: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  PLCs: Array<Plc>;
  RCDs: Array<Rcd>;
  approval?: Maybe<CompanyRequest>;
  circuitBreakers: Array<CircuitBreaker>;
  companyICO?: Maybe<Scalars['Int']>;
  companyName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  enclosures: Array<Enclosure>;
  genericDevices: Array<GenericDevice>;
  isCompany: Scalars['Boolean'];
  isVerified?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  surgeProtectors: Array<SurgeProtector>;
};

export type GenericDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GenericDevicesQuery = { __typename?: 'Query', GenericDevices: Array<{ __typename?: 'GenericDevice', id: string, name: string, userEmail: string, powerLoss: number, maxTemp: number, slots: number, inputs: number, outputs: number, isVerified: boolean, link?: string | null }> };

export type CircuitBreakerQueryVariables = Exact<{ [key: string]: never; }>;


export type CircuitBreakerQuery = { __typename?: 'Query', CircuitBreakers: Array<{ __typename?: 'CircuitBreaker', id: string, name: string, userEmail: string, maxTemp: number, ratedCurrent: number, poleCount: string, type: string, powerLoss: number, slots: number, inputs: number, outputs: number, isVerified: boolean, link?: string | null }> };

export type RcDsQueryVariables = Exact<{ [key: string]: never; }>;


export type RcDsQuery = { __typename?: 'Query', RCDs: Array<{ __typename?: 'RCD', id: string, name: string, currentType: string, poleCount: string, maxTemp: number, breakTimeType: string, ratedCurrent: number, ratedResidualCurrent: number, userEmail: string, powerLoss: number, slots: number, inputs: number, outputs: number, isVerified: boolean, link?: string | null }> };

export type SurgeProtectorsQueryVariables = Exact<{ [key: string]: never; }>;


export type SurgeProtectorsQuery = { __typename?: 'Query', SurgeProtectors: Array<{ __typename?: 'SurgeProtector', id: string, name: string, type: string, userEmail: string, maxTemp: number, powerLoss: number, slots: number, inputs: number, outputs: number, isVerified: boolean, link?: string | null }> };

export type PlCsQueryVariables = Exact<{ [key: string]: never; }>;


export type PlCsQuery = { __typename?: 'Query', PLCs: Array<{ __typename?: 'PLC', id: string, name: string, userEmail: string, powerLoss: number, maxTemp: number, slots: number, inputs: number, outputs: number, digitalIn: number, digitalOut: number, analogIn: number, analogOut: number, isVerified: boolean, link?: string | null }> };

export type PostGenericDeviceMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  inputs: Scalars['Int'];
  outputs: Scalars['Int'];
  slots: Scalars['Int'];
  powerLoss: Scalars['Float'];
  maxTemp: Scalars['Float'];
  userEmail: Scalars['String'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
}>;


export type PostGenericDeviceMutation = { __typename?: 'Mutation', postGenericDevice: { __typename?: 'GenericDevice', id: string, name: string, inputs: number, outputs: number, slots: number, powerLoss: number, maxTemp: number, userEmail: string, isVerified: boolean, link?: string | null } };

export type PostCircuitBreakerMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  poleCount: Scalars['String'];
  type: Scalars['String'];
  ratedCurrent: Scalars['Int'];
  inputs: Scalars['Int'];
  outputs: Scalars['Int'];
  slots: Scalars['Int'];
  powerLoss: Scalars['Float'];
  maxTemp: Scalars['Float'];
  userEmail: Scalars['String'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
}>;


export type PostCircuitBreakerMutation = { __typename?: 'Mutation', postCircuitBreaker: { __typename?: 'CircuitBreaker', id: string, name: string, inputs: number, outputs: number, slots: number, powerLoss: number, maxTemp: number, userEmail: string, poleCount: string, type: string, ratedCurrent: number, isVerified: boolean, link?: string | null } };

export type PostRcdMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  poleCount: Scalars['String'];
  breakTimeType: Scalars['String'];
  ratedCurrent: Scalars['Int'];
  ratedResidualCurrent: Scalars['Float'];
  currentType: Scalars['String'];
  inputs: Scalars['Int'];
  outputs: Scalars['Int'];
  slots: Scalars['Int'];
  powerLoss: Scalars['Float'];
  maxTemp: Scalars['Float'];
  userEmail: Scalars['String'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
}>;


export type PostRcdMutation = { __typename?: 'Mutation', postRCD: { __typename?: 'RCD', id: string, name: string, inputs: number, outputs: number, slots: number, powerLoss: number, maxTemp: number, userEmail: string, ratedCurrent: number, poleCount: string, currentType: string, ratedResidualCurrent: number, breakTimeType: string, isVerified: boolean, link?: string | null } };

export type PostSurgeProtectorMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  inputs: Scalars['Int'];
  outputs: Scalars['Int'];
  slots: Scalars['Int'];
  type: Scalars['String'];
  powerLoss: Scalars['Float'];
  maxTemp: Scalars['Float'];
  userEmail: Scalars['String'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
}>;


export type PostSurgeProtectorMutation = { __typename?: 'Mutation', postSurgeProtector: { __typename?: 'SurgeProtector', id: string, name: string, inputs: number, outputs: number, slots: number, type: string, powerLoss: number, maxTemp: number, userEmail: string, isVerified: boolean, link?: string | null } };

export type PostPlcMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  inputs: Scalars['Int'];
  outputs: Scalars['Int'];
  slots: Scalars['Int'];
  powerLoss: Scalars['Float'];
  maxTemp: Scalars['Float'];
  userEmail: Scalars['String'];
  digitalIn: Scalars['Int'];
  digitalOut: Scalars['Int'];
  analogIn: Scalars['Int'];
  analogOut: Scalars['Int'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
}>;


export type PostPlcMutation = { __typename?: 'Mutation', postPLC: { __typename?: 'PLC', id: string, name: string, inputs: number, outputs: number, slots: number, powerLoss: number, maxTemp: number, userEmail: string, digitalIn: number, digitalOut: number, analogIn: number, analogOut: number, isVerified: boolean, link?: string | null } };

export type PostUserMutationVariables = Exact<{
  email: Scalars['String'];
  name: Scalars['String'];
}>;


export type PostUserMutation = { __typename?: 'Mutation', postUser: { __typename?: 'User', name: string, email: string, isCompany: boolean, companyName?: string | null, companyICO?: number | null, genericDevices: Array<{ __typename?: 'GenericDevice', id: string, name: string, powerLoss: number, maxTemp: number, inputs: number, outputs: number, slots: number, userEmail: string, isVerified: boolean, link?: string | null }>, circuitBreakers: Array<{ __typename?: 'CircuitBreaker', id: string, name: string, powerLoss: number, maxTemp: number, inputs: number, outputs: number, slots: number, ratedCurrent: number, poleCount: string, type: string, userEmail: string, isVerified: boolean, link?: string | null }>, RCDs: Array<{ __typename?: 'RCD', id: string, name: string, maxTemp: number, currentType: string, poleCount: string, breakTimeType: string, ratedCurrent: number, ratedResidualCurrent: number, userEmail: string, powerLoss: number, slots: number, inputs: number, outputs: number, isVerified: boolean, link?: string | null }>, enclosures: Array<{ __typename?: 'Enclosure', id: string, name: string, totalSlots: number, totalDIN: number, oneDINSlots: number, heatDissipation: number, userEmail: string, isVerified: boolean, link?: string | null }>, surgeProtectors: Array<{ __typename?: 'SurgeProtector', id: string, name: string, type: string, userEmail: string, maxTemp: number, powerLoss: number, slots: number, inputs: number, outputs: number, isVerified: boolean, link?: string | null }>, PLCs: Array<{ __typename?: 'PLC', id: string, name: string, userEmail: string, powerLoss: number, maxTemp: number, slots: number, inputs: number, outputs: number, digitalIn: number, digitalOut: number, analogIn: number, analogOut: number, isVerified: boolean, link?: string | null }>, approval?: { __typename?: 'CompanyRequest', userEmail: string, approved: boolean, companyICO: number, companyName: string, rejected: boolean } | null } };

export type DeleteGenericDeviceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteGenericDeviceMutation = { __typename?: 'Mutation', deleteGenericDevice: { __typename?: 'GenericDevice', id: string } };

export type DeleteCircuitBreakerMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCircuitBreakerMutation = { __typename?: 'Mutation', deleteCircuitBreaker: { __typename?: 'CircuitBreaker', id: string } };

export type DeleteRcdMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteRcdMutation = { __typename?: 'Mutation', deleteRCD: { __typename?: 'RCD', id: string } };

export type DeleteSurgeProtectorMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteSurgeProtectorMutation = { __typename?: 'Mutation', deleteSurgeProtector: { __typename?: 'SurgeProtector', id: string } };

export type DeletePlcMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeletePlcMutation = { __typename?: 'Mutation', deletePLC: { __typename?: 'PLC', id: string } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', Users: Array<{ __typename?: 'User', name: string, email: string, companyName?: string | null, companyICO?: number | null, isCompany: boolean, approval?: { __typename?: 'CompanyRequest', approved: boolean, rejected: boolean } | null }> };

export type UserQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type UserQuery = { __typename?: 'Query', User?: { __typename?: 'User', name: string, email: string, companyName?: string | null, companyICO?: number | null, isCompany: boolean, genericDevices: Array<{ __typename?: 'GenericDevice', id: string, name: string, powerLoss: number, maxTemp: number, inputs: number, outputs: number, slots: number, userEmail: string, isVerified: boolean, link?: string | null }>, RCDs: Array<{ __typename?: 'RCD', id: string, name: string, currentType: string, maxTemp: number, poleCount: string, breakTimeType: string, ratedCurrent: number, ratedResidualCurrent: number, userEmail: string, powerLoss: number, slots: number, inputs: number, outputs: number, isVerified: boolean, link?: string | null }>, circuitBreakers: Array<{ __typename?: 'CircuitBreaker', id: string, name: string, powerLoss: number, maxTemp: number, inputs: number, outputs: number, slots: number, ratedCurrent: number, poleCount: string, type: string, userEmail: string, isVerified: boolean, link?: string | null }>, enclosures: Array<{ __typename?: 'Enclosure', id: string, name: string, totalSlots: number, totalDIN: number, oneDINSlots: number, heatDissipation: number, userEmail: string, isVerified: boolean, link?: string | null }>, surgeProtectors: Array<{ __typename?: 'SurgeProtector', id: string, name: string, type: string, userEmail: string, maxTemp: number, powerLoss: number, slots: number, inputs: number, outputs: number, isVerified: boolean, link?: string | null }>, PLCs: Array<{ __typename?: 'PLC', id: string, name: string, userEmail: string, powerLoss: number, maxTemp: number, slots: number, inputs: number, outputs: number, digitalIn: number, digitalOut: number, analogIn: number, analogOut: number, isVerified: boolean, link?: string | null }>, approval?: { __typename?: 'CompanyRequest', approved: boolean, rejected: boolean } | null } | null };

export type VerifyUserMutationVariables = Exact<{
  email: Scalars['String'];
  isVerified: Scalars['Boolean'];
}>;


export type VerifyUserMutation = { __typename?: 'Mutation', userVerification: { __typename?: 'User', email: string, isVerified?: boolean | null } };

export type EnclosuresQueryVariables = Exact<{ [key: string]: never; }>;


export type EnclosuresQuery = { __typename?: 'Query', Enclosures: Array<{ __typename?: 'Enclosure', id: string, name: string, totalSlots: number, totalDIN: number, oneDINSlots: number, heatDissipation: number, userEmail: string, isVerified: boolean, link?: string | null }> };

export type DeleteEnclosureMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteEnclosureMutation = { __typename?: 'Mutation', deleteEnclosure: { __typename?: 'Enclosure', id: string } };

export type PostEnclosureMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  totalSlots: Scalars['Int'];
  totalDIN: Scalars['Int'];
  oneDINSlots: Scalars['Int'];
  heatDissipation: Scalars['Float'];
  userEmail: Scalars['String'];
  isVerified: Scalars['Boolean'];
  link?: InputMaybe<Scalars['String']>;
}>;


export type PostEnclosureMutation = { __typename?: 'Mutation', postEnclosure: { __typename?: 'Enclosure', id: string, name: string, totalSlots: number, totalDIN: number, oneDINSlots: number, heatDissipation: number, userEmail: string, isVerified: boolean, link?: string | null } };

export type RequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type RequestsQuery = { __typename?: 'Query', CompanyRequests: Array<{ __typename?: 'CompanyRequest', userEmail: string, approved: boolean, companyICO: number, companyName: string, rejected: boolean }> };

export type RequestQueryVariables = Exact<{
  userEmail: Scalars['String'];
}>;


export type RequestQuery = { __typename?: 'Query', CompanyRequest?: { __typename?: 'CompanyRequest', userEmail: string, approved: boolean, companyICO: number, companyName: string, rejected: boolean } | null };

export type PostCompanyRequestMutationVariables = Exact<{
  userEmail: Scalars['String'];
  companyName: Scalars['String'];
  companyICO: Scalars['Int'];
}>;


export type PostCompanyRequestMutation = { __typename?: 'Mutation', postCompanyRequest: { __typename?: 'CompanyRequest', userEmail: string, approved: boolean, companyICO: number, companyName: string } };

export type ApproveRequestMutationVariables = Exact<{
  userEmail: Scalars['String'];
}>;


export type ApproveRequestMutation = { __typename?: 'Mutation', companyApprove: { __typename?: 'CompanyRequest', userEmail: string, approved: boolean, companyICO: number, companyName: string } };

export type RejectRequestMutationVariables = Exact<{
  userEmail: Scalars['String'];
}>;


export type RejectRequestMutation = { __typename?: 'Mutation', companyReject: { __typename?: 'CompanyRequest', userEmail: string, approved: boolean, companyICO: number, companyName: string } };

export type UpdateRequestMutationVariables = Exact<{
  userEmail: Scalars['String'];
  companyName: Scalars['String'];
  companyICO: Scalars['Int'];
}>;


export type UpdateRequestMutation = { __typename?: 'Mutation', companyUpdate: { __typename?: 'CompanyRequest', userEmail: string, approved: boolean, companyICO: number, companyName: string } };

export type UserCompanyMutationVariables = Exact<{
  email: Scalars['String'];
  isCompany: Scalars['Boolean'];
  companyName: Scalars['String'];
  companyICO: Scalars['Int'];
}>;


export type UserCompanyMutation = { __typename?: 'Mutation', userCompany: { __typename?: 'User', isVerified?: boolean | null } };

export type VerifyGenericMutationVariables = Exact<{
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
}>;


export type VerifyGenericMutation = { __typename?: 'Mutation', genericVerification: { __typename?: 'GenericDevice', isVerified: boolean } };

export type VerifyCircuitMutationVariables = Exact<{
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
}>;


export type VerifyCircuitMutation = { __typename?: 'Mutation', circuitVerification: { __typename?: 'CircuitBreaker', isVerified: boolean } };

export type VerifyPlcMutationVariables = Exact<{
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
}>;


export type VerifyPlcMutation = { __typename?: 'Mutation', plcVerification: { __typename?: 'PLC', isVerified: boolean } };

export type VerifyRcdMutationVariables = Exact<{
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
}>;


export type VerifyRcdMutation = { __typename?: 'Mutation', rcdVerification: { __typename?: 'RCD', isVerified: boolean } };

export type VerifySurgeMutationVariables = Exact<{
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
}>;


export type VerifySurgeMutation = { __typename?: 'Mutation', surgeVerification: { __typename?: 'SurgeProtector', isVerified: boolean } };

export type VerifyEnclosureMutationVariables = Exact<{
  id: Scalars['String'];
  isVerified: Scalars['Boolean'];
}>;


export type VerifyEnclosureMutation = { __typename?: 'Mutation', enclosureVerification: { __typename?: 'Enclosure', isVerified: boolean } };


export const GenericDevicesDocument = gql`
    query GenericDevices {
  GenericDevices {
    id
    name
    userEmail
    powerLoss
    maxTemp
    slots
    inputs
    outputs
    isVerified
    link
  }
}
    `;

export function useGenericDevicesQuery(options?: Omit<Urql.UseQueryArgs<GenericDevicesQueryVariables>, 'query'>) {
  return Urql.useQuery<GenericDevicesQuery, GenericDevicesQueryVariables>({ query: GenericDevicesDocument, ...options });
};
export const CircuitBreakerDocument = gql`
    query CircuitBreaker {
  CircuitBreakers {
    id
    name
    userEmail
    maxTemp
    ratedCurrent
    poleCount
    type
    powerLoss
    slots
    inputs
    outputs
    isVerified
    link
  }
}
    `;

export function useCircuitBreakerQuery(options?: Omit<Urql.UseQueryArgs<CircuitBreakerQueryVariables>, 'query'>) {
  return Urql.useQuery<CircuitBreakerQuery, CircuitBreakerQueryVariables>({ query: CircuitBreakerDocument, ...options });
};
export const RcDsDocument = gql`
    query RCDs {
  RCDs {
    id
    name
    currentType
    poleCount
    maxTemp
    breakTimeType
    ratedCurrent
    ratedResidualCurrent
    userEmail
    powerLoss
    slots
    inputs
    outputs
    isVerified
    link
  }
}
    `;

export function useRcDsQuery(options?: Omit<Urql.UseQueryArgs<RcDsQueryVariables>, 'query'>) {
  return Urql.useQuery<RcDsQuery, RcDsQueryVariables>({ query: RcDsDocument, ...options });
};
export const SurgeProtectorsDocument = gql`
    query SurgeProtectors {
  SurgeProtectors {
    id
    name
    type
    userEmail
    maxTemp
    powerLoss
    slots
    inputs
    outputs
    isVerified
    link
  }
}
    `;

export function useSurgeProtectorsQuery(options?: Omit<Urql.UseQueryArgs<SurgeProtectorsQueryVariables>, 'query'>) {
  return Urql.useQuery<SurgeProtectorsQuery, SurgeProtectorsQueryVariables>({ query: SurgeProtectorsDocument, ...options });
};
export const PlCsDocument = gql`
    query PLCs {
  PLCs {
    id
    name
    userEmail
    powerLoss
    maxTemp
    slots
    inputs
    outputs
    digitalIn
    digitalOut
    analogIn
    analogOut
    isVerified
    link
  }
}
    `;

export function usePlCsQuery(options?: Omit<Urql.UseQueryArgs<PlCsQueryVariables>, 'query'>) {
  return Urql.useQuery<PlCsQuery, PlCsQueryVariables>({ query: PlCsDocument, ...options });
};
export const PostGenericDeviceDocument = gql`
    mutation PostGenericDevice($id: String!, $name: String!, $inputs: Int!, $outputs: Int!, $slots: Int!, $powerLoss: Float!, $maxTemp: Float!, $userEmail: String!, $isVerified: Boolean!, $link: String) {
  postGenericDevice(
    id: $id
    name: $name
    inputs: $inputs
    outputs: $outputs
    slots: $slots
    powerLoss: $powerLoss
    maxTemp: $maxTemp
    userEmail: $userEmail
    isVerified: $isVerified
    link: $link
  ) {
    id
    name
    inputs
    outputs
    slots
    powerLoss
    maxTemp
    userEmail
    isVerified
    link
  }
}
    `;

export function usePostGenericDeviceMutation() {
  return Urql.useMutation<PostGenericDeviceMutation, PostGenericDeviceMutationVariables>(PostGenericDeviceDocument);
};
export const PostCircuitBreakerDocument = gql`
    mutation PostCircuitBreaker($id: String!, $name: String!, $poleCount: String!, $type: String!, $ratedCurrent: Int!, $inputs: Int!, $outputs: Int!, $slots: Int!, $powerLoss: Float!, $maxTemp: Float!, $userEmail: String!, $isVerified: Boolean!, $link: String) {
  postCircuitBreaker(
    id: $id
    name: $name
    poleCount: $poleCount
    type: $type
    ratedCurrent: $ratedCurrent
    inputs: $inputs
    outputs: $outputs
    slots: $slots
    powerLoss: $powerLoss
    maxTemp: $maxTemp
    userEmail: $userEmail
    isVerified: $isVerified
    link: $link
  ) {
    id
    name
    inputs
    outputs
    slots
    powerLoss
    maxTemp
    userEmail
    poleCount
    type
    ratedCurrent
    isVerified
    link
  }
}
    `;

export function usePostCircuitBreakerMutation() {
  return Urql.useMutation<PostCircuitBreakerMutation, PostCircuitBreakerMutationVariables>(PostCircuitBreakerDocument);
};
export const PostRcdDocument = gql`
    mutation PostRCD($id: String!, $name: String!, $poleCount: String!, $breakTimeType: String!, $ratedCurrent: Int!, $ratedResidualCurrent: Float!, $currentType: String!, $inputs: Int!, $outputs: Int!, $slots: Int!, $powerLoss: Float!, $maxTemp: Float!, $userEmail: String!, $isVerified: Boolean!, $link: String) {
  postRCD(
    id: $id
    name: $name
    poleCount: $poleCount
    currentType: $currentType
    ratedCurrent: $ratedCurrent
    ratedResidualCurrent: $ratedResidualCurrent
    breakTimeType: $breakTimeType
    inputs: $inputs
    outputs: $outputs
    slots: $slots
    powerLoss: $powerLoss
    maxTemp: $maxTemp
    userEmail: $userEmail
    isVerified: $isVerified
    link: $link
  ) {
    id
    name
    inputs
    outputs
    slots
    powerLoss
    maxTemp
    userEmail
    ratedCurrent
    poleCount
    currentType
    ratedResidualCurrent
    breakTimeType
    isVerified
    link
  }
}
    `;

export function usePostRcdMutation() {
  return Urql.useMutation<PostRcdMutation, PostRcdMutationVariables>(PostRcdDocument);
};
export const PostSurgeProtectorDocument = gql`
    mutation PostSurgeProtector($id: String!, $name: String!, $inputs: Int!, $outputs: Int!, $slots: Int!, $type: String!, $powerLoss: Float!, $maxTemp: Float!, $userEmail: String!, $isVerified: Boolean!, $link: String) {
  postSurgeProtector(
    id: $id
    name: $name
    inputs: $inputs
    outputs: $outputs
    slots: $slots
    type: $type
    powerLoss: $powerLoss
    maxTemp: $maxTemp
    userEmail: $userEmail
    isVerified: $isVerified
    link: $link
  ) {
    id
    name
    inputs
    outputs
    slots
    type
    powerLoss
    maxTemp
    userEmail
    isVerified
    link
  }
}
    `;

export function usePostSurgeProtectorMutation() {
  return Urql.useMutation<PostSurgeProtectorMutation, PostSurgeProtectorMutationVariables>(PostSurgeProtectorDocument);
};
export const PostPlcDocument = gql`
    mutation PostPLC($id: String!, $name: String!, $inputs: Int!, $outputs: Int!, $slots: Int!, $powerLoss: Float!, $maxTemp: Float!, $userEmail: String!, $digitalIn: Int!, $digitalOut: Int!, $analogIn: Int!, $analogOut: Int!, $isVerified: Boolean!, $link: String) {
  postPLC(
    id: $id
    name: $name
    inputs: $inputs
    outputs: $outputs
    slots: $slots
    powerLoss: $powerLoss
    maxTemp: $maxTemp
    userEmail: $userEmail
    digitalIn: $digitalIn
    digitalOut: $digitalOut
    analogIn: $analogIn
    analogOut: $analogOut
    isVerified: $isVerified
    link: $link
  ) {
    id
    name
    inputs
    outputs
    slots
    powerLoss
    maxTemp
    userEmail
    digitalIn
    digitalOut
    analogIn
    analogOut
    isVerified
    link
  }
}
    `;

export function usePostPlcMutation() {
  return Urql.useMutation<PostPlcMutation, PostPlcMutationVariables>(PostPlcDocument);
};
export const PostUserDocument = gql`
    mutation PostUser($email: String!, $name: String!) {
  postUser(email: $email, name: $name) {
    name
    email
    isCompany
    companyName
    companyICO
    genericDevices {
      id
      name
      powerLoss
      maxTemp
      inputs
      outputs
      slots
      userEmail
      isVerified
      link
    }
    circuitBreakers {
      id
      name
      powerLoss
      maxTemp
      inputs
      outputs
      slots
      ratedCurrent
      poleCount
      type
      userEmail
      isVerified
      link
    }
    RCDs {
      id
      name
      maxTemp
      currentType
      poleCount
      breakTimeType
      ratedCurrent
      ratedResidualCurrent
      userEmail
      powerLoss
      slots
      inputs
      outputs
      isVerified
      link
    }
    enclosures {
      id
      name
      totalSlots
      totalDIN
      oneDINSlots
      heatDissipation
      userEmail
      isVerified
      link
    }
    surgeProtectors {
      id
      name
      type
      userEmail
      maxTemp
      powerLoss
      slots
      inputs
      outputs
      isVerified
      link
    }
    PLCs {
      id
      name
      userEmail
      powerLoss
      maxTemp
      slots
      inputs
      outputs
      digitalIn
      digitalOut
      analogIn
      analogOut
      isVerified
      link
    }
    approval {
      userEmail
      approved
      companyICO
      companyName
      rejected
    }
  }
}
    `;

export function usePostUserMutation() {
  return Urql.useMutation<PostUserMutation, PostUserMutationVariables>(PostUserDocument);
};
export const DeleteGenericDeviceDocument = gql`
    mutation DeleteGenericDevice($id: String!) {
  deleteGenericDevice(id: $id) {
    id
  }
}
    `;

export function useDeleteGenericDeviceMutation() {
  return Urql.useMutation<DeleteGenericDeviceMutation, DeleteGenericDeviceMutationVariables>(DeleteGenericDeviceDocument);
};
export const DeleteCircuitBreakerDocument = gql`
    mutation DeleteCircuitBreaker($id: String!) {
  deleteCircuitBreaker(id: $id) {
    id
  }
}
    `;

export function useDeleteCircuitBreakerMutation() {
  return Urql.useMutation<DeleteCircuitBreakerMutation, DeleteCircuitBreakerMutationVariables>(DeleteCircuitBreakerDocument);
};
export const DeleteRcdDocument = gql`
    mutation DeleteRCD($id: String!) {
  deleteRCD(id: $id) {
    id
  }
}
    `;

export function useDeleteRcdMutation() {
  return Urql.useMutation<DeleteRcdMutation, DeleteRcdMutationVariables>(DeleteRcdDocument);
};
export const DeleteSurgeProtectorDocument = gql`
    mutation DeleteSurgeProtector($id: String!) {
  deleteSurgeProtector(id: $id) {
    id
  }
}
    `;

export function useDeleteSurgeProtectorMutation() {
  return Urql.useMutation<DeleteSurgeProtectorMutation, DeleteSurgeProtectorMutationVariables>(DeleteSurgeProtectorDocument);
};
export const DeletePlcDocument = gql`
    mutation DeletePLC($id: String!) {
  deletePLC(id: $id) {
    id
  }
}
    `;

export function useDeletePlcMutation() {
  return Urql.useMutation<DeletePlcMutation, DeletePlcMutationVariables>(DeletePlcDocument);
};
export const UsersDocument = gql`
    query Users {
  Users {
    name
    email
    companyName
    companyICO
    isCompany
    approval {
      approved
      rejected
    }
  }
}
    `;

export function useUsersQuery(options?: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'>) {
  return Urql.useQuery<UsersQuery, UsersQueryVariables>({ query: UsersDocument, ...options });
};
export const UserDocument = gql`
    query User($email: String!) {
  User(email: $email) {
    name
    email
    companyName
    companyICO
    isCompany
    genericDevices {
      id
      name
      powerLoss
      maxTemp
      inputs
      outputs
      slots
      userEmail
      isVerified
      link
    }
    RCDs {
      id
      name
      currentType
      maxTemp
      poleCount
      breakTimeType
      ratedCurrent
      ratedResidualCurrent
      userEmail
      powerLoss
      slots
      inputs
      outputs
      isVerified
      link
    }
    circuitBreakers {
      id
      name
      powerLoss
      maxTemp
      inputs
      outputs
      slots
      ratedCurrent
      poleCount
      type
      userEmail
      isVerified
      link
    }
    enclosures {
      id
      name
      totalSlots
      totalDIN
      oneDINSlots
      heatDissipation
      userEmail
      isVerified
      link
    }
    surgeProtectors {
      id
      name
      type
      userEmail
      maxTemp
      powerLoss
      slots
      inputs
      outputs
      isVerified
      link
    }
    PLCs {
      id
      name
      userEmail
      powerLoss
      maxTemp
      slots
      inputs
      outputs
      digitalIn
      digitalOut
      analogIn
      analogOut
      isVerified
      link
    }
    approval {
      approved
      rejected
    }
  }
}
    `;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'>) {
  return Urql.useQuery<UserQuery, UserQueryVariables>({ query: UserDocument, ...options });
};
export const VerifyUserDocument = gql`
    mutation VerifyUser($email: String!, $isVerified: Boolean!) {
  userVerification(email: $email, isVerified: $isVerified) {
    email
    isVerified
  }
}
    `;

export function useVerifyUserMutation() {
  return Urql.useMutation<VerifyUserMutation, VerifyUserMutationVariables>(VerifyUserDocument);
};
export const EnclosuresDocument = gql`
    query Enclosures {
  Enclosures {
    id
    name
    totalSlots
    totalDIN
    oneDINSlots
    heatDissipation
    userEmail
    isVerified
    link
  }
}
    `;

export function useEnclosuresQuery(options?: Omit<Urql.UseQueryArgs<EnclosuresQueryVariables>, 'query'>) {
  return Urql.useQuery<EnclosuresQuery, EnclosuresQueryVariables>({ query: EnclosuresDocument, ...options });
};
export const DeleteEnclosureDocument = gql`
    mutation DeleteEnclosure($id: String!) {
  deleteEnclosure(id: $id) {
    id
  }
}
    `;

export function useDeleteEnclosureMutation() {
  return Urql.useMutation<DeleteEnclosureMutation, DeleteEnclosureMutationVariables>(DeleteEnclosureDocument);
};
export const PostEnclosureDocument = gql`
    mutation PostEnclosure($id: String!, $name: String!, $totalSlots: Int!, $totalDIN: Int!, $oneDINSlots: Int!, $heatDissipation: Float!, $userEmail: String!, $isVerified: Boolean!, $link: String) {
  postEnclosure(
    id: $id
    name: $name
    totalSlots: $totalSlots
    totalDIN: $totalDIN
    oneDINSlots: $oneDINSlots
    heatDissipation: $heatDissipation
    userEmail: $userEmail
    isVerified: $isVerified
    link: $link
  ) {
    id
    name
    totalSlots
    totalDIN
    oneDINSlots
    heatDissipation
    userEmail
    isVerified
    link
  }
}
    `;

export function usePostEnclosureMutation() {
  return Urql.useMutation<PostEnclosureMutation, PostEnclosureMutationVariables>(PostEnclosureDocument);
};
export const RequestsDocument = gql`
    query Requests {
  CompanyRequests {
    userEmail
    approved
    companyICO
    companyName
    rejected
  }
}
    `;

export function useRequestsQuery(options?: Omit<Urql.UseQueryArgs<RequestsQueryVariables>, 'query'>) {
  return Urql.useQuery<RequestsQuery, RequestsQueryVariables>({ query: RequestsDocument, ...options });
};
export const RequestDocument = gql`
    query Request($userEmail: String!) {
  CompanyRequest(userEmail: $userEmail) {
    userEmail
    approved
    companyICO
    companyName
    rejected
  }
}
    `;

export function useRequestQuery(options: Omit<Urql.UseQueryArgs<RequestQueryVariables>, 'query'>) {
  return Urql.useQuery<RequestQuery, RequestQueryVariables>({ query: RequestDocument, ...options });
};
export const PostCompanyRequestDocument = gql`
    mutation PostCompanyRequest($userEmail: String!, $companyName: String!, $companyICO: Int!) {
  postCompanyRequest(
    userEmail: $userEmail
    companyICO: $companyICO
    companyName: $companyName
  ) {
    userEmail
    approved
    companyICO
    companyName
  }
}
    `;

export function usePostCompanyRequestMutation() {
  return Urql.useMutation<PostCompanyRequestMutation, PostCompanyRequestMutationVariables>(PostCompanyRequestDocument);
};
export const ApproveRequestDocument = gql`
    mutation ApproveRequest($userEmail: String!) {
  companyApprove(userEmail: $userEmail) {
    userEmail
    approved
    companyICO
    companyName
  }
}
    `;

export function useApproveRequestMutation() {
  return Urql.useMutation<ApproveRequestMutation, ApproveRequestMutationVariables>(ApproveRequestDocument);
};
export const RejectRequestDocument = gql`
    mutation RejectRequest($userEmail: String!) {
  companyReject(userEmail: $userEmail) {
    userEmail
    approved
    companyICO
    companyName
  }
}
    `;

export function useRejectRequestMutation() {
  return Urql.useMutation<RejectRequestMutation, RejectRequestMutationVariables>(RejectRequestDocument);
};
export const UpdateRequestDocument = gql`
    mutation UpdateRequest($userEmail: String!, $companyName: String!, $companyICO: Int!) {
  companyUpdate(
    userEmail: $userEmail
    companyICO: $companyICO
    companyName: $companyName
  ) {
    userEmail
    approved
    companyICO
    companyName
  }
}
    `;

export function useUpdateRequestMutation() {
  return Urql.useMutation<UpdateRequestMutation, UpdateRequestMutationVariables>(UpdateRequestDocument);
};
export const UserCompanyDocument = gql`
    mutation UserCompany($email: String!, $isCompany: Boolean!, $companyName: String!, $companyICO: Int!) {
  userCompany(
    email: $email
    isCompany: $isCompany
    companyName: $companyName
    companyICO: $companyICO
  ) {
    isVerified
  }
}
    `;

export function useUserCompanyMutation() {
  return Urql.useMutation<UserCompanyMutation, UserCompanyMutationVariables>(UserCompanyDocument);
};
export const VerifyGenericDocument = gql`
    mutation VerifyGeneric($id: String!, $isVerified: Boolean!) {
  genericVerification(id: $id, isVerified: $isVerified) {
    isVerified
  }
}
    `;

export function useVerifyGenericMutation() {
  return Urql.useMutation<VerifyGenericMutation, VerifyGenericMutationVariables>(VerifyGenericDocument);
};
export const VerifyCircuitDocument = gql`
    mutation VerifyCircuit($id: String!, $isVerified: Boolean!) {
  circuitVerification(id: $id, isVerified: $isVerified) {
    isVerified
  }
}
    `;

export function useVerifyCircuitMutation() {
  return Urql.useMutation<VerifyCircuitMutation, VerifyCircuitMutationVariables>(VerifyCircuitDocument);
};
export const VerifyPlcDocument = gql`
    mutation VerifyPlc($id: String!, $isVerified: Boolean!) {
  plcVerification(id: $id, isVerified: $isVerified) {
    isVerified
  }
}
    `;

export function useVerifyPlcMutation() {
  return Urql.useMutation<VerifyPlcMutation, VerifyPlcMutationVariables>(VerifyPlcDocument);
};
export const VerifyRcdDocument = gql`
    mutation VerifyRcd($id: String!, $isVerified: Boolean!) {
  rcdVerification(id: $id, isVerified: $isVerified) {
    isVerified
  }
}
    `;

export function useVerifyRcdMutation() {
  return Urql.useMutation<VerifyRcdMutation, VerifyRcdMutationVariables>(VerifyRcdDocument);
};
export const VerifySurgeDocument = gql`
    mutation VerifySurge($id: String!, $isVerified: Boolean!) {
  surgeVerification(id: $id, isVerified: $isVerified) {
    isVerified
  }
}
    `;

export function useVerifySurgeMutation() {
  return Urql.useMutation<VerifySurgeMutation, VerifySurgeMutationVariables>(VerifySurgeDocument);
};
export const VerifyEnclosureDocument = gql`
    mutation VerifyEnclosure($id: String!, $isVerified: Boolean!) {
  enclosureVerification(id: $id, isVerified: $isVerified) {
    isVerified
  }
}
    `;

export function useVerifyEnclosureMutation() {
  return Urql.useMutation<VerifyEnclosureMutation, VerifyEnclosureMutationVariables>(VerifyEnclosureDocument);
};