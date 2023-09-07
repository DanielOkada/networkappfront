"use client";
import { useState } from 'react';
import { FileInput, UploadButton } from '../components/forms';


export default function UploadForm({ onUploaded, isLoading=false, isUploaded=false }) {
	const [selectedFile, setSelectedFile] = useState()


	const handleSubmit = (event) => {
		event.preventDefault()

		onUploaded(selectedFile)
	};

	return (
		<form onSubmit={handleSubmit}>
			<FileInput setSelectedFile={setSelectedFile} />
			<UploadButton type="submit" loading={isLoading} success={isUploaded} />
		</form>
	);
}
