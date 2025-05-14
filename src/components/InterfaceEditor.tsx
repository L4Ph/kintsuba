interface InterfaceEditorProps {
	keyLayoutType: "grid_fit" | "grid_scroll";
	setKeyLayoutType: (value: "grid_fit" | "grid_scroll") => void;
	rowCount: number;
	setRowCount: (value: number) => void;
	columnCount: number;
	setColumnCount: (value: number) => void;
	scrollDirection: "vertical" | "horizontal";
	setScrollDirection: (value: "vertical" | "horizontal") => void;
	keyStyle: "tenkey_style" | "pc_style";
	setKeyStyle: (value: "tenkey_style" | "pc_style") => void;
}

export function InterfaceEditor({
	keyLayoutType,
	setKeyLayoutType,
	rowCount,
	setRowCount,
	columnCount,
	setColumnCount,
	scrollDirection,
	setScrollDirection,
	keyStyle,
	setKeyStyle,
}: InterfaceEditorProps) {
	return (
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
	);
}
