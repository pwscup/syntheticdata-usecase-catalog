import { describe, it, expect } from "vitest";
import {
  caseSchema,
  caseCatalogSchema,
  figureSchema,
} from "../schemas/case.schema";

/** Helper: minimal valid case data (all required fields) */
function validCaseInput(overrides: Record<string, unknown> = {}) {
  return {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "合成データによる金融リスク分析",
    region: "国内" as const,
    organization: "テスト銀行",
    summary: "合成データを活用した金融リスク分析の事例",
    sources: [
      {
        source_type: "web" as const,
        title: "参考記事",
        url: "https://example.com/article",
        note: "",
      },
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("caseSchema", () => {
  it("有効なCaseデータでバリデーションが通る", () => {
    const input = validCaseInput();
    const result = caseSchema.parse(input);

    expect(result.title).toBe("合成データによる金融リスク分析");
    expect(result.region).toBe("国内");
    expect(result.status).toBe("user");
  });

  it("domain/usecase_categoryが未指定でもデフォルト値で通る", () => {
    const input = validCaseInput();
    const result = caseSchema.parse(input);

    expect(result.domain).toBe("");
    expect(result.usecase_category).toEqual([]);
  });

  it("domain/usecase_categoryが指定されていれば保持される", () => {
    const input = validCaseInput({ domain: "金融", usecase_category: ["組織内共有"] });
    const result = caseSchema.parse(input);

    expect(result.domain).toBe("金融");
    expect(result.usecase_category).toEqual(["組織内共有"]);
  });

  it("usecase_categoryが文字列の場合に配列に変換される（後方互換）", () => {
    const input = validCaseInput({ usecase_category: "組織内共有" });
    const result = caseSchema.parse(input);

    expect(result.usecase_category).toEqual(["組織内共有"]);
  });

  it("imageフィールドがオプションで受け入れられる", () => {
    const input = validCaseInput({ image: "test-image.png" });
    const result = caseSchema.parse(input);

    expect(result.image).toBe("test-image.png");
  });

  it("imageフィールドが未指定でも通る", () => {
    const input = validCaseInput();
    const result = caseSchema.parse(input);

    expect(result.image).toBeUndefined();
  });

  it("titleが空でもデフォルト値で通る（任意フィールド）", () => {
    const input = validCaseInput({ title: "" });
    const result = caseSchema.parse(input);
    expect(result.title).toBe("");
  });

  it("domain_subがオプションで受け入れられる", () => {
    const input = validCaseInput({ domain_sub: "保険" });
    const result = caseSchema.parse(input);
    expect(result.domain_sub).toBe("保険");
  });

  it("domain_subが未指定でも通る", () => {
    const input = validCaseInput();
    const result = caseSchema.parse(input);
    expect(result.domain_sub).toBeUndefined();
  });

  it("editorial_notesがオプションで受け入れられる", () => {
    const input = validCaseInput({ editorial_notes: ["メモ1", "メモ2"] });
    const result = caseSchema.parse(input);
    expect(result.editorial_notes).toEqual(["メモ1", "メモ2"]);
  });

  it("editorial_notesが未指定でも通る", () => {
    const input = validCaseInput();
    const result = caseSchema.parse(input);
    expect(result.editorial_notes).toBeUndefined();
  });

  it("regionが不正値の場合にバリデーションエラー", () => {
    const input = validCaseInput({ region: "海外" });
    expect(() => caseSchema.parse(input)).toThrow();
  });

  it("sourcesが空配列の場合にバリデーションエラー", () => {
    const input = validCaseInput({ sources: [] });
    expect(() => caseSchema.parse(input)).toThrow();
  });

  it("「調査中」がデフォルト値として設定される", () => {
    const input = validCaseInput();
    const result = caseSchema.parse(input);

    expect(result.value_proposition).toBe("調査中");
    expect(result.privacy_enhancement_method).toBe("調査中");
    expect(result.safety_assurance_method).toBe("調査中");
    expect(result.utility_evaluation_method).toBe("調査中");
    expect(result.tags).toEqual([]);
    expect(result.figures).toEqual([]);
    expect(result.status).toBe("user");
  });

  it("technology_categoryが未指定でもデフォルト値['synthetic_data']で通る", () => {
    const input = validCaseInput();
    const result = caseSchema.parse(input);
    expect(result.technology_category).toEqual(["synthetic_data"]);
  });

  it("technology_categoryが配列で指定されていれば保持される", () => {
    const input = validCaseInput({ technology_category: ["differential_privacy", "anonymization"] });
    const result = caseSchema.parse(input);
    expect(result.technology_category).toEqual(["differential_privacy", "anonymization"]);
  });

  it("technology_categoryが文字列の場合に配列に変換される（後方互換）", () => {
    const input = validCaseInput({ technology_category: "federated_learning" });
    const result = caseSchema.parse(input);
    expect(result.technology_category).toEqual(["federated_learning"]);
  });

  it("technology_categoryが不正値の場合にバリデーションエラー", () => {
    const input = validCaseInput({ technology_category: ["invalid_tech"] });
    expect(() => caseSchema.parse(input)).toThrow();
  });

  it("review_statusが未指定でもデフォルト値'ai_generated'で通る", () => {
    const input = validCaseInput();
    const result = caseSchema.parse(input);
    expect(result.review_status).toBe("ai_generated");
  });

  it("review_statusが指定されていれば保持される", () => {
    const input = validCaseInput({ review_status: "human_reviewed" });
    const result = caseSchema.parse(input);
    expect(result.review_status).toBe("human_reviewed");
  });

  it("review_statusが不正値の場合にバリデーションエラー", () => {
    const input = validCaseInput({ review_status: "invalid_status" });
    expect(() => caseSchema.parse(input)).toThrow();
  });
});

describe("figureSchema", () => {
  it("有効なFigure(data_flow)でバリデーションが通る", () => {
    const input = {
      type: "data_flow" as const,
      title: "データフロー図",
      data: {
        nodes: [{ id: "n1", label: "データソース", category: "source" }],
        edges: [{ from: "n1", to: "n2", label: "変換" }],
      },
      note: "備考",
    };
    const result = figureSchema.parse(input);
    expect(result.type).toBe("data_flow");
    expect(result.title).toBe("データフロー図");
  });

  it("有効なFigure(risk_matrix)でバリデーションが通る", () => {
    const input = {
      type: "risk_matrix" as const,
      title: "リスクマトリクス",
      data: {
        axes: {
          impact_levels: ["低", "中", "高"],
          likelihood_levels: ["低", "中", "高"],
        },
        cells: [{ impact: "高", likelihood: "中", note: "要対応" }],
      },
      note: "",
    };
    const result = figureSchema.parse(input);
    expect(result.type).toBe("risk_matrix");
  });

  it("有効なFigure(utility_chart)でバリデーションが通る", () => {
    const input = {
      type: "utility_chart" as const,
      title: "有用性チャート",
      data: {
        series: [
          {
            name: "精度",
            points: [
              { x: "2024Q1", y: 0.85 },
              { x: "2024Q2", y: 0.92 },
            ],
          },
        ],
      },
      note: "四半期ごとの精度推移",
    };
    const result = figureSchema.parse(input);
    expect(result.type).toBe("utility_chart");
  });
});

describe("caseCatalogSchema", () => {
  it("有効なカタログデータのバリデーションが通る", () => {
    const input = {
      schema_version: "1.0",
      cases: [validCaseInput()],
    };
    const result = caseCatalogSchema.parse(input);
    expect(result.schema_version).toBe("1.0");
    expect(result.cases).toHaveLength(1);
    expect(result.cases[0].title).toBe("合成データによる金融リスク分析");
  });
});
