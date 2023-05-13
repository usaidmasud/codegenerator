"use client";
import React, { useState } from "react";
import { read, utils, writeFile } from "xlsx";

type TData = {
  kode: string;
  nama: string;
  jenis: string;
};

const temp: TData[] = [
  {
    kode: "",
    nama: "nama barang satu",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama barang dua",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama test 3",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama barang dua",
    jenis: "jenis",
  },
  {
    kode: "",
    nama: "nama waduh le",
    jenis: "jenis",
  },
];

export default function Home() {
  const [original, setOriginal] = useState<TData[]>();
  const [generatedCode, setGeneratedCode] = useState<TData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(true);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event?.target?.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows: TData[] = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          setOriginal(rows);
          setShowOriginal(true);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExport = () => {
    const headings = [["Nama", "Jenis", "Kode"]];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, generatedCode, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Generate");
    writeFile(wb, "Hasil Generate.xlsx");
  };

  const getFirstCharacter = (text: string) => {
    // convert str to array
    let result = [""];
    result = text.split(" ").map((t) => Array.from(t)[0]);
    return result.join("");
  };

  const generateCode = (data: TData, lastGenerated: TData[]): string => {
    const code =
      getFirstCharacter(data.jenis) + "-" + getFirstCharacter(data.nama);
    // check code is exists
    return code.toUpperCase();
  };

  const isValidCode = (data: TData[], keyword: string) => {
    const found = data.find((obj) => {
      return obj.kode === keyword;
    });
    return found ? true : false;
  };

  const handleGenerate = () => {
    try {
      setLoading(true);
      setGeneratedCode([]);
      console.log("clear", generatedCode);
      original?.map((item) => {
        let code = generateCode(item, generatedCode);
        setGeneratedCode((prevState) => [
          ...prevState,
          { ...item, kode: code },
        ]);
      });
      setShowOriginal(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between m-8 md:m-24">
      <div className="w-full flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between">
        <div className="">
          <label
            htmlFor="file"
            className="px-4 py-2 text-sm bg-teal-500 rounded-md font-medium hover:bg-teal-600 ring-1 ring-teal-500 hover:ring-teal-600 text-white cursor-pointer  flex items-center justify-center gap-2 "
          >
            Upload File Excel
          </label>
          <input
            type="file"
            name="file"
            className="hidden"
            id="file"
            required
            onChange={(e) => handleImport(e)}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </div>
        <a
          href="/format-excel.xlsx"
          download
          className="flex items-center gap-2 justify-center px-4 py-2 text-sm text-teal-500 rounded-md font-medium ring-1 ring-teal-500 hover:bg-teal-500 hover:text-white  "
        >
          Download Format
        </a>
        <button
          className="flex items-center gap-2 justify-center px-4 py-2 text-sm text-teal-500 rounded-md font-medium ring-1 ring-teal-500 hover:bg-teal-500 hover:text-white  "
          onClick={handleExport}
        >
          Download Hasil
        </button>
      </div>
      <div className="w-full border rounded-md p-2 border-gray-200 shadow-lg mt-8">
        <div className="p-4 inline-flex gap-2">
          <div className="flex items-center">
            <input
              id="check-original"
              type="checkbox"
              onChange={(e) => setShowOriginal(e.target.checked)}
              checked={showOriginal}
              className="w-4 h-4 accent-teal-500 text-teal-600 bg-teal-100 border-teal-300 rounded focus:ring-teal-500 "
            />
            <label
              htmlFor="check-original"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Show Original
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="check-result"
              type="checkbox"
              onChange={(e) => setShowResult(e.target.checked)}
              checked={showResult}
              className="w-4 h-4 accent-teal-500 text-teal-600 bg-teal-100 border-teal-300 rounded focus:ring-teal-500 "
            />
            <label
              htmlFor="check-result"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Show Result
            </label>
          </div>
        </div>

        <div className="relative overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="inline-flex items-center gap-2">
                    <span>Kode Barang</span>
                    <button
                      disabled={loading}
                      className="px-2 py-1.5 rounded-md bg-emerald-500 text-white"
                      onClick={() => {
                        handleGenerate();
                      }}
                    >
                      {loading ? "Please wait" : "Generate"}
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Nama Barang
                </th>
                <th scope="col" className="px-6 py-3">
                  Jenis Barang
                </th>
              </tr>
            </thead>
            <tbody>
              {showOriginal &&
                (original ?? []).map((item, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-6 py-4">{++index}</td>
                    <td className="px-6 py-4">{item.kode}</td>
                    <td className="px-6 py-4">{item.nama}</td>
                    <td className="px-6 py-4">{item.jenis}</td>
                  </tr>
                ))}
              {showResult && (
                <React.Fragment>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4" colSpan={6}>
                      Result
                    </td>
                  </tr>
                  {(generatedCode ?? []).map((item, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4">{++index}</td>
                      <td className="px-6 py-4">{item.kode.toUpperCase()}</td>
                      <td className="px-6 py-4">{item.nama}</td>
                      <td className="px-6 py-4">{item.jenis}</td>
                    </tr>
                  ))}
                </React.Fragment>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
