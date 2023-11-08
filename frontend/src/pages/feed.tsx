import axios from "axios";
import { useState } from "react";

export default function Feed() {
  const [csvData, setCsvData] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: any) => {
    setUploadError(null);
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post<string[]>("/api/upload-csv", formData);
      setCsvData(response.data);
    } catch (error) {
      setUploadError("An error occurred during the file upload.");
      console.error(error);
    }
  };

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>Cute Feed Page</h1>

      <input
        type='file'
        accept='.csv'
        onChange={handleFileUpload}
        className='mb-4'
      />

      {uploadError && <div className='text-red-500 mb-4'>{uploadError}</div>}

      <div className='border border-gray-200 p-4 rounded'>
        <h2 className='text-xl font-semibold mb-2'>CSV Data:</h2>
        <div className='text-gray-700'>
          {csvData.map((row, index) => (
            <div key={index}>{row}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
