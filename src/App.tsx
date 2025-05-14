import { useState } from "react";
import type { ChangeEvent } from "react";
import "./App.css";
import Ajv from "ajv";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
	CustardSchema,
	CustardArraySchema,
	type Custard,
} from "./custardSchema";
import { FileOperations } from "./components/FileOperations";
import { MetadataEditor } from "./components/MetadataEditor";
import { InterfaceEditor } from "./components/InterfaceEditor";
import { KeySettings } from "./components/KeySettings";
import { Generator } from "./components/Generator";

const ajv = new Ajv();

function App() {
	const [custard, setCustard] = useState<Custard | null>(null);
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

	const [keys, setKeys] = useState<Custard["interface"]["keys"]>([]);
	const [error, setError] = useState<string | null>(null);

	const handleAddKey = () => {
		setKeys([
			...keys,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			{ temp_id: Date.now(), label: `キー ${keys.length + 1}` } as any,
		]);
	};

	const generateCustardJson = () => {
		if (!custard && !identifier) {
			setError("データが読み込まれていません。");
			return;
		}

		const custardData: Custard = custard ?? {
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
				keys: keys,
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
		setError(null);
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
				const parsedJson: unknown = JSON.parse(text);

				const singleCustardSchemaJson = zodToJsonSchema(
					CustardSchema,
					"custardSchema",
				);
				const validateSingle = ajv.compile<Custard>(singleCustardSchemaJson);

				if (validateSingle(parsedJson)) {
					setCustard(parsedJson);
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

				const arrayCustardSchemaJson = zodToJsonSchema(
					CustardArraySchema,
					"custardArraySchema",
				);
				const validateArray = ajv.compile<Custard[]>(arrayCustardSchemaJson);

				if (validateArray(parsedJson)) {
					if (parsedJson.length > 0) {
						const firstCustard = parsedJson[0];
						setCustard(firstCustard);
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

			<FileOperations handleFileUpload={handleFileUpload} error={error} />

			<MetadataEditor
				identifier={identifier}
				setIdentifier={setIdentifier}
				language={language}
				setLanguage={setLanguage}
				inputStyle={inputStyle}
				setInputStyle={setInputStyle}
				custardVersion={custardVersion}
				setCustardVersion={setCustardVersion}
				displayName={displayName}
				setDisplayName={setDisplayName}
			/>

			<InterfaceEditor
				keyLayoutType={keyLayoutType}
				setKeyLayoutType={setKeyLayoutType}
				rowCount={rowCount}
				setRowCount={setRowCount}
				columnCount={columnCount}
				setColumnCount={setColumnCount}
				scrollDirection={scrollDirection}
				setScrollDirection={setScrollDirection}
				keyStyle={keyStyle}
				setKeyStyle={setKeyStyle}
			/>

			<KeySettings keys={keys} handleAddKey={handleAddKey} />

			<Generator generateCustardJson={generateCustardJson} />
		</div>
	);
}

export default App;
