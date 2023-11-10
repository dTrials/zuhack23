import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

interface HR_Data {
  id: number;
  hr: string;
  date_time: string;
}

export default function Data() {
  const nullifier = localStorage.getItem("user");
  const [data, setData] = useState<HR_Data[]>([]);

  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    try {
      const { data, error } = await supabase
        .from("hr_data")
        .select("*")
        .eq("nullifier", nullifier);

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        // Assuming userData is an array of objects
        setData(data as HR_Data[]);
      }
    } catch (error) {
      console.error("Error in getUserData:", error);
    }
  }

  // Convert date string to Date object
  //   const formatDate = (dateString: string) => {
  //     const options = { year: "numeric", month: "long", day: "numeric" };
  //     return new Date(dateString).toLocaleDateString(undefined, options);
  //   };

  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>Your Heart Rate Data</h1>
      {data.map((d) => (
        <div key={d.id} className='border p-4 mb-4 rounded'>
          <p className='text-lg font-semibold'>Heart Rate: {d.hr}</p>
          {/* <p className='text-gray-500'>Date: {formatDate(d.date_time)}</p> */}
        </div>
      ))}
    </div>
  );
}
