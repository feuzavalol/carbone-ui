import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import type { Dataset, Summary } from "../types/summaryTypes";

ChartJS.register(Tooltip, Legend, ArcElement);


function fillDataset(data: Dataset){
    if (!data.borderColor){
        data.borderColor = "#344e41ff";
    }
    if (!data.borderWidth){
        data.borderWidth = 3;
    }
    if (!data.borderRadius){
        data.borderRadius = 2;
    }
    if (!data.spacing){
        data.spacing = 0;
    }
    if (!data.hoverOffset){
        data.hoverOffset = 14;
    }
    if (!data.hoverBorderColor){
        data.hoverBorderColor = "#3a5a40ff";
    }
    return data;
}

function fillDatasets(datasets: Dataset[] | undefined){
    if (!datasets){
        return [];
    }
    return datasets.map((dataset: Dataset) => {return fillDataset(dataset);});
}

function upgradeLabels(labels: string[] | undefined, dataset: Dataset | undefined){
    if (!labels || !dataset){
        return [];
    }

    return labels.map((label, index) => {
        const newLabel = " " + label + " : " + dataset?.data[index] + "kgCO2éq";
        return newLabel;
    })
}

const options = {
  responsive: true,
  maintainAspectRatio: false,   // lets the container control the size
  layout: { padding: 10 },
  cutout: 90,                    // use e.g. "60%" (with <Doughnut />) for a ring
  animation: { animateRotate: true, duration: 1000, easing: "easeOutQuart" },
  plugins: {
    legend: {
      position: "right",        // "left" | "right" | "top" | "bottom"
      align: "center",          // "start" | "center" | "end"
      labels: {
        usePointStyle: true,    // circles instead of rectangles
        pointStyle: "circle",
        padding: 16,
        boxWidth: 10,
        color: "#dde1e8",
        font: { size: 14, family: "Inter, sans-serif", weight: "500" },
      },
    },
    tooltip: {
      backgroundColor: "#111827",
      padding: 12,
      cornerRadius: 8,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      callbacks: {
        label: (ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const pct = ((ctx.parsed / total) * 100).toFixed(1);
          return ` Total: ${ctx.parsed} kgCO2éq (${pct}%)`;
        },
      },
    },
  },
};

export function PieChart({data}: {data: Summary | null}){
    const filledDatasets: Dataset[] = fillDatasets(data?.datasets);
    const upgradedLabels: string[] = upgradeLabels(data?.labels,data?.datasets[0]);
    const filledData = {labels: upgradedLabels, datasets: filledDatasets};  
    return (
        !data 
        ? <div></div> 
        : <div style={{ height: 350, width: "100%", maxWidth: 600 }}>
            <Pie options={options} data={filledData}></Pie>
        </div>
    );
}