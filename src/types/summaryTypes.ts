type Dataset = {
    label: string,
    data: number[],
    backgroundColor: string[],
    hoverOffset: number,        // slice pops out on hover
    borderColor: string | undefined,   // match your page background
    borderWidth: number | undefined,
    borderRadius: number | undefined,            // rounded slice corners
    spacing: number | undefined,                 // gap between slices
    hoverBorderColor: string | undefined
}

type Summary = {
    labels: string[],
    datasets: Dataset[]
};

// const dataExample = {
//         labels: ["viande","légumes","fruits"],
//         datasets: [
//             {
//                 label: "Catégories",
//                 data: [20,80,10],
//                 backgroundColor: [
//                     "rgba(155, 61, 3, 0.6)",
//                     "rgba(5, 127, 11, 0.54)",
//                     "rgba(15, 5, 168, 0.59)"
//                 ],
//                 hoverOffset: 4,
//             },
//         ],
//     };

export type { Dataset, Summary }