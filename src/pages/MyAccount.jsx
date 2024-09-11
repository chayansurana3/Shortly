import React from "react";

export default function MyAccount(props) {
    const { urlsData } = props; 

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 mx-auto">User Data</h2>
                
                <table className="w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600">
                            <th className="py-2 px-4 border-b">S.No</th>
                            <th className="py-2 px-4 border-b">Original URL</th>
                            <th className="py-2 px-4 border-b">Shortened URL</th>
                            <th className="py-2 px-4 border-b">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {urlsData?.length ? (
                            urlsData.map((item, index) => (
                                <tr key={index} className="text-gray-700">
                                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                                    <td className="py-2 px-4 border-b">{item.originalUrl}</td>
                                    <td className="py-2 px-4 border-b">{item.shortenedUrl}</td>
                                    <td className="py-2 px-4 border-b">{item.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {props.loading ? <div className="text-center items-center p-4 inline-flex"><span class="animate-ping inline-block h-5 w-5 mr-5 rounded-full bg-sky-500 opacity-75"></span><span class="animate-ping inline-block h-5 w-5 mr-5 rounded-full bg-sky-500 opacity-75"></span><span class="animate-ping inline-block h-5 w-5 mr-5 rounded-full bg-sky-500 opacity-75"></span></div> :
                                    <td colSpan="4" className="py-2 px-4 text-center text-gray-500">No data available</td>
                                }
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
