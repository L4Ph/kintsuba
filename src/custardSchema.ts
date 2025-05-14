import { z } from "zod";

// 基本的な型定義
const CustardMetadataSchema = z.object({
	custard_version: z.string(),
	display_name: z.string(),
});

const CustardKeyLayoutSchema = z.object({
	type: z.enum(["grid_fit", "grid_scroll"]),
	row_count: z.number(),
	column_count: z.number(),
	direction: z.enum(["vertical", "horizontal"]).optional(),
});

// キーの具体的な構造はまだ不明なため、一旦 z.any() としておく
// TODO: キーの詳細なスキーマを定義する
const CustardKeySchema = z.any();

const CustardInterfaceSchema = z.object({
	key_layout: CustardKeyLayoutSchema,
	key_style: z.enum(["tenkey_style", "pc_style"]),
	keys: z.array(CustardKeySchema),
});

export const CustardSchema = z.object({
	identifier: z.string(),
	language: z.string(), // より厳密には enum(["ja_JP", "en_US", ...]) なども可能
	input_style: z.string(), // 同上 enum(["direct", "roman2kana"])
	metadata: CustardMetadataSchema,
	interface: CustardInterfaceSchema,
});

// 配列形式のCustardにも対応
export const CustardArraySchema = z.array(CustardSchema);

export type Custard = z.infer<typeof CustardSchema>;
