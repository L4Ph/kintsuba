import { useState } from "react";
import "./App.css";

// 型定義 (簡易版)
interface CustardMetadata {
	custard_version: string;
	display_name: string;
}

interface CustardKeyLayout {
	type: "grid_fit" | "grid_scroll";
	row_count: number;
	column_count: number;
	direction?: "vertical" | "horizontal";
}

interface CustardInterface {
	key_layout: CustardKeyLayout;
	key_style: "tenkey_style" | "pc_style";
	keys: unknown[]; // とりあえず unknown
}

interface Custard {
	identifier: string;
	language: string;
	input_style: string;
	metadata: CustardMetadata;
	interface: CustardInterface;
}

function App() {
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

	const handleAddKey = () => {
		// ダミーのキーデータを追加
		setKeys([
			...keys,
			{ temp_id: Date.now(), label: `キー ${keys.length + 1}` },
		]);
	};

	const generateCustardJson = () => {
		const custardData: Custard = {
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
		console.log(JSON.stringify(custardData, null, 2));
		// ここでJSON出力処理を行う (例: ダウンロード)
	};

	return (
		<div className="container">
			<h1>azooKeyカスタムタブエディタ</h1>

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
					Custard JSON生成 (コンソール出力)
				</button>
			</section>
		</div>
	);
}

export default App;
