import React, { useContext, useState } from 'react';
import newRequest from '../../utils/newRequest';
import { useQuery } from '@tanstack/react-query';

const TimeTable = () => {
    const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
    const {userId} = userData.user;
    const { isLoading, error, data: activeCourses = [] } = useQuery({
        queryKey: ["courses"],
        queryFn: () =>
          newRequest.get(`/student/${userId}/courses`).then((res) => {
            console.log("Course data received:", res.data);
            return res.data.courses || [];
          }),
    });
    const timings = [
        "8:00 - 8:55", "9:00 - 9:55", "10:00 - 10:55", "11:00 - 11:55", "12:00 - 12:55", "1:00 - 1:55", "2:00 - 2:55", "3:00 - 3:55", "4:00 - 4:55", "5:00 - 5:55"
      ];

    // const [activeCourses] = useState([
    //     {
    //       id: "CS101",
    //       name: "Introduction to Computer Science",
    //       slot: "A",
    //     },
    //     {
    //       id: "MATH202",
    //       name: "Calculus II",
    //       slot: "B",
    //     },
    //     {
    //       id: "ENG105",
    //       name: "Academic Writing",
    //       slot: "C",
    //     },
    //     {
    //       id: "PHYS101",
    //       name: "Physics for Engineers",
    //       slot: "D",
    //     },
    //     {
    //         id: "PHYS102",
    //         name: "Physics for Engineers",
    //         slot: "E",
    //       },
    //       {
    //         id: "PHYS103",
    //         name: "Physics for Engineers",
    //         slot: "F",
    //       },
    //       {
    //         id: "PHYS104",
    //         name: "Physics for Engineers",
    //         slot: "G",
    //       },
    //       {
    //         id: "PHYS105",
    //         name: "Physics for Engineers",
    //         slot: "AL1",
    //       },
    //       {
    //         id: "PHYS106",
    //         name: "Physics for Engineers",
    //         slot: "AL2",
    //       },
    //       {
    //         id: "PHYS107",
    //         name: "Physics for Engineers",
    //         slot: "AL3",
    //       },
    //       {
    //         id: "PHYS108",
    //         name: "Physics for Engineers",
    //         slot: "AL4",
    //       },
    //       {
    //         id: "PHYS109",
    //         name: "Physics for Engineers",
    //         slot: "AL5",
    //       },
    //   ]);
    
    // const [activeCourses] = useState([
    //     {
    //       id: "CS101",
    //       name: "Introduction to Computer Science",
    //       slot: "A1",
    //     },
    //     {
    //       id: "MATH202",
    //       name: "Calculus II",
    //       slot: "B1",
    //     },
    //     {
    //       id: "ENG105",
    //       name: "Academic Writing",
    //       slot: "C1",
    //     },
    //     {
    //       id: "PHYS101",
    //       name: "Physics for Engineers",
    //       slot: "D1",
    //     },
    //     {
    //         id: "PHYS102",
    //         name: "Physics for Engineers",
    //         slot: "E1",
    //       },
    //       {
    //         id: "PHYS103",
    //         name: "Physics for Engineers",
    //         slot: "F1",
    //       },
    //       {
    //         id: "PHYS104",
    //         name: "Physics for Engineers",
    //         slot: "G1",
    //       },
    //       {
    //         id: "PHYS105",
    //         name: "Physics for Engineers",
    //         slot: "ML1",
    //       },
    //       {
    //         id: "PHYS106",
    //         name: "Physics for Engineers",
    //         slot: "ML2",
    //       },
    //       {
    //         id: "PHYS107",
    //         name: "Physics for Engineers",
    //         slot: "ML3",
    //       },
    //       {
    //         id: "PHYS108",
    //         name: "Physics for Engineers",
    //         slot: "ML4",
    //       },
    //       {
    //         id: "PHYS109",
    //         name: "Physics for Engineers",
    //         slot: "ML5",
    //       },
    //   ]);
      
      const slotToCourseMap = activeCourses.reduce((map, course) => {
        map[course.slot] = course.id;
        return map;
      }, {});

    return (
        <>
        {isLoading? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : 
            <>
            <div className="flex justify-center py-6">
                <h3 className="text-3xl font-bold text-gray-800">Time-Table</h3>
            </div>

            <div className="p-4">
                <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                    <table className="min-w-full text-center">
                        <thead className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                            <tr>
                                <th className="px-6 py-4 text-lg font-semibold border-b border-gray-200">Day / Time</th>
                                {timings.map((timing, index) => (
                                    <th key={index} className="px-6 py-4 text-md border-b border-gray-200">
                                        {timing}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="text-gray-700">
                            {/* Monday */}
                            <tr className="hover:bg-gray-100 transition-all">
                                <td className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold px-6 py-4 border-b">
                                    Monday
                                </td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["A"]}</td>
                                {slotToCourseMap["ML1"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["B"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["C"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["D"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["ML1"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["F"]}</td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["F1"]}</td>
                                {slotToCourseMap["AL1"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["D1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["C1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["B1"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["AL1"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["A1"]}</td>
                            </tr>

                            {/* Tuesday */}
                            <tr className="hover:bg-gray-100 transition-all">
                                <td className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold px-6 py-4 border-b">
                                    Tuesday
                                </td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["E"]}</td>
                                {slotToCourseMap["ML2"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["A"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["B"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["C"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["ML2"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["F"]}</td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["F1"]}</td>
                                {slotToCourseMap["AL2"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["C1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["B1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["A1"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["AL2"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["E1"]}</td>
                            </tr>

                            {/* Wednesday */}
                            <tr className="hover:bg-gray-100 transition-all">
                                <td className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold px-6 py-4 border-b">
                                    Wednesday
                                </td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["D"]}</td>
                                {slotToCourseMap["ML3"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["E"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["A"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["B"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["ML3"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["G"]}</td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["G1"]}</td>
                                {slotToCourseMap["AL3"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["B1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["A1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["E1"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["AL3"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["D1"]}</td>
                            </tr>

                            {/* Thursday */}
                            <tr className="hover:bg-gray-100 transition-all">
                                <td className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold px-6 py-4 border-b">
                                    Thursday
                                </td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["C"]}</td>
                                {slotToCourseMap["ML4"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["D"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["E"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["A"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["ML4"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["G"]}</td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["G1"]}</td>
                                {slotToCourseMap["AL4"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["A1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["E1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["D1"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["AL4"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["C1"]}</td>
                            </tr>

                            {/* Friday */}
                            <tr className="hover:bg-gray-100 transition-all">
                                <td className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold px-6 py-4 border-b">
                                    Friday
                                </td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["B"]}</td>
                                {slotToCourseMap["ML5"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["C"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["D"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["E"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["ML5"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["G"]}</td>
                                <td className="px-6 py-4 border-b">{slotToCourseMap["G1"]}</td>
                                {slotToCourseMap["AL5"] === undefined ? (
                                    <>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["F1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["D1"]}</td>
                                        <td className="px-6 py-4 border-b">{slotToCourseMap["C1"]}</td>
                                    </>
                                ) : (
                                    <td colSpan="3" className="px-6 py-4 border-b">{slotToCourseMap["AL5"]}</td>
                                )}
                                <td className="px-6 py-4 border-b">{slotToCourseMap["B1"]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
        }
        </>
    );
};

export default TimeTable;