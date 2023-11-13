import React, {
  useState,
  ChangeEvent,
  SyntheticEvent,
  useCallback,
} from "react";
import { supabase } from "../utils/supabase";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CsvParser() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  async function csvFileToArray(string: string) {
    const array = string.split("\n");
    const data: string[][] = [];
    for (const row of array) {
      const rowArray = row.split(",");
      data.push(rowArray);
    }
    const heading = data[0];
    const record_array: Record<string, string>[] = [];
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
      if (parseInt(obj.hr) > 0) {
        // console.log("Object has more than 0 as hr", obj);
        record_array.push(obj);
      }

      if (await userAlreadyUploaded(obj.nullifier)) {
        alert("You've already uploaded data");
      } else {
        record_array.forEach((element) => {
          supabaseInsert(element?.hr, element?.date_time);
        });
      }
      router.push("/data");
    }

    // console.log("CSV in array form", { record_array });
  }

  async function supabaseInsert(hr: string, date_time: string) {
    const nullifier = localStorage.getItem("user");
    console.log("Nullifier", nullifier);

    const { data: hr_data, error } = await supabase
      .from("hr_data")
      .insert([{ hr, date_time, nullifier }])
      .single();

    console.log("Data after inserting", hr_data);
    console.log("Error", error);
  }

  async function userAlreadyUploaded(nullifier: string | null) {
    console.log("Checking if user already uploaded: ", nullifier);

    let { data: hr_data, error } = await supabase
      .from("hr_data")
      .select("nullifier")
      .eq("nullifier", nullifier);

    console.log("Data from table", hr_data);
    console.log("Error", error);

    if (hr_data && hr_data.length > 0) {
      console.log("User already uploaded");
      return true;
    }

    return false;
  }

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
    }
  };

  const logout = useCallback(async () => {
    await axios.post("/api/logout");
    router.push("/");
  }, []);

  return (
    <div className='text-center p-8'>
      <button
        className='bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded'
        onClick={logout}
      >
        Log out
      </button>
      <h1 className='text-3xl font-bold text-red-500 mb-4'>CSV PARSER</h1>
      <form>
        <input
          type='file'
          id='csvFileInput'
          accept='.csv'
          onChange={handleOnChange}
          className='mb-4 p-2 border border-gray-300 rounded'
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
}
