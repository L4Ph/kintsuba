interface MetadataEditorProps {
	identifier: string;
	setIdentifier: (value: string) => void;
	language: string;
	setLanguage: (value: string) => void;
	inputStyle: string;
	setInputStyle: (value: string) => void;
	custardVersion: string;
	setCustardVersion: (value: string) => void;
	displayName: string;
	setDisplayName: (value: string) => void;
}

export function MetadataEditor({
	identifier,
	setIdentifier,
	language,
	setLanguage,
	inputStyle,
	setInputStyle,
	custardVersion,
	setCustardVersion,
	displayName,
	setDisplayName,
}: MetadataEditorProps) {
	return (
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
	);
}
