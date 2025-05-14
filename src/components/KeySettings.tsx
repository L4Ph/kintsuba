import type { Custard } from "../custardSchema";

interface KeySettingsProps {
	keys: Custard["interface"]["keys"];
	handleAddKey: () => void;
}

export function KeySettings({ keys, handleAddKey }: KeySettingsProps) {
	return (
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
	);
}
