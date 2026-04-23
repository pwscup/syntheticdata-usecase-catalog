import { z } from "zod";

// Source schema (for seed data / full validation)
export const sourceSchema = z.object({
  source_type: z.enum(["pdf", "web"]).default("web"),
  title: z.string().default(""),
  url: z.string().min(1),
  note: z.string().default(""),
});

// Source schema for form (only URL required)
export const sourceFormSchema = z.object({
  source_type: z.enum(["pdf", "web"]).default("web"),
  title: z.string().default(""),
  url: z.string().min(1, "URLは必須です"),
  note: z.string().default(""),
});

// Data Flow
const dataFlowNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  category: z.string().min(1),
});

const dataFlowEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().min(1),
});

export const dataFlowDataSchema = z.object({
  nodes: z.array(dataFlowNodeSchema),
  edges: z.array(dataFlowEdgeSchema),
});

// Risk Matrix
const riskMatrixAxesSchema = z.object({
  impact_levels: z.array(z.string()),
  likelihood_levels: z.array(z.string()),
});

const riskMatrixCellSchema = z.object({
  impact: z.string().min(1),
  likelihood: z.string().min(1),
  note: z.string().default(""),
});

export const riskMatrixDataSchema = z.object({
  axes: riskMatrixAxesSchema,
  cells: z.array(riskMatrixCellSchema),
});

// Utility Chart
const utilityChartPointSchema = z.object({
  x: z.string(),
  y: z.number(),
});

const utilityChartSeriesSchema = z.object({
  name: z.string().min(1),
  points: z.array(utilityChartPointSchema),
});

export const utilityChartDataSchema = z.object({
  series: z.array(utilityChartSeriesSchema),
});

// Figure schema (discriminated union on type)
export const figureSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("data_flow"),
    title: z.string().min(1),
    data: dataFlowDataSchema,
    note: z.string().default(""),
  }),
  z.object({
    type: z.literal("risk_matrix"),
    title: z.string().min(1),
    data: riskMatrixDataSchema,
    note: z.string().default(""),
  }),
  z.object({
    type: z.literal("utility_chart"),
    title: z.string().min(1),
    data: utilityChartDataSchema,
    note: z.string().default(""),
  }),
]);

// Case schema
export const caseSchema = z.object({
  id: z.string().min(1),
  title: z.string().default(""),
  region: z.enum(["国内", "国外"]).optional(),
  domain: z.string().default(""),
  domain_sub: z.string().optional(),
  organization: z.string().default(""),
  usecase_category: z.union([
    z.array(z.string()),
    z.string().transform((s) => (s ? [s] : [])),
  ]).default([]),
  technology_category: z.union([
    z.array(z.enum(["synthetic_data", "differential_privacy", "anonymization", "federated_learning", "secure_computation", "distributed_analytics"])),
    z.enum(["synthetic_data", "differential_privacy", "anonymization", "federated_learning", "secure_computation", "distributed_analytics"]).transform((s) => [s]),
  ]).default(["synthetic_data"]),
  review_status: z
    .enum(["ai_generated", "human_reviewed", "flagged", "under_review"])
    .default("ai_generated"),
  image: z.string().optional(),
  summary: z.string().default(""),
  value_proposition: z.string().default("調査中"),
  privacy_enhancement_method: z.string().default("調査中"),
  safety_assurance_method: z.string().default("調査中"),
  utility_evaluation_method: z.string().default("調査中"),
  tags: z.array(z.string()).default([]),
  editorial_notes: z.array(z.string()).optional(),
  sources: z.array(sourceSchema).min(1),
  figures: z.array(figureSchema).default([]),
  occurred_at: z.string().nullable().optional().default(null),
  status: z
    .enum(["seed", "user", "draft", "published", "archived"])
    .default("user"),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
});

// Figure schema for form (everything optional; empty entries are filtered/normalized on submit)
const dataFlowNodeFormSchema = z.object({
  id: z.string().default(""),
  label: z.string().default(""),
  category: z.string().default(""),
});

const dataFlowDataFormSchema = z.object({
  nodes: z.array(dataFlowNodeFormSchema).default([]),
  edges: z.array(dataFlowEdgeSchema).default([]),
});

export const figureFormSchema = z.object({
  type: z
    .enum(["data_flow", "risk_matrix", "utility_chart"])
    .default("data_flow"),
  title: z.string().default(""),
  // フォーム上は data_flow 用の緩いスキーマを使う。非 data_flow 型の data は
  // CaseForm 側で undefined にし、submit時に defaultValues から透過復元する
  data: dataFlowDataFormSchema.optional(),
  note: z.string().default(""),
});

// Form schema (only source URL is required, everything else optional)
export const caseFormSchema = z.object({
  title: z.string().default(''),
  region: z.enum(['国内', '国外']).optional(),
  domain: z.string().default(''),
  domain_sub: z.string().optional(),
  organization: z.string().default(''),
  usecase_category: z.array(z.string()).default([]),
  technology_category: z.array(z.enum(['synthetic_data', 'differential_privacy', 'anonymization', 'federated_learning', 'secure_computation', 'distributed_analytics'])).default(['synthetic_data']),
  review_status: z.enum(['ai_generated', 'human_reviewed', 'flagged', 'under_review']).default('ai_generated'),
  summary: z.string().default(''),
  value_proposition: z.string().default(''),
  privacy_enhancement_method: z.string().default('調査中'),
  safety_assurance_method: z.string().default('調査中'),
  utility_evaluation_method: z.string().default('調査中'),
  occurred_at: z.string().nullable().optional().default(null),
  tags: z.array(z.string()).default([]),
  sources: z.array(sourceFormSchema).min(1, '出典は最低1件必要です'),
  figures: z.array(figureFormSchema).default([]),
})

export type CaseFormData = z.infer<typeof caseFormSchema>

// Case Catalog schema
export const caseCatalogSchema = z.object({
  schema_version: z.string().min(1),
  cases: z.array(caseSchema),
});
