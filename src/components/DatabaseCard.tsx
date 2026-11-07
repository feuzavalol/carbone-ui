import type { CompleteFood } from "../types/foodTypes";
import type { CompleteGood } from "../types/goodsTypes";
import { useRouteChange } from "./helper/onRouteChange";
import buildPath from "../fetching/helper/buildPath";
import "./style/FoodCard.css";
import "./style/GoodCard.css";

type CompleteItem = CompleteFood | CompleteGood;

function FoodCard({ food }: { food: CompleteFood }) {
    const { goTo } = useRouteChange();

    return (
        <div className="food-card" onClick={() => goTo(buildPath("/db/food/details", { id: food.id }))}>
        <h3 className="food-card__name">{food.name}</h3>
        <p className="food-card__category">{food.foodGroup}</p>
        <span className="food-card__cost">{food.costPerUnit}{food.unit}</span>
        </div>
    );
}

function FoodGrid({ foods }: { foods: CompleteFood[] }) {
  return (
    <div className="food-grid">
      {foods.map((food) => (
        <FoodCard food={food} key={food.id} {...food} />
      ))}
    </div>
  );
}

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "expectedUnit", label: "Expected unit" },
  { key: "costPerUnit", label: "Cost per unit" },
  { key: "unit", label: "Unit" },
  { key: "category", label: "Category" },
  { key: "source", label: "Source" },
  { key: "details", label: "Details" },
  { key: "comments", label: "Comments" },
];

// Accepts a single item object or an array of items.
export default function ItemTable({ items = [] }: {items: CompleteItem[]}) {
  const rows = Array.isArray(items) ? items : [items];
  const { goTo } = useRouteChange();

  return (
    <div className="sheet-wrap" >
      <table className="sheet">
        <thead>
          <tr>
            <th className="sheet-corner"></th>
            {COLUMNS.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => (
            <tr key={i} onClick={() => goTo(buildPath("/db/goods/details",{ id: item.id }))}>
              <th className="sheet-rownum">{i + 1}</th>
              {COLUMNS.map((col) => (
                <td key={col.key}>{item[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GoodGrid({ goods }: { goods: CompleteGood[] }){
  return (
    <div className="food-grid">
      <ItemTable items={goods} />
      {/* {goods.map((good) => (
        <GoodCard good={good} key={good.id} {...good} />
      ))} */}
    </div>
  );
}

export { FoodGrid, FoodCard, GoodGrid }