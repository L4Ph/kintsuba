interface GeneratorProps {
	generateCustardJson: () => void;
}

export function Generator({ generateCustardJson }: GeneratorProps) {
	return (
		<section>
			<h2>生成</h2>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button onClick={generateCustardJson}>
				Custard JSON生成・ダウンロード
			</button>
		</section>
	);
}
