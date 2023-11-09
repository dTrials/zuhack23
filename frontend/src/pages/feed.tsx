import React, { useState, ChangeEvent, SyntheticEvent, useEffect } from "react";

const CsvParser: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const csvFileToArray = (string: string) => {
    const array = string.split("\n");
    const data: string[][] = [];
    for (const row of array) {
      const rowArray = row.split(",");
      data.push(rowArray);
    }
    const heading = data[0];
    const ans_array: Record<string, string>[] = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const obj: Record<string, string> = {};
      for (let j = 0; j < heading.length; j++) {
        if (!row[j]) {
          row[j] = "NA";
        }
        const key = heading[j].replaceAll(" ", "_");
        obj[key] = row[j].toString().replaceAll(" ", "_");
      }
      ans_array.push(obj);
    }
    console.log("CSV in array form", { ans_array });
  };

  const handleOnSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        if (event.target && event.target.result) {
          const text = event.target.result as string;
          csvFileToArray(text);
        }
      };

      fileReader.readAsText(file);
      console.log("CSV File", file);
    }
  };

  return (
    <div className='text-center'>
      <h1 className='text-red-500 text-3xl font-bold mb-4'>CSV PARSER</h1>
      <form>
        <input
          type='file'
          id='csvFileInput'
          accept='.csv'
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        >
          IMPORT CSV
        </button>
      </form>
    </div>
  );
};

export default CsvParser;
