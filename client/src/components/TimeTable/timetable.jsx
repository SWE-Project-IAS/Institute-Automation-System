import React, { useContext, useState } from 'react';

const TimeTable = () => {
    const timings = [
        "8:00 - 8:55", "9:00 - 9:55", "10:00 - 10:55", "11:00 - 11:55", "12:00 - 12:55", "1:00 - 1:55", "2:00 - 2:55", "3:00 - 3:55", "4:00 - 4:55", "5:00 - 5:55"
      ];

    const [activeCourses] = useState([
        {
          id: "CS101",
          name: "Introduction to Computer Science",
          slot: "A",
        },
        {
          id: "MATH202",
          name: "Calculus II",
          slot: "B",
        },
        {
          id: "ENG105",
          name: "Academic Writing",
          slot: "C",
        },
        {
          id: "PHYS101",
          name: "Physics for Engineers",
          slot: "D",
        },
        {
            id: "PHYS102",
            name: "Physics for Engineers",
            slot: "E",
          },
          {
            id: "PHYS103",
            name: "Physics for Engineers",
            slot: "F",
          },
          {
            id: "PHYS104",
            name: "Physics for Engineers",
            slot: "G",
          },
          {
            id: "PHYS105",
            name: "Physics for Engineers",
            slot: "AL1",
          },
          {
            id: "PHYS106",
            name: "Physics for Engineers",
            slot: "AL2",
          },
          {
            id: "PHYS107",
            name: "Physics for Engineers",
            slot: "AL3",
          },
          {
            id: "PHYS108",
            name: "Physics for Engineers",
            slot: "AL4",
          },
          {
            id: "PHYS109",
            name: "Physics for Engineers",
            slot: "AL5",
          },
      ]);
    
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
        <div className="flex justify-center py-3">
            <h3 className="text-2xl font-bold">Time-Table</h3>
        </div>

        <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-black text-center">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-black px-4 py-2">Day\Time</th>
              {timings.map((timing, index) => (
                <th key={index} className="border border-black py-2">
                  {timing}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
          <tr key="monday" className={"bg-blue-100"}>
            <td className="bg-blue-600 text-white font-bold border border-black">Monday</td>
            <td key="0" className="border border-black px-4 py-2">{slotToCourseMap["A"]}</td>
            {slotToCourseMap["ML1"] === undefined ? <>
                <td key="1" className="border border-black px-4 py-2">{slotToCourseMap["B"]}</td>
                <td key="2" className="border border-black px-4 py-2">{slotToCourseMap["C"]}</td>
                <td key="3" className="border border-black px-4 py-2">{slotToCourseMap["D"]}</td>
            </> : <>
                <td key="10" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["ML1"]}</td>
            </>}
            <td key="4" className="border border-black px-4 py-2">{slotToCourseMap["F"]}</td>
            <td key="5" className="border border-black px-4 py-2">{slotToCourseMap["F1"]}</td>
            {slotToCourseMap["AL1"] === undefined ? <>
                <td key="6" className="border border-black px-4 py-2">{slotToCourseMap["D1"]}</td>
                <td key="7" className="border border-black px-4 py-2">{slotToCourseMap["C1"]}</td>
                <td key="8" className="border border-black px-4 py-2">{slotToCourseMap["B1"]}</td>
            </> : <>
                <td key="11" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["AL1"]}</td>
            </>}
            <td key="9" className="border border-black px-4 py-2">{slotToCourseMap["A1"]}</td>
            </tr>

            <tr key="tuesday" className="bg-blue-50">
                <td className="bg-blue-600 text-white font-bold border border-black">Tuesday</td>
                <td key="0" className="border border-black px-4 py-2">{slotToCourseMap["E"]}</td>
                {slotToCourseMap["ML2"] === undefined ? (
                    <>
                    <td key="1" className="border border-black px-4 py-2">{slotToCourseMap["A"]}</td>
                    <td key="2" className="border border-black px-4 py-2">{slotToCourseMap["B"]}</td>
                    <td key="3" className="border border-black px-4 py-2">{slotToCourseMap["C"]}</td>
                    </>
                ) : (
                    <td key="10" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["ML2"]}</td>
                )}
                <td key="4" className="border border-black px-4 py-2">{slotToCourseMap["F"]}</td>
                <td key="5" className="border border-black px-4 py-2">{slotToCourseMap["F1"]}</td>
                {slotToCourseMap["AL2"] === undefined ? (
                    <>
                    <td key="6" className="border border-black px-4 py-2">{slotToCourseMap["C1"]}</td>
                    <td key="7" className="border border-black px-4 py-2">{slotToCourseMap["B1"]}</td>
                    <td key="8" className="border border-black px-4 py-2">{slotToCourseMap["A1"]}</td>
                    </>
                ) : (
                    <td key="11" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["AL2"]}</td>
                )}
                <td key="9" className="border border-black px-4 py-2">{slotToCourseMap["E1"]}</td>
                </tr>

                <tr key="wednesday" className="bg-blue-100">
                <td className="bg-blue-600 text-white font-bold border border-black">Wednesday</td>
                <td key="0" className="border border-black px-4 py-2">{slotToCourseMap["D"]}</td>
                {slotToCourseMap["ML3"] === undefined ? (
                    <>
                    <td key="1" className="border border-black px-4 py-2">{slotToCourseMap["E"]}</td>
                    <td key="2" className="border border-black px-4 py-2">{slotToCourseMap["A"]}</td>
                    <td key="3" className="border border-black px-4 py-2">{slotToCourseMap["B"]}</td>
                    </>
                ) : (
                    <td key="10" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["ML3"]}</td>
                )}
                <td key="4" className="border border-black px-4 py-2">{slotToCourseMap["G"]}</td>
                <td key="5" className="border border-black px-4 py-2">{slotToCourseMap["G1"]}</td>
                {slotToCourseMap["AL3"] === undefined ? (
                    <>
                    <td key="6" className="border border-black px-4 py-2">{slotToCourseMap["B1"]}</td>
                    <td key="7" className="border border-black px-4 py-2">{slotToCourseMap["A1"]}</td>
                    <td key="8" className="border border-black px-4 py-2">{slotToCourseMap["E1"]}</td>
                    </>
                ) : (
                    <td key="11" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["AL3"]}</td>
                )}
                <td key="9" className="border border-black px-4 py-2">{slotToCourseMap["D1"]}</td>
                </tr>

                <tr key="thursday" className="bg-blue-50">
                <td className="bg-blue-600 text-white font-bold border border-black">Thursday</td>
                <td key="0" className="border border-black px-4 py-2">{slotToCourseMap["C"]}</td>
                {slotToCourseMap["ML4"] === undefined ? (
                    <>
                    <td key="1" className="border border-black px-4 py-2">{slotToCourseMap["D"]}</td>
                    <td key="2" className="border border-black px-4 py-2">{slotToCourseMap["E"]}</td>
                    <td key="3" className="border border-black px-4 py-2">{slotToCourseMap["A"]}</td>
                    </>
                ) : (
                    <td key="10" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["ML4"]}</td>
                )}
                <td key="4" className="border border-black px-4 py-2">{slotToCourseMap["G"]}</td>
                <td key="5" className="border border-black px-4 py-2">{slotToCourseMap["G1"]}</td>
                {slotToCourseMap["AL4"] === undefined ? (
                    <>
                    <td key="6" className="border border-black px-4 py-2">{slotToCourseMap["A1"]}</td>
                    <td key="7" className="border border-black px-4 py-2">{slotToCourseMap["E1"]}</td>
                    <td key="8" className="border border-black px-4 py-2">{slotToCourseMap["D1"]}</td>
                    </>
                ) : (
                    <td key="11" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["AL4"]}</td>
                )}
                <td key="9" className="border border-black px-4 py-2">{slotToCourseMap["C1"]}</td>
                </tr>

                <tr key="friday" className="bg-blue-100">
                <td className="bg-blue-600 text-white font-bold border border-black">Friday</td>
                <td key="0" className="border border-black px-4 py-2">{slotToCourseMap["B"]}</td>
                {slotToCourseMap["ML5"] === undefined ? (
                    <>
                    <td key="1" className="border border-black px-4 py-2">{slotToCourseMap["C"]}</td>
                    <td key="2" className="border border-black px-4 py-2">{slotToCourseMap["D"]}</td>
                    <td key="3" className="border border-black px-4 py-2">{slotToCourseMap["F"]}</td>
                    </>
                ) : (
                    <td key="10" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["ML5"]}</td>
                )}
                <td key="4" className="border border-black px-4 py-2">{slotToCourseMap["G"]}</td>
                <td key="5" className="border border-black px-4 py-2">{slotToCourseMap["G1"]}</td>
                {slotToCourseMap["AL5"] === undefined ? (
                    <>
                    <td key="6" className="border border-black px-4 py-2">{slotToCourseMap["F1"]}</td>
                    <td key="7" className="border border-black px-4 py-2">{slotToCourseMap["D1"]}</td>
                    <td key="8" className="border border-black px-4 py-2">{slotToCourseMap["C1"]}</td>
                    </>
                ) : (
                    <td key="11" colSpan="3" className="border border-black px-4 py-2">{slotToCourseMap["AL5"]}</td>
                )}
                <td key="9" className="border border-black px-4 py-2">{slotToCourseMap["B1"]}</td>
                </tr>
          </tbody>
        </table>
      </div>
    </div>
        </>
    );
};

export default TimeTable;