export enum BlockTypeEnum {
  FEATURED_CARDS = 'featured-cards',
}

export enum ImageSizeEnum {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum ImageStyleEnum {
  NO_BORDER = 'no-border',
  WITH_BORDER = 'with-border',
}

export enum FormTypeEnum {
  LOCATION_INFORMATION = 'location-information',
  HARDWARE_CONFIGURATION = 'hardware-configuration',
  WATER_CONSUMPTION = 'water-consumption',
  ELECTRICITY_CONSUMPTION = 'electricity-consumption',
  RENEWABLE_ENERGY_PRODUCED = 'renewable-energy-produced',
  ENERGY_PRODUCATION_DATA = 'energy-production-data', //same as RENEWABLE_ENERGY_PRODUCED
  RENEWABLE_ENERGY_PROCUREMENT = 'renewable-energy-procurement',
  PRELIMINARY_RESULTS = 'preliminary-results',
  AUDIT_REVIEW = 'audit-review',
}

export enum SpacingBreakpointsEnum {
  DESKTOP_REGULAR_MOBILE_TINY = 'desptop-regular-mobile-tiny', //2.5rem desktop, 0.5 mobile
  DESKTOP_REGULAR_MOBILE_SMALL = 'desptop-regular-mobile-small', //2.5rem desktop, 1rem mobile
  DESKTOP_REGULAR_MOBILE_REGULAR = 'desptop-regular-mobile-regular', //2.5rem desktop, 2rem mobile
}

//Airtable
export enum AirtableReviewStatusEnum {
  IN_REVIEW = 'In Review',
  AUDITED = 'Audited',
  COMPLETE = 'complete',
  IN_PROGRESS = 'review-in-progress',
  MORE_DATA_NEEDED = 'More Data Needed',
  NOT_STARTED = 'Not Started',
}

export enum ReviewStatusEnum {
  IN_REVIEW = 'in-review',
  AUDITED = 'audited',
  COMPLETE = 'complete',
  IN_PROGRESS = 'in-progress',
  MORE_DATA_NEEDED = 'more-data-needed',
  NOT_STARTED = 'not-started',
  NOT_SUBMITTED = 'not-submitted',
  APPROVED = 'approved',
  NEEDS_REVIEW = 'needs-review',
}

export interface AuditorProfile {
  auditingFirm: string;
  auditorFullName: string;
  city: string;
  country: string;
  email: string;
  profileType: UserProfileTypeEnum.AUDITOR;
  state: string;
  streetAddress: string;
  userId: string;
  zipcode: string;
  dataConsent: string;
}

export interface AuditorProfileDatabase {
  auditing_firm: string;
  auditor_full_name: string;
  city: string;
  country: string;
  email: string;
  profile_type: UserProfileTypeEnum.AUDITOR;
  state: string;
  street_address: string;
  user_id: string;
  zipcode: string;
  data_consent: string;
}

export interface EVPStatuses {
  electricityConsumptionForm: AirtableReviewStatusEnum;
  energyProcuredForm: AirtableReviewStatusEnum;
  energyProducedForm: AirtableReviewStatusEnum;
  reMatchingForm: AirtableReviewStatusEnum;
  waterConsumptionForm: AirtableReviewStatusEnum;
}

export interface RequestOptions extends RequestInit {
  headers: {
    'X-API-KEY': string;
  };
  cache?: RequestCache;
}

export interface MinerIds {
  minerId: string;
  ipAddress: string;
}

export enum UserProfileTypeEnum {
  PROVIDER = 'provider',
  STORAGE_PROVIDER = 'storage-provider',
  AUDITOR = 'auditor',
}

export interface UserProfile {
  profileType: UserProfileTypeEnum | null | string;
}

export interface ProviderProfile extends UserProfile {
  city: string;
  country: string;
  email: string;
  fullName: string;
  state: string;
  streetAddress: string;
  zipcode: string;
  minerIds: MinerIds[];
  dataConsent?: string;
  emailConsent: boolean | string;
  entityCompany: string;
  provider: FilecoinSP | ICPNodeOperator | SolanaOperator | BTCOperator;
}

export enum ProviderTypeEnum {
  ETH_VALIDATOR = 'eth-validator',
  FILECOIN_SP = 'filecoin-sp',
  SOLANA_VALIDATOR = 'solana-validator',
  ICP_NODE_OPERATOR = 'icp-node-operator',
  BTC_MINER = 'btc-miner',
}

export enum EVPTimePeriodEnum {
  NONE = 'none',
  ONE_QUARTER = 'one quarter',
  ONE_YEAR = 'one year',
  ONE_MONTH = 'one month',
  SIX_MONTHS = 'six months',
}

export interface FilecoinSP {
  type: ProviderTypeEnum.FILECOIN_SP;
  minerId: string;
}

export interface ICPNodeOperator {
  type: ProviderTypeEnum.ICP_NODE_OPERATOR;
  nodePrincipleId: string;
  nodeMachineId: string;
}

export interface SolanaOperator {
  type: ProviderTypeEnum.SOLANA_VALIDATOR;
  solanaAddress: string;
}

export interface BTCOperator {
  type: ProviderTypeEnum.BTC_MINER;
  btcAddress: string;
}

export interface EthValidator {
  type: ProviderTypeEnum.ETH_VALIDATOR;
  ethAddress: string;
}

export interface ProviderProfileDatabase extends UserProfile {
  city: string;
  country: string;
  email: string;
  full_name: string;
  provider_location: string;
  provider_zipcode: string;
  state: string;
  street_address: string;
  zipcode: string;
  miner_ids: MinerIds[];
  data_consent: string;
  email_consent: string;
}

export interface AuditDatabase {
  created_at: string;
  type: DocumentType.STORAGE_PROVIDER_AUDIT_REPORT;
  evp_report: EVPReportDatabase;
  greenscore: any | null;
}

export interface EVPReportDatabase {
  type: DocumentType.EVP_DOCUMENT;
  user_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  audit_status: ReviewStatusEnum;
  location_information: ProviderLocationFormDatabase;
  hardware_configuration: HardwareFormDatabase;
  water_consumption: WaterConsumptionFormDatabase;
  electricity_consumption: ElectricityConsumptionFormDatabase;
  energy_production: RenewableEnergyProducedDatabase;
  renewable_energy_procurement: EnergyProcuredFormDatabase;
  preliminary_results_rec_matching: PreliminaryResultsRecMatchingDatabase;
  audit_review: AuditReviewDatabase;
}

export interface RenewableEnergyProduced {
  frequencyOfMesurement: string;
  renewableEnergyUsage: string;
  inspectionDate: string;
  inspectionFiles: string[] | null;
  installationDate: string;
  methodOfMesurement: string;
  numberOfSolarPanels: string;
  solarPanelBrand: string;
  solarPanelModalNumber: any;
  solarWattPeak: string;
  purchaseFiles: string[];
  createdAt: string;
  updatedAt: string;
  totalElectricityControlled: string;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
}

export interface RenewableEnergyProducedDatabase {
  frequency_of_mesurement: string;
  inspection_date: string;
  renewable_energy_usage: string;
  inspection_files: string[];
  installation_date: string;
  method_of_mesurement: string;
  number_of_solar_panels: string;
  solar_panel_brand: string;
  solar_panel_modal_number: any;
  solar_watt_peak: string;
  purchase_files: string[];
  created_at: string;
  updated_at: string;
  total_electricity_controlled: string;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
  creation_date: string;
}

export interface PreliminaryResultsRecMatching {
  actualElectricityConsumed: string;
  actualElectricityDelivered: string;
  actualElectricityReturned: string;
  emissionsFactor: number;
  totalEmissions: number;
  supportingFile?: any;
  timePeriod: string;
  //creationDate: string;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
}

export interface PreliminaryResultsRecMatchingDatabase {
  actual_electricity_consumed: string;
  actual_electricity_delivered: string;
  actual_electricity_returned: string;
  supporting_file: any;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
  // creation_date: string;
}

export interface EnergyProcuredForm {
  actualElectricityDelivered: string;
  actualElectricityReturned: string;
  documentFiles: string[];
  endDate: string;
  energyUsage: string;
  renewableEnergyPurchasedFrom: string;
  renewableEnergyType: string;
  startDate: string;
  supportingFiles: string[];
  createdAt: string;
  updatedAt: string;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
}

export interface EnergyProcuredFormDatabase {
  actual_electricity_delivered: string;
  actual_electricity_returned: string;
  document_files: string[];
  end_date: string;
  energy_usage: string;
  renewable_energy_purchased_from: string;
  renewable_energy_ype: string;
  start_date: string;
  supporting_files: string[];
  created_at: string;
  updated_at: string;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
}

export interface ProviderLocationForm {
  addressConfirmed: string;
  createdAt: string;
  entityCompany: string;
  providerCity: string;
  providerCountry: string;
  providerLocation: string;
  providerState: string;
  providerZipcode: string;
  status: ReviewStatusEnum.IN_REVIEW;
  updatedAt: string;
}

export interface ProviderLocationFormDatabase {
  created_at: string;
  entity_company: string;
  provider_city: string;
  provider_country: string;
  provider_location: string;
  provider_state: string;
  provider_zipcode: string;
  updated_at: string;
}

export interface HardwareConfigurationDatabase {
  name: string;
  function: string;
  miner_id: string;
  hardware_status: string;
  hardware_details: string;
  supporting_file: string;
}

export interface HardwareForm {
  //hardwareConfiguration: HardwareConfiguration[];
  hardware: Hardware;
  status: ReviewStatusEnum.IN_REVIEW;
  createdAt: string;
  updatedAt: string;
}

export interface Hardware {
  hardwareType: string;
  description: string;
  supportingFile?: string[];
  hardwareDetails: string;
}

export interface HardwareFormDatabase {
  hardware_configuration: HardwareConfigurationDatabase;
  status: ReviewStatusEnum.IN_REVIEW;
}

export interface ElectricityConsumptionForm {
  electricityCompany: string;
  startDate: string;
  endDate: string;
  reference: string;
  annualElectricityUsage: string;
  electricityNotPoweringInfrastructure: string;
  estimationMethodology: string;
  actualElectricityReturned: string;
  actualElectricityConsumed: string;
  actualElectricityDelivered: string;
  electricityBillFiles: string[];
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
}

export interface ElectricityConsumptionFormDatabase {
  electricity_company: string;
  electricity_consumption_start_date: string;
  electricityConsumptionEndDate: string;
  reference: string;
  annual_electricity_usage: string;
  electricity_not_powering_infrastructure: string;
  estimation_methodology: string;
  actual_electricity_returned: string;
  actual_electricity_consumed: string;
  actual_electricity_delivered: string;
  electricity_bill_file: string;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
}

export interface WaterConsumptionForm {
  createdAt: string;
  updatedAt: string;
  endDate: string;
  reference: string;
  waterUsage: string;
  startDate: string;
  waterBillFiles?: string[] | [];
  waterCompany: string;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
}

export interface WaterConsumptionFormDatabase {
  created_at: string;
  updated_at: string;
  endDate: string;
  reference: string;
  waterUsage: string;
  startDate: string;
  waterBillFiles?: string[] | null;
  waterCompany: string;
  status: ReviewStatusEnum.APPROVED | ReviewStatusEnum.IN_REVIEW;
}

export interface EVPReport {
  type: DocumentType.EVP_DOCUMENT;
  userId: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  auditStatus: ReviewStatusEnum;
  locationInformation: Location;
  hardwareConfiguration: HardwareForm;
  waterConsumption: WaterConsumptionForm;
  electricityConsumption: ElectricityConsumptionForm;
  energyProduction: EnergyProcuredForm;
  renewableEnergyProcurement: any; //todo
  preliminaryResultsRecMatching: any; //todo
  auditReview: AuditReview;
}
export enum DocumentType {
  STORAGE_PROVIDER_AUDIT_REPORT = 'storage-provider-audit-report-document',
  EVP_DOCUMENT = 'evp-document',
  GREENSCORE_DOCUMENT = 'greenscore-document',
  AUDIT_EVP_CALCULATION_DOCUMENT = 'audit-evp-calculation-document',
}

export interface AuditReview {
  providerEvpStatus: ReviewStatusEnum.COMPLETE;
  providerEvpSubmissionDate: any | string;
  // auditorEvpOutputStatus?: ReviewStatusEnum.NOT_STARTED;
  // auditorEvpSubmissionDate?: ReviewStatusEnum.NOT_STARTED;
  reportOption: string;
}

export interface AuditReviewDatabase {
  provider_evp_status: ReviewStatusEnum.COMPLETE;
  provider_evp_submission_date: any | string;
  auditor_evp_output_status?: ReviewStatusEnum.NOT_STARTED;
  submission_date?: any | string;
  report_option: string;
}

export interface ReportPeriod {
  reportEndDate: string;
  reportStartDate: string;
}

export interface ReportPeriodDatabase {
  report_end_date: string;
  report_start_date: string;
}

export interface Greenscore {
  type: UserProfileTypeEnum.PROVIDER;
  status: ReviewStatusEnum.COMPLETE | ReviewStatusEnum.IN_REVIEW;
  documentId: string;
  entityCompany: string;
  providerLocation: string;
  providerCountry: string;
  providerEmail: string;
  reportStartDate: string;
  reportEndDate: string;
  scope2EmissionsCalculation: any;
  gridEmissionsFactor: any;
  globalAverageGridEmissionsFactor: number;
  emissionIntensityCalculation: any;
  networkScope2EmissionsCalculation: any;
  benchmarkEmissionIntensity: number;
  marginalEmissionsFactor: number;
  marginalEmissionsIntensity: number;
  networkMarginalEmissions: any;
  benchmarkMarginalEmissionIntensity: number;
  normalizedMarginalEmissionIntensity: number;
  confidenceScoreDetails: GreenscoreConfidenceScoreDetails;
  normalizedEl: number;
  emissionsScore: string;
  locationScore: string;
  confidenceScore: string;
  greenScore: string;
}

export interface GreenscoreConfidenceScoreDetails {
  locationConfidence: string;
  nodeIdConfidence: string;
  hardwareConfidence: string;
  waterUseConfidence: string;
  energyUseConfidence: string;
}
