import type { ChangeEvent } from "react";

interface FileOperationsProps {
	handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
	error: string | null;
}

export function FileOperations({
	handleFileUpload,
	error,
}: FileOperationsProps) {
	return (
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
	);
}
