// Region
export type Region = "国内" | "国外";

// Source type
export type SourceType = "pdf" | "web";

// Figure type
export type FigureType = "data_flow" | "risk_matrix" | "utility_chart";

// Case status
export type CaseStatus = "seed" | "user" | "draft" | "published" | "archived";

// Technology category (PETs)
export type TechnologyCategory =
  | "synthetic_data"
  | "differential_privacy"
  | "anonymization"
  | "federated_learning"
  | "secure_computation";

// Review status
export type ReviewStatus =
  | "ai_generated"
  | "human_reviewed"
  | "flagged"
  | "under_review";

// Source
export interface Source {
  source_type: SourceType;
  title: string;
  url: string;
  note: string;
}

// Data Flow
export interface DataFlowNode {
  id: string;
  label: string;
  category: string;
}

export interface DataFlowEdge {
  from: string;
  to: string;
  label: string;
}

export interface DataFlowData {
  nodes: DataFlowNode[];
  edges: DataFlowEdge[];
}

// Risk Matrix
export interface RiskMatrixAxes {
  impact_levels: string[];
  likelihood_levels: string[];
}

export interface RiskMatrixCell {
  impact: string;
  likelihood: string;
  note: string;
}

export interface RiskMatrixData {
  axes: RiskMatrixAxes;
  cells: RiskMatrixCell[];
}

// Utility Chart
export interface UtilityChartPoint {
  x: string;
  y: number;
}

export interface UtilityChartSeries {
  name: string;
  points: UtilityChartPoint[];
}

export interface UtilityChartData {
  series: UtilityChartSeries[];
}

// Figure
export interface Figure {
  type: FigureType;
  title: string;
  data: DataFlowData | RiskMatrixData | UtilityChartData;
  note: string;
}

// Case
export interface Case {
  id: string;
  title: string;
  region?: Region;
  domain: string;
  domain_sub?: string;
  organization: string;
  usecase_category: string[];
  technology_category: TechnologyCategory[];
  review_status: ReviewStatus;
  image?: string;
  summary: string;
  value_proposition: string;
  synthetic_generation_method: string;
  safety_evaluation_method: string;
  utility_evaluation_method: string;
  tags: string[];
  editorial_notes?: string[];
  sources: Source[];
  figures: Figure[];
  status: CaseStatus;
  created_at: string;
  updated_at: string;
}

// Case Catalog (root schema)
export interface CaseCatalog {
  schema_version: string;
  cases: Case[];
}
