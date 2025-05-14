import { useState } from "react";
import type { ChangeEvent } from "react"; // ChangeEventをtype-only importに変更
import "./App.css";
import Ajv, { type ValidateFunction } from "ajv"; // ValidateFunctionをインポート
import { zodToJsonSchema } from "zod-to-json-schema";
import {
	CustardSchema,
	CustardArraySchema,
	type Custard,
} from "./custardSchema"; // Custardをtype-only importに変更

const ajv = new Ajv();

function App() {
	const [custard, setCustard] = useState<Custard | null>(null); // 初期状態をnullに
	const [identifier, setIdentifier] = useState("my_flick");
	const [language, setLanguage] = useState("ja_JP");
	const [inputStyle, setInputStyle] = useState("direct");
	const [custardVersion, setCustardVersion] = useState("1.0");
	const [displayName, setDisplayName] = useState("私のフリック");

	const [keyLayoutType, setKeyLayoutType] = useState<
		"grid_fit" | "grid_scroll"
	>("grid_fit");
	const [rowCount, setRowCount] = useState(5);
	const [columnCount, setColumnCount] = useState(4);
	const [scrollDirection, setScrollDirection] = useState<
		"vertical" | "horizontal"
	>("vertical");

	const [keyStyle, setKeyStyle] = useState<"tenkey_style" | "pc_style">(
		"tenkey_style",
	);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [keys, setKeys] = useState<any[]>([]); // キーのデータは後で詳細化
	const [error, setError] = useState<string | null>(null);

	const handleAddKey = () => {
		// ダミーのキーデータを追加
		setKeys([
			...keys,
			{ temp_id: Date.now(), label: `キー ${keys.length + 1}` },
		]);
	};

	const generateCustardJson = () => {
		if (!custard && !identifier) {
			// custardがnullの場合、identifierも考慮
			setError("データが読み込まれていません。");
			return;
		}

		const custardData: Custard = custard ?? {
			// custardがnullの場合、現在のフォームの値から生成
			identifier,
			language,
			input_style: inputStyle,
			metadata: {
				custard_version: custardVersion,
				display_name: displayName,
			},
			interface: {
				key_layout: {
					type: keyLayoutType,
					row_count: rowCount,
					column_count: columnCount,
					...(keyLayoutType === "grid_scroll" && {
						direction: scrollDirection,
					}),
				},
				key_style: keyStyle,
				keys: keys, // 本来は整形されたキーデータ
			},
		};
		const jsonString = JSON.stringify(custardData, null, 2);
		console.log(jsonString);

		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${custardData.identifier}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		setError(null); // エラーをクリア
	};

	const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = async (e) => {
			try {
				const text = e.target?.result;
				if (typeof text !== "string") {
					setError("ファイルの内容を読み取れませんでした。");
					return;
				}
				const parsedJson: unknown = JSON.parse(text); // unknown型としてパース

				// まず単体のCustardとしてバリデーション
				const singleCustardSchemaJson = zodToJsonSchema(
					CustardSchema,
					"custardSchema",
				);
				const validateSingle = ajv.compile<Custard>(singleCustardSchemaJson);

				if (validateSingle(parsedJson)) {
					// validateSingle(parsedJson) が true の場合、parsedJson は Custard 型として扱える
					setCustard(parsedJson);
					// フォームに値をセット
					setIdentifier(parsedJson.identifier);
					setLanguage(parsedJson.language);
					setInputStyle(parsedJson.input_style);
					setCustardVersion(parsedJson.metadata.custard_version);
					setDisplayName(parsedJson.metadata.display_name);
					setKeyLayoutType(parsedJson.interface.key_layout.type);
					setRowCount(parsedJson.interface.key_layout.row_count);
					setColumnCount(parsedJson.interface.key_layout.column_count);
					if (parsedJson.interface.key_layout.type === "grid_scroll") {
						setScrollDirection(
							parsedJson.interface.key_layout.direction || "vertical",
						);
					}
					setKeyStyle(parsedJson.interface.key_style);
					setKeys(parsedJson.interface.keys);
					setError(null);
					console.log(
						"Custard JSON (single) loaded and validated:",
						parsedJson,
					);
					return;
				}

				// 単体でダメなら配列形式でバリデーション
				const arrayCustardSchemaJson = zodToJsonSchema(
					CustardArraySchema,
					"custardArraySchema",
				);
				const validateArray = ajv.compile<Custard[]>(arrayCustardSchemaJson);

				if (validateArray(parsedJson)) {
					// validateArray(parsedJson) が true の場合、parsedJson は Custard[] 型として扱える
					// 配列の場合は最初の要素を読み込むか、別途UIで選択させるなど検討が必要
					// ここでは最初の要素を読み込む例
					if (parsedJson.length > 0) {
						const firstCustard = parsedJson[0];
						setCustard(firstCustard);
						// フォームに値をセット
						setIdentifier(firstCustard.identifier);
						setLanguage(firstCustard.language);
						setInputStyle(firstCustard.input_style);
						setCustardVersion(firstCustard.metadata.custard_version);
						setDisplayName(firstCustard.metadata.display_name);
						setKeyLayoutType(firstCustard.interface.key_layout.type);
						setRowCount(firstCustard.interface.key_layout.row_count);
						setColumnCount(firstCustard.interface.key_layout.column_count);
						if (firstCustard.interface.key_layout.type === "grid_scroll") {
							setScrollDirection(
								firstCustard.interface.key_layout.direction || "vertical",
							);
						}
						setKeyStyle(firstCustard.interface.key_style);
						setKeys(firstCustard.interface.keys);
						setError(null);
						console.log(
							"Custard JSON (first of array) loaded and validated:",
							firstCustard,
						);
					} else {
						setError("アップロードされたJSON配列が空です。");
					}
					return;
				}

				// どちらのスキーマにも一致しない場合
				// ajv.errors は ajv インスタンスのプロパティで、最後の検証エラーを保持します。
				setError(`JSONの形式が正しくありません: ${ajv.errorsText(ajv.errors)}`);
				console.error("Validation errors:", ajv.errors);
			} catch (err) {
				setError(
					`JSONのパースに失敗しました: ${err instanceof Error ? err.message : String(err)}`,
				);
				console.error("Error parsing JSON:", err);
			}
		};
		reader.readAsText(file);
	};

	return (
		<div className="container">
			<h1>azooKeyカスタムタブエディタ</h1>

			<section>
				<h2>ファイル操作</h2>
				<div>
					<label htmlFor="file-upload">Custard JSONをアップロード: </label>
					<input
						type="file"
						id="file-upload"
						accept=".json,.txt,.custard"
						onChange={handleFileUpload}
					/>
				</div>
				{error && <p className="error-message">{error}</p>}
			</section>

			<section>
				<h2>メタデータ</h2>
				<div>
					<label htmlFor="identifier">Identifier: </label>
					<input
						type="text"
						id="identifier"
						value={identifier}
						onChange={(e) => setIdentifier(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="language">Language: </label>
					<select
						id="language"
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
					>
						<option value="ja_JP">日本語 (ja_JP)</option>
						<option value="en_US">英語 (en_US)</option>
						<option value="el_GR">ギリシャ語 (el_GR)</option>
						<option value="undefined">指定なし (undefined)</option>
						<option value="none">変換なし (none)</option>
					</select>
				</div>
				<div>
					<label htmlFor="inputStyle">Input Style: </label>
					<select
						id="inputStyle"
						value={inputStyle}
						onChange={(e) => setInputStyle(e.target.value)}
					>
						<option value="direct">Direct</option>
						<option value="roman2kana">Roman to Kana</option>
					</select>
				</div>
				<div>
					<label htmlFor="custardVersion">Custard Version: </label>
					<input
						type="text"
						id="custardVersion"
						value={custardVersion}
						onChange={(e) => setCustardVersion(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="displayName">Display Name: </label>
					<input
						type="text"
						id="displayName"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
				</div>
			</section>

			<section>
				<h2>インターフェース</h2>
				<h3>キーレイアウト</h3>
				<div>
					<label htmlFor="keyLayoutType">Layout Type: </label>
					<select
						id="keyLayoutType"
						value={keyLayoutType}
						onChange={(e) =>
							setKeyLayoutType(e.target.value as "grid_fit" | "grid_scroll")
						}
					>
						<option value="grid_fit">Grid Fit</option>
						<option value="grid_scroll">Grid Scroll</option>
					</select>
				</div>
				<div>
					<label htmlFor="rowCount">Row Count: </label>
					<input
						type="number"
						id="rowCount"
						value={rowCount}
						onChange={(e) => setRowCount(Number(e.target.value))}
					/>
				</div>
				<div>
					<label htmlFor="columnCount">Column Count: </label>
					<input
						type="number"
						id="columnCount"
						value={columnCount}
						onChange={(e) => setColumnCount(Number(e.target.value))}
					/>
				</div>
				{keyLayoutType === "grid_scroll" && (
					<div>
						<label htmlFor="scrollDirection">Scroll Direction: </label>
						<select
							id="scrollDirection"
							value={scrollDirection}
							onChange={(e) =>
								setScrollDirection(e.target.value as "vertical" | "horizontal")
							}
						>
							<option value="vertical">Vertical</option>
							<option value="horizontal">Horizontal</option>
						</select>
					</div>
				)}
				<h3>キースタイル</h3>
				<div>
					<label htmlFor="keyStyle">Key Style: </label>
					<select
						id="keyStyle"
						value={keyStyle}
						onChange={(e) =>
							setKeyStyle(e.target.value as "tenkey_style" | "pc_style")
						}
					>
						<option value="tenkey_style">Tenkey Style</option>
						<option value="pc_style">PC Style</option>
					</select>
				</div>
			</section>

			<section>
				<h2>キー設定</h2>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button onClick={handleAddKey}>キーを追加</button>
				<div className="keys-preview">
					{keys.map((key) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={key.temp_id} className="key-preview">
							{key.label}
						</div>
					))}
				</div>
			</section>

			<section>
				<h2>生成</h2>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button onClick={generateCustardJson}>
					Custard JSON生成・ダウンロード
				</button>
			</section>
		</div>
	);
}

export default App;
