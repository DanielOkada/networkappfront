"use client";
import { useState } from 'react';
import { FileInput, UploadButton } from '../components/forms';


export default function UploadForm({ onUploaded, isUploaded=false }) {
	const [selectedFile, setSelectedFile] = useState()
	const [isLoading, setLoading] = useState(false)


	const handleSubmit = (event) => {
		event.preventDefault()
		setLoading(true)

		onUploaded(selectedFile)
	};

	return (
		<form onSubmit={handleSubmit}>
			<FileInput setSelectedFile={setSelectedFile} />
			<UploadButton type="submit" loading={isLoading} success={isUploaded} />
		</form>
	);
}
